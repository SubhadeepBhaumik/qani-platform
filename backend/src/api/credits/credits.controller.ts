import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../services/auth.service';

const prisma = new PrismaClient();

function getAuthUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token) as any;
  if (!decoded) return null;
  return decoded.userId;
}

async function requireAdmin(req: Request): Promise<boolean> {
  const userId = getAuthUserId(req);
  if (userId === null) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === 'admin';
}

export async function getTrialStatus(recruiterId: string): Promise<{
  isOnTrial: boolean;
  trialDaysTotal: number;
  trialExpiresAt: Date;
  daysRemaining: number;
}> {
  let trial = await prisma.recruiterTrial.findUnique({ where: { recruiterId } });

  if (!trial) {
    const user = await prisma.user.findUnique({ where: { id: recruiterId } });
    trial = await prisma.recruiterTrial.create({
      data: {
        recruiterId,
        freeTrialDays: 10,
        registeredAt: user?.createdAt ?? new Date(),
      },
    });
  }

  const expiresAt = new Date(trial.registeredAt);
  expiresAt.setDate(expiresAt.getDate() + trial.freeTrialDays);

  const now = new Date();
  const msRemaining = expiresAt.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const isOnTrial = msRemaining > 0;

  return {
    isOnTrial,
    trialDaysTotal: trial.freeTrialDays,
    trialExpiresAt: expiresAt,
    daysRemaining,
  };
}

export async function getCreditBalance(recruiterId: string): Promise<number> {
  let record = await prisma.recruiterCredits.findUnique({ where: { recruiterId } });
  if (!record) {
    record = await prisma.recruiterCredits.create({ data: { recruiterId, balance: 0 } });
  }
  return record.balance;
}

export async function checkScreeningAllowed(recruiterId: string): Promise<{
  allowed: boolean;
  reason: string;
  isOnTrial: boolean;
  balance: number;
  daysRemaining: number;
}> {
  const trial = await getTrialStatus(recruiterId);
  const balance = await getCreditBalance(recruiterId);

  if (trial.isOnTrial) {
    return { allowed: true, reason: 'trial', isOnTrial: true, balance, daysRemaining: trial.daysRemaining };
  }

  if (balance < 5) {
    return { allowed: false, reason: 'insufficient_credits', isOnTrial: false, balance, daysRemaining: 0 };
  }

  return { allowed: true, reason: 'credits', isOnTrial: false, balance, daysRemaining: 0 };
}

export async function deductCredits(
  recruiterId: string,
  amount: 5 | 15,
  reason: 'screening_mandatory' | 'screening_full',
  sessionId: string
): Promise<void> {
  const trial = await getTrialStatus(recruiterId);
  if (trial.isOnTrial) return;

  await prisma.$transaction(async (tx) => {
    const record = await tx.recruiterCredits.update({
      where: { recruiterId },
      data: { balance: { decrement: amount } },
    });
    await tx.creditTransaction.create({
      data: {
        recruiterId,
        type: 'deduct',
        amount: -amount,
        reason,
        sessionId,
        balanceAfter: record.balance,
      },
    });
  });
}

export async function getStatus(req: Request, res: Response) {
  try {
    const recruiterId = getAuthUserId(req);
    if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

    const trial = await getTrialStatus(recruiterId);
    const balance = await getCreditBalance(recruiterId);

    res.json({ ...trial, balance });
  } catch (err) {
    console.error('credits.getStatus error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const recruiterId = getAuthUserId(req);
    if (!recruiterId) return res.status(401).json({ error: 'Unauthorized' });

    const transactions = await prisma.creditTransaction.findMany({
      where: { recruiterId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function adminListRecruiters(req: Request, res: Response) {
  try {
    const isAdmin = await requireAdmin(req);
    if (isAdmin === false) return res.status(403).json({ error: 'Forbidden' });
    const recruiters = await prisma.user.findMany({
      where: { role: 'recruiter' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = await Promise.all(
      recruiters.map(async (r) => {
        const trialStatus = await getTrialStatus(r.id);
        const balance = await getCreditBalance(r.id);
        return {
          id: r.id,
          email: r.email,
          name: `${r.firstName} ${r.lastName}`,
          companyName: r.companyName,
          registeredAt: r.createdAt,
          freeTrialDays: trialStatus.trialDaysTotal,
          trialExpiresAt: trialStatus.trialExpiresAt,
          isOnTrial: trialStatus.isOnTrial,
          daysRemaining: trialStatus.daysRemaining,
          creditBalance: balance,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('adminListRecruiters error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function adminUpdateTrialDays(req: Request, res: Response) {
  try {
    const isAdmin = await requireAdmin(req);
    if (isAdmin === false) return res.status(403).json({ error: 'Forbidden' });
    const { recruiterId } = req.params;
    const { freeTrialDays } = req.body;

    if (typeof freeTrialDays !== 'number' || freeTrialDays < 0 || freeTrialDays > 365) {
      return res.status(400).json({ error: 'freeTrialDays must be 0-365' });
    }

    const user = await prisma.user.findUnique({ where: { id: recruiterId } });

    await prisma.recruiterTrial.upsert({
      where: { recruiterId },
      update: { freeTrialDays },
      create: {
        recruiterId,
        freeTrialDays,
        registeredAt: user?.createdAt ?? new Date(),
      },
    });

    const updated = await getTrialStatus(recruiterId);
    res.json({ success: true, ...updated });
  } catch (err) {
    console.error('adminUpdateTrialDays error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function adminAdjustCredits(req: Request, res: Response) {
  try {
    const isAdmin = await requireAdmin(req);
    if (isAdmin === false) return res.status(403).json({ error: 'Forbidden' });
    const { recruiterId } = req.params;
    const { amount, reason } = req.body;

    if (typeof amount !== 'number' || amount === 0) {
      return res.status(400).json({ error: 'amount must be non-zero integer' });
    }

    await prisma.$transaction(async (tx) => {
      const record = await tx.recruiterCredits.upsert({
        where: { recruiterId },
        update: { balance: { increment: amount } },
        create: { recruiterId, balance: Math.max(0, amount) },
      });
      await tx.creditTransaction.create({
        data: {
          recruiterId,
          type: 'admin_adjust',
          amount,
          reason: reason || 'admin_manual',
          balanceAfter: record.balance,
        },
      });
    });

    const balance = await getCreditBalance(recruiterId);
    res.json({ success: true, balance });
  } catch (err) {
    console.error('adminAdjustCredits error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getPricingPlans(req: Request, res: Response) {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function adminGetPricingPlans(req: Request, res: Response) {
  try {
    const isAdmin = await requireAdmin(req);
    if (isAdmin === false) return res.status(403).json({ error: 'Forbidden' });
    const plans = await prisma.pricingPlan.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function adminUpdatePricingPlan(req: Request, res: Response) {
  try {
    const isAdmin = await requireAdmin(req);
    if (isAdmin === false) return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { name, price, credits, description, features, buttonText, isPopular, isActive, sortOrder, isCustomPricing, ctaAction } = req.body;

    const updated = await prisma.pricingPlan.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: Number(price) }),
        ...(credits !== undefined && { credits: Number(credits) }),
        ...(description !== undefined && { description }),
        ...(features !== undefined && { features: typeof features === 'string' ? features : JSON.stringify(features) }),
        ...(buttonText !== undefined && { buttonText }),
        ...(isPopular !== undefined && { isPopular }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(isCustomPricing !== undefined && { isCustomPricing }),
        ...(ctaAction !== undefined && { ctaAction }),
        updatedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('adminUpdatePricingPlan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
