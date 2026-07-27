import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const parseSalaryValue = (v: any): number | null => {
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};
const isHiddenForCompany = (profile: any, callerCompanyName?: string | null): boolean => {
  if (!profile) return false;
  if (profile.profileVisible === false) return true;
  if (!callerCompanyName) return false;
  const blocked: string[] = Array.isArray(profile.hiddenFromCompanies) ? profile.hiddenFromCompanies : [];
  return blocked.some((c: string) => c.trim().toLowerCase() === callerCompanyName.trim().toLowerCase());
};

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

  static async getCompanies(_req: Request, res: Response) {
    try {
      const recruiters = await prisma.user.findMany({
        where: { role: 'recruiter', companyName: { not: null } },
        select: { companyName: true },
        distinct: ['companyName'],
      });
      const names = recruiters
        .map((r: any) => (r.companyName || '').trim())
        .filter((n: string) => n.length > 0)
        .sort((a: string, b: string) => a.localeCompare(b));
      return res.json(names);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch companies' });
    }
  }

  static async getCandidates(req: Request, res: Response) {
    try {
      const authUserId = (req as any).authUserId;
      const caller = authUserId ? await prisma.user.findUnique({ where: { id: authUserId } }) : null;
      const users = await prisma.user.findMany({ where: { role: 'candidate' } });
      const profiles = await prisma.candidateProfile.findMany();
      const visibleUsers = users.filter((u: any) => {
        const p = profiles.find((pr: any) => pr.userId === u.id);
        return !isHiddenForCompany(p, caller?.companyName);
      });
      const merged = visibleUsers.map((u: any) => {
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
      const authUserId = (req as any).authUserId;
      if (authUserId !== id) { const caller = await prisma.user.findUnique({ where: { id: authUserId } }); if (caller === null || caller.role !== 'admin') { return res.status(403).json({ error: 'Forbidden' }); } }
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
        profileVisible, notifyScreening, notifyJobs, hiddenFromCompanies,
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
          workRights, salaryExpectation: parseSalaryValue(salaryExpectation),
          availableFrom: availableFrom ? new Date(availableFrom) : null,
          phone, location, cvUrl, cvFilename, profilePhotoUrl,
          ...(profileVisible !== undefined && { profileVisible }),
          ...(notifyScreening !== undefined && { notifyScreening }),
          ...(notifyJobs !== undefined && { notifyJobs }),
          ...(hiddenFromCompanies !== undefined && { hiddenFromCompanies }),
        },
        update: {
          ...(bio !== undefined && { bio }),
          ...(skills !== undefined && { skills }),
          ...(linkedinUrl !== undefined && { linkedinUrl }),
          ...(githubUrl !== undefined && { githubUrl }),
          ...(workRights !== undefined && { workRights }),
          ...(salaryExpectation !== undefined && { salaryExpectation: parseSalaryValue(salaryExpectation) }),
          ...(availableFrom !== undefined && { availableFrom: availableFrom ? new Date(availableFrom) : null }),
          ...(phone !== undefined && { phone }),
          ...(location !== undefined && { location }),
          ...(cvUrl !== undefined && { cvUrl }),
          ...(cvFilename !== undefined && { cvFilename }),
          ...(profilePhotoUrl !== undefined && { profilePhotoUrl }),
          ...(profileVisible !== undefined && { profileVisible }),
          ...(notifyScreening !== undefined && { notifyScreening }),
          ...(notifyJobs !== undefined && { notifyJobs }),
          ...(hiddenFromCompanies !== undefined && { hiddenFromCompanies }),
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

  static async parseCV(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      if (decoded.userId !== id) { return res.status(403).json({ error: 'Forbidden' }); }
      const profile = await prisma.candidateProfile.findUnique({ where: { userId: id } });
      if (!profile || !profile.cvUrl || !profile.cvFilename) {
        return res.status(400).json({ error: 'No CV uploaded yet' });
      }
      const match = profile.cvUrl.match(/^data:(.+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: 'Invalid CV data' });
      const mimeType = match[1];
      const base64 = match[2];
      const buffer = Buffer.from(base64, 'base64');
      const filename = profile.cvFilename.toLowerCase();
      let text = '';
      if (filename.endsWith('.pdf') || mimeType.includes('pdf')) {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        text = data.text;
      } else if (filename.endsWith('.docx') || filename.endsWith('.doc') || mimeType.includes('word')) {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else {
        return res.status(400).json({ error: 'Unsupported file type for parsing' });
      }
      if (!text || text.trim().length < 20) {
        return res.status(422).json({ error: 'Could not extract readable text from CV' });
      }
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You extract structured candidate profile data from resume/CV text. Respond ONLY with valid JSON, no markdown, no commentary.' },
          { role: 'user', content: `Extract the following fields from this CV text as JSON with exactly these keys: bio (a 2-3 sentence professional summary written in third person based on the CV), skills (array of up to 12 technical/professional skill strings), phone (string or null), location (city/region string or null), workRights (string or null, e.g. "Citizen", "PR", "Visa" if mentioned), linkedinUrl (string or null, only if a linkedin.com URL appears in the text).\n\nCV TEXT:\n${text.slice(0, 8000)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });
      const raw = completion.choices[0]?.message?.content || '{}';
      let parsed: any;
      try { parsed = JSON.parse(raw); } catch { parsed = {}; }
      return res.json({
        bio: typeof parsed.bio === 'string' ? parsed.bio : null,
        skills: Array.isArray(parsed.skills) ? parsed.skills.filter((sk: any) => typeof sk === 'string').slice(0, 12) : [],
        phone: typeof parsed.phone === 'string' ? parsed.phone : null,
        location: typeof parsed.location === 'string' ? parsed.location : null,
        workRights: typeof parsed.workRights === 'string' ? parsed.workRights : null,
        linkedinUrl: typeof parsed.linkedinUrl === 'string' ? parsed.linkedinUrl : null,
      });
    } catch (error) {
      console.error('CV parse error:', error);
      return res.status(500).json({ error: 'Failed to parse CV' });
    }
  }
  static async parseLinkedIn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      const hasValidHeader = authHeader !== undefined && authHeader.startsWith('Bearer ');
      if (hasValidHeader === false) { return res.status(401).json({ error: 'Unauthorized' }); }
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token) as any;
      if (decoded === null) { return res.status(401).json({ error: 'Unauthorized' }); }
      if (decoded.userId !== id) { return res.status(403).json({ error: 'Forbidden' }); }
      const { linkedinUrl } = req.body;
      if (!linkedinUrl || !/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(linkedinUrl)) {
        return res.status(400).json({ error: 'Please provide a valid linkedin.com profile URL' });
      }
      let html = '';
      try {
        const pageRes = await fetch(linkedinUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
        html = await pageRes.text();
      } catch {
        return res.status(502).json({ error: 'Could not reach that LinkedIn URL' });
      }
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&amp;|&#\d+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const loginWallHit = /sign in to linkedin|join linkedin|authwall/i.test(html) && text.length < 1500;
      if (!text || text.length < 200 || loginWallHit) {
        return res.status(422).json({ error: 'LinkedIn blocked this request (public pages usually require sign-in to view). Try uploading your CV instead.' });
      }
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You extract structured candidate profile data from a LinkedIn public page\'s raw text. The text may contain navigation clutter unrelated to the profile - ignore it. Respond ONLY with valid JSON, no markdown, no commentary.' },
          { role: 'user', content: `Extract the following fields as JSON with exactly these keys: bio (a 2-3 sentence professional summary written in third person), skills (array of up to 12 technical/professional skill strings), location (city/region string or null). If the text does not look like a real LinkedIn profile (e.g. it's a login page), return {"bio": null, "skills": [], "location": null}.\n\nPAGE TEXT:\n${text.slice(0, 8000)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });
      const raw = completion.choices[0]?.message?.content || '{}';
      let parsed: any;
      try { parsed = JSON.parse(raw); } catch { parsed = {}; }
      if (!parsed.bio && (!parsed.skills || parsed.skills.length === 0)) {
        return res.status(422).json({ error: 'Could not extract profile data from that page. Try uploading your CV instead.' });
      }
      return res.json({
        bio: typeof parsed.bio === 'string' ? parsed.bio : null,
        skills: Array.isArray(parsed.skills) ? parsed.skills.filter((sk: any) => typeof sk === 'string').slice(0, 12) : [],
        location: typeof parsed.location === 'string' ? parsed.location : null,
      });
    } catch (error) {
      console.error('LinkedIn parse error:', error);
      return res.status(500).json({ error: 'Failed to parse LinkedIn profile' });
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
      const authUserId = (req as any).authUserId;
      if (authUserId !== id) { const caller = await prisma.user.findUnique({ where: { id: authUserId } }); if (caller === null) { return res.status(401).json({ error: 'Unauthorized' }); } if (caller.role !== 'admin') { if (caller.role !== 'recruiter') { return res.status(403).json({ error: 'Forbidden' }); } const myJobs = await prisma.job.findMany({ where: { recruiterId: caller.id }, select: { id: true } }); const myJobIds = myJobs.map((j: any) => j.id); const linkedApp = await prisma.application.findFirst({ where: { candidateId: id, jobId: { in: myJobIds } } }); if (linkedApp === null) { return res.status(403).json({ error: 'Forbidden' }); } const vProf = await prisma.candidateProfile.findUnique({ where: { userId: id } }); if (isHiddenForCompany(vProf, caller.companyName)) { return res.status(403).json({ error: 'Forbidden' }); } } }
      const profile = await prisma.candidateProfile.findUnique({ where: { userId: id } });
      return res.json(profile || {});
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async getPublicCandidates(_req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({ where: { role: 'candidate' } });
      const profiles = await prisma.candidateProfile.findMany();
      const applications = await prisma.application.findMany({ where: { aiScore: { not: null } }, orderBy: { screeningCompletedAt: 'desc' } });
      const visibleUsers = users.filter((u: any) => {
        const p = profiles.find((pr: any) => pr.userId === u.id);
        return (p as any)?.profileVisible !== false;
      });
      const merged = visibleUsers.map((u: any) => {
        const profile = profiles.find((p: any) => p.userId === u.id);
        const skills = profile && Array.isArray((profile as any).skills) ? (profile as any).skills : [];
        return {
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          profile: {
            location: (profile as any)?.location || '',
            skills,
            latestScore: (() => { const myApps = applications.filter((a) => (a as any).candidateId === u.id); if (myApps.length === 0) return null; const sum = myApps.reduce((acc, a) => acc + ((a as any).aiScore || 0), 0); return Math.round(sum / myApps.length); })(),
          },
        };
      });
      return res.json(merged);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }
}

export async function getPublicCandidateProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const authUserId = (req as any).authUserId;
    const caller = authUserId ? await prisma.user.findUnique({ where: { id: authUserId } }) : null;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'candidate') return res.status(404).json({ error: 'Candidate not found' });
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: id } });
    if (isHiddenForCompany(profile, caller?.role === 'recruiter' ? caller.companyName : null)) return res.status(404).json({ error: 'Candidate not found' });
    const applications = await prisma.application.findMany({ where: { candidateId: id, aiScore: { not: null } }, orderBy: { screeningCompletedAt: 'desc' } });
    const latestScore = applications.length > 0 ? Math.round(applications.reduce((acc, a) => acc + (a.aiScore || 0), 0) / applications.length) : null;
    const mostRecent = applications[0];
    return res.json({
      id: user.id,
      displayName: `${(user.firstName || '').charAt(0)}.${(user.lastName || '').charAt(0)}.`,
      bio: profile?.bio || '',
      skills: profile?.skills || [],
      location: profile?.location || '',
      workRights: profile?.workRights || '',
      availableFrom: profile?.availableFrom || null,
      linkedinUrl: profile?.linkedinUrl || '',
      githubUrl: profile?.githubUrl || '',
      latestScore,
      screeningCount: applications.length,
      latestFeedback: mostRecent?.aiFeedback || null,
      latestFeedbackJobTitle: mostRecent?.jobTitle || null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch candidate profile' });
  }
}
