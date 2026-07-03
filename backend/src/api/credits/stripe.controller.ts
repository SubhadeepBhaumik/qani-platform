import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../services/auth.service';
import { sendCreditPurchaseEmail } from '../../services/email.service';

const prisma = new PrismaClient();
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://qani.io';

function getAuthUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token) as any;
  if (!decoded) return null;
  return decoded.userId;
}

async function getStripeKeys(): Promise<{ secretKey: string; webhookSecret: string }> {
  const rows = await prisma.platformSetting.findMany({
    where: { key: { in: ['stripeSecretKey', 'stripeWebhookSecret'] } },
  });
  const map: Record<string, string> = {};
  rows.forEach(r => { map[r.key] = r.value; });
  return {
    secretKey: map['stripeSecretKey'] || process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: map['stripeWebhookSecret'] || process.env.STRIPE_WEBHOOK_SECRET || '',
  };
}

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const recruiterId = getAuthUserId(req);
    if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId required' });

    const plan = await prisma.pricingPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) return res.status(404).json({ error: 'Plan not found' });
    if (plan.isCustomPricing) {
      return res.status(400).json({ error: 'This plan requires contacting sales and cannot be purchased directly.' });
    }

    const { secretKey } = await getStripeKeys();
    if (!secretKey || secretKey.indexOf('placeholder') !== -1) {
      return res.status(503).json({ error: 'Payments are not yet configured. Please contact support.' });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2026-05-27.dahlia' as any });
    const recruiter = await prisma.user.findUnique({ where: { id: recruiterId } });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: recruiter?.email,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: plan.price,
            product_data: {
              name: `QANI ${plan.name} Plan`,
              description: `${plan.credits} AI screening credits`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        recruiterId,
        planId: plan.id,
        credits: plan.credits.toString(),
        planName: plan.name,
      },
      success_url: `${FRONTEND_URL}?payment=success&credits=${plan.credits}`,
      cancel_url: `${FRONTEND_URL}?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('createCheckoutSession error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const { secretKey, webhookSecret } = await getStripeKeys();

  if (!secretKey) return res.status(503).json({ error: 'Stripe not configured' });
  const stripe = new Stripe(secretKey, { apiVersion: '2026-05-27.dahlia' as any });

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const meta = session.metadata || {};
    const recruiterId = meta.recruiterId;
    const credits = meta.credits;
    const planName = meta.planName;

    if (!recruiterId || !credits) {
      console.error('Webhook: missing metadata', session.metadata);
      return res.status(200).json({ received: true });
    }

    const creditsToAdd = parseInt(credits, 10);
    let finalBalance = 0;

    const existing = await prisma.creditTransaction.findUnique({ where: { sessionId: session.id } });
    if (existing) {
      console.log(`Webhook: session ${session.id} already processed, skipping duplicate`);
      return res.status(200).json({ received: true });
    }

    try {
      await prisma.$transaction(async (tx) => {
        const record = await tx.recruiterCredits.upsert({
          where: { recruiterId },
          update: { balance: { increment: creditsToAdd } },
          create: { recruiterId, balance: creditsToAdd },
        });
        await tx.creditTransaction.create({
          data: {
            recruiterId,
            type: 'purchase',
            amount: creditsToAdd,
            reason: 'stripe_purchase',
            stripePaymentId: session.payment_intent as string,
            sessionId: session.id,
            balanceAfter: record.balance,
          },
        });
        finalBalance = record.balance;
      });

      console.log(`Credits added: ${creditsToAdd} to recruiter ${recruiterId} (${planName})`);
      try {
        const recruiter = await prisma.user.findUnique({ where: { id: recruiterId } });
        if (recruiter?.email) {
          await sendCreditPurchaseEmail(recruiter.email, recruiter.firstName || 'there', planName || 'QANI Plan', creditsToAdd, session.amount_total || 0, finalBalance);
        }
      } catch (emailErr) {
        console.error('Failed to send purchase confirmation email:', emailErr);
      }
    } catch (err) {
      console.error('Failed to add credits after payment:', err);
    }
  }

  res.status(200).json({ received: true });
}
