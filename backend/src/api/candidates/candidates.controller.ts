import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CandidatesController {
  static async registerCandidate(req: Request, res: Response) {
    try {
      const { email, firstName, lastName, phone, location } = req.body;
      if (!email || !firstName || !lastName) {
        return res.status(400).json({ error: 'email, firstName, lastName required' });
      }
      const existing = await prisma.candidateProfile.findFirst({
        where: { userId: (await prisma.user.findUnique({ where: { email } }))?.id || '' }
      });
      if (existing) return res.status(409).json({ error: 'Candidate already exists' });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const profile = await prisma.candidateProfile.create({
        data: { userId: user.id, phone, location }
      });
      return res.status(201).json(profile);
    } catch (error) {
      console.error('Register candidate error:', error);
      return res.status(500).json({ error: 'Failed to register candidate' });
    }
  }

  static async getCandidates(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({ where: { role: 'candidate' } });
      const profiles = await prisma.candidateProfile.findMany();
      const merged = users.map((u: any) => {
        const profile = profiles.find((p: any) => p.userId === u.id);
        const skills = profile && Array.isArray((profile as any).skills) ? (profile as any).skills : [];
        return { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, avatarUrl: u.avatarUrl || null, bio: (profile as any)?.bio || '', skills, location: (profile as any)?.location || '', workRights: (profile as any)?.workRights || '', linkedinUrl: (profile as any)?.linkedinUrl || '', cvFilename: (profile as any)?.cvFilename || '' };
      });
      return res.json(merged);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }

  static async getCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },

      });
      if (!user) return res.status(404).json({ error: 'Candidate not found' });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch candidate' });
    }
  }

  static async updateCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const {
        bio, skills, linkedinUrl, githubUrl, workRights,
        salaryExpectation, availableFrom, phone, location,
        cvUrl, cvFilename, profilePhotoUrl,
        firstName, lastName
      } = req.body;
      if (decoded.userId !== id) { const caller = await prisma.user.findUnique({ where: { id: decoded.userId } }); if (caller === null || caller.role !== 'admin') { return res.status(403).json({ error: 'Forbidden' }); } }

      // Update user name if provided
      if (firstName || lastName) {
        await prisma.user.update({
          where: { id },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
          }
        });
      }

      // Upsert candidate profile
      const profile = await prisma.candidateProfile.upsert({
        where: { userId: id },
        create: {
          userId: id,
          bio, skills: skills || [], linkedinUrl, githubUrl,
          workRights, salaryExpectation: salaryExpectation ? Number(salaryExpectation) : null,
          availableFrom: availableFrom ? new Date(availableFrom) : null,
          phone, location, cvUrl, cvFilename, profilePhotoUrl,
        },
        update: {
          ...(bio !== undefined && { bio }),
          ...(skills !== undefined && { skills }),
          ...(linkedinUrl !== undefined && { linkedinUrl }),
          ...(githubUrl !== undefined && { githubUrl }),
          ...(workRights !== undefined && { workRights }),
          ...(salaryExpectation !== undefined && { salaryExpectation: Number(salaryExpectation) }),
          ...(availableFrom !== undefined && { availableFrom: availableFrom ? new Date(availableFrom) : null }),
          ...(phone !== undefined && { phone }),
          ...(location !== undefined && { location }),
          ...(cvUrl !== undefined && { cvUrl }),
          ...(cvFilename !== undefined && { cvFilename }),
          ...(profilePhotoUrl !== undefined && { profilePhotoUrl }),
        }
      });
      return res.json(profile);
    } catch (error) {
      console.error('Update candidate error:', error);
      return res.status(500).json({ error: 'Failed to update candidate' });
    }
  }

  static async uploadCV(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const { cvData, cvFilename } = req.body;
      if (decoded.userId !== id) { const caller = await prisma.user.findUnique({ where: { id: decoded.userId } }); if (caller === null || caller.role !== 'admin') { return res.status(403).json({ error: 'Forbidden' }); } }
      if (!cvData || !cvFilename) return res.status(400).json({ error: 'cvData and cvFilename required' });
      if (cvData.length > 7 * 1024 * 1024) return res.status(400).json({ error: 'File too large. Max 5MB.' });

      const profile = await prisma.candidateProfile.upsert({
        where: { userId: id },
        create: { userId: id, cvUrl: cvData, cvFilename },
        update: { cvUrl: cvData, cvFilename },
      });
      return res.json({ success: true, cvFilename: profile.cvFilename });
    } catch (error) {
      console.error('CV upload error:', error);
      return res.status(500).json({ error: 'Failed to upload CV' });
    }
  }

  static async uploadPhoto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      const { photoData } = req.body;
      if (decoded.userId !== id) { const caller = await prisma.user.findUnique({ where: { id: decoded.userId } }); if (caller === null || caller.role !== 'admin') { return res.status(403).json({ error: 'Forbidden' }); } }
      if (!photoData) return res.status(400).json({ error: 'photoData required' });
      if (photoData.length > 3 * 1024 * 1024) return res.status(400).json({ error: 'Photo too large. Max 2MB.' });

      const profile = await prisma.candidateProfile.upsert({
        where: { userId: id },
        create: { userId: id, profilePhotoUrl: photoData },
        update: { profilePhotoUrl: photoData },
      });

      // Also update user avatar
      await prisma.user.update({
        where: { id },
        data: { avatarUrl: photoData }
      });

      return res.json({ success: true, profilePhotoUrl: profile.profilePhotoUrl });
    } catch (error) {
      console.error('Photo upload error:', error);
      return res.status(500).json({ error: 'Failed to upload photo' });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const profile = await prisma.candidateProfile.findUnique({ where: { userId: id } });
      return res.json(profile || {});
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}
