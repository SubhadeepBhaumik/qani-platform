import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const org = await prisma.organisation.create({
    data: { name: 'Recruitment School', industry: 'Recruitment', subscriptionPlan: 'premium', status: 'active' },
  });

  const recruiter = await prisma.user.create({
    data: {
      organisationId: org.id,
      email: 'steve@recruitmentschool.com.au',
      passwordHash: await bcrypt.hash('SecurePass123!', 10),
      firstName: 'Steve',
      lastName: 'Begg',
      role: 'RECRUITER',
      emailVerified: true,
    },
  });

  const candidates = [];
  for (let i = 1; i <= 20; i++) {
    candidates.push(await prisma.candidate.create({
      data: {
        organisationId: org.id,
        email: `candidate${i}@example.com`,
        firstName: 'John',
        lastName: `Candidate${i}`,
        suburb: ['Sydney', 'Melbourne', 'Brisbane'][i % 3],
      },
    }));
  }

  const roles = [];
  const roleNames = ['Senior Developer', 'Full Stack Engineer', 'DevOps Engineer', 'Data Scientist', 'QA Engineer'];
  for (const name of roleNames) {
    roles.push(await prisma.role.create({
      data: { organisationId: org.id, title: name, status: 'active' },
    }));
  }

  for (let r = 0; r < roles.length; r++) {
    for (let c = 0; c < 4; c++) {
      await prisma.application.create({
        data: {
          organisationId: org.id,
          roleId: roles[r].id,
          candidateId: candidates[(r * 4 + c) % candidates.length].id,
          status: ['applied', 'screening', 'completed'][c % 3],
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
