import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Keep exported roles array for backward compatibility with screening + applications controllers
// This will be removed once all controllers are migrated
export let roles: any[] = [];

// Load roles from DB into memory for other controllers that still reference the array
export async function syncRolesToMemory() {
  const jobs = await prisma.job.findMany();
  roles.length = 0;
  jobs.forEach(j => roles.push({
    id: j.id,
    title: j.title,
    department: j.department,
    category: j.category,
    location: j.location,
    employmentType: j.employmentType,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    description: j.description,
    requirementsMust: j.requirementsMust,
    requirementsNice: j.requirementsNice,
    skillsRequired: j.skillsRequired,
    experienceLevel: j.experienceLevel,
    screeningQuestions: j.screeningQuestions,
    mandatoryQuestions: j.mandatoryQuestions,
    qualificationWeights: j.qualificationWeights,
    status: j.status,
    recruiterId: j.recruiterId,
    company: j.company,
    postedDate: j.postedDate,
    expiresAt: j.expiresAt,
  }));
}

export class RolesController {
  static async createRole(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body.title) return res.status(400).json({ error: 'title required' });

      const job = await prisma.job.create({
        data: {
          title: body.title,
          department: body.department || null,
          category: body.category || null,
          location: body.location || '',
          employmentType: body.employmentType || [],
          salaryMin: body.salaryMin ? Number(body.salaryMin) : null,
          salaryMax: body.salaryMax ? Number(body.salaryMax) : null,
          description: body.description || null,
          requirementsMust: body.requirementsMust || [],
          requirementsNice: body.requirementsNice || [],
          skillsRequired: body.skillsRequired || [],
          experienceLevel: body.experienceLevel || null,
          screeningQuestions: body.screeningQuestions || [],
          mandatoryQuestions: {
            locationCommute: true,
            workRights: true,
            salaryExpectation: true,
            yearsExperience: true,
            driversLicence: true,
            postcode: true,
            ...(body.mandatoryQuestions || {}),
            ...(body.mandatoryQuestions ? {
              locationCommute: body.mandatoryQuestions.locationCommute !== false,
              workRights: body.mandatoryQuestions.workRights !== false,
              salaryExpectation: body.mandatoryQuestions.salaryExpectation !== false,
              yearsExperience: body.mandatoryQuestions.yearsExperience !== false,
              driversLicence: body.mandatoryQuestions.driversLicence !== false,
              postcode: body.mandatoryQuestions.postcode !== false,
            } : {}),
          },
          qualificationWeights: body.qualificationWeights || (() => {
            const qCount = (body.screeningQuestions || []).length;
            const bonus = Math.min(qCount * 5, 25);
            const skills = 20 + Math.round(bonus * 0.55);
            const qualifications = 20 + Math.round(bonus * 0.45);
            const workRights = 20;
            const location = 20 - Math.round(bonus * 0.5);
            const salary = 20 - Math.round(bonus * 0.5);
            const total = skills + qualifications + workRights + location + salary;
            const diff = 100 - total;
            return {
              skillsWeight: skills + diff,
              qualificationsWeight: qualifications,
              workRightsWeight: workRights,
              locationWeight: location,
              salaryWeight: salary,
            };
          })(),
          status: body.status || 'open',
          recruiterId: body.recruiterId || null,
          company: body.company || null,
          postedDate: body.postedDate ? new Date(body.postedDate) : new Date(),
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        }
      });
      await syncRolesToMemory();
      return res.status(201).json(job);
    } catch (error) {
      console.error('Create role error:', error);
      return res.status(500).json({ error: 'Failed to create role' });
    }
  }

  static async getRoles(req: Request, res: Response) {
    try {
      const { recruiterId } = req.query;
      const where: any = {};
      if (recruiterId) {
        // Check if this user is a team member — if so, use their inviter's ID
        const teamMembership = await prisma.teamMember.findFirst({
          where: { 
            invitedBy: { not: null },
            status: 'active',
          },
          select: { invitedBy: true, email: true }
        });
        // Find user by recruiterId to get their email
        const user = await prisma.user.findUnique({ where: { id: recruiterId as string }, select: { email: true } });
        if (user) {
          const membership = await prisma.teamMember.findFirst({
            where: { email: user.email, status: 'active' },
            select: { invitedBy: true }
          });
          if (membership?.invitedBy) {
            // Use inviter's ID to fetch jobs
            where.recruiterId = membership.invitedBy;
          } else {
            where.recruiterId = recruiterId as string;
          }
        } else {
          where.recruiterId = recruiterId as string;
        }
      }
      const jobs = await prisma.job.findMany({ where, orderBy: { createdAt: 'desc' } });
      return res.json(jobs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
  }

  static async getRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await prisma.job.findUnique({ where: { id } });
      if (!job) return res.status(404).json({ error: 'Role not found' });
      return res.json(job);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch role' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;
      const job = await prisma.job.update({
        where: { id },
        data: {
          ...(body.title && { title: body.title }),
          ...(body.department !== undefined && { department: body.department }),
          ...(body.category !== undefined && { category: body.category }),
          ...(body.location !== undefined && { location: body.location }),
          ...(body.employmentType !== undefined && { employmentType: body.employmentType }),
          ...(body.salaryMin !== undefined && { salaryMin: Number(body.salaryMin) }),
          ...(body.salaryMax !== undefined && { salaryMax: Number(body.salaryMax) }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.requirementsMust !== undefined && { requirementsMust: body.requirementsMust }),
          ...(body.requirementsNice !== undefined && { requirementsNice: body.requirementsNice }),
          ...(body.skillsRequired !== undefined && { skillsRequired: body.skillsRequired }),
          ...(body.experienceLevel !== undefined && { experienceLevel: body.experienceLevel }),
          ...(body.screeningQuestions !== undefined && { screeningQuestions: body.screeningQuestions }),
          ...(body.mandatoryQuestions !== undefined && { mandatoryQuestions: body.mandatoryQuestions }),
          ...(body.qualificationWeights !== undefined && { qualificationWeights: body.qualificationWeights }),
          ...(body.status !== undefined && { status: body.status }),
          ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }),
        }
      });
      await syncRolesToMemory();
      return res.json(job);
    } catch (error) {
      console.error('Update role error:', error);
      return res.status(404).json({ error: 'Role not found' });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.job.delete({ where: { id } });
      await syncRolesToMemory();
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: 'Role not found' });
    }
  }
}
