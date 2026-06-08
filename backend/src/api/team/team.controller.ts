import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TeamController {
  static async createInvite(req: Request, res: Response) {
    try {
      const { email, role, invitedBy, companyId } = req.body;
      if (!email || !invitedBy) return res.status(400).json({ error: 'email and invitedBy required' });
      const member = await prisma.teamMember.create({
        data: { email, role: role || 'recruiter', invitedBy, companyId: companyId || invitedBy, status: 'pending' }
      });
      return res.status(201).json(member);
    } catch (error) {
      console.error('Create invite error:', error);
      return res.status(500).json({ error: 'Failed to create invite' });
    }
  }

  static async getTeamMembers(req: Request, res: Response) {
    try {
      const { invitedBy, companyId, inviteeEmail } = req.query;
      const where: any = {};
      if (invitedBy) where.invitedBy = invitedBy as string;
      else if (companyId) where.companyId = companyId as string;
      else if (inviteeEmail) where.email = inviteeEmail as string;
      const members = await prisma.teamMember.findMany({ where, orderBy: { createdAt: 'desc' } });
      // If fetching by invitee, also get inviter user details
      if (inviteeEmail && members.length > 0) {
        const inviterId = members[0].invitedBy;
        if (inviterId) {
          const inviter = await prisma.user.findUnique({ where: { id: inviterId } });
          return res.json(members.map(m => ({ ...m, inviterName: inviter ? inviter.firstName + ' ' + inviter.lastName : null, inviterEmail: inviter?.email })));
        }
      }
      return res.json(members);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch team members' });
    }
  }

  static async acceptInvite(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'email required' });
      await prisma.teamMember.updateMany({ where: { email, status: 'pending' }, data: { status: 'active' } });
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to accept invite' });
    }
  }

  static async removeTeamMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.teamMember.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: 'Member not found' });
    }
  }
}
