import { Request, Response } from 'express';

const roles: any[] = [
  {
    id: 'job-1', organisationId: 'default', title: 'Senior Full Stack Developer',
    department: 'Engineering', category: 'Software Engineering',
    location: 'Sydney, NSW (Hybrid)', employmentType: ['Full-time', 'Hybrid'],
    salaryMin: 130000, salaryMax: 160000, hideSalary: false,
    description: 'We are looking for a Senior Full-Stack Developer to lead engineering of our candidate-facing portal.',
    benefits: ['Health insurance', 'Learning budget $3000/year', 'Flexible hours'],
    requirementsMust: ['6+ years professional experience', 'Strong React and TypeScript', 'Node.js RESTful APIs'],
    requirementsNice: ['Open source contributions', 'Mentoring experience'],
    experienceLevel: 'Senior', experienceYearsMin: 6, experienceYearsMax: 15,
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    educationRequired: ["Bachelor's in Computer Science"],
    screeningQuestions: [
      'Describe your experience with high-performance React frontends.',
      'How do you approach API security in Node.js?',
      'Tell us about a challenging production incident you resolved.',
      'What are your salary expectations and notice period?'
    ],
    qualificationWeights: { locationWeight: 80, salaryWeight: 90, qualificationsWeight: 85, workRightsWeight: 95, skillsWeight: 100 },
    status: 'open', postedDate: '2026-05-15',
  },
  {
    id: 'job-2', organisationId: 'default', title: 'Product Manager — Platform',
    department: 'Product', category: 'Product Management',
    location: 'Melbourne, VIC (Hybrid)', employmentType: ['Full-time'],
    salaryMin: 120000, salaryMax: 150000, hideSalary: false,
    description: 'Lead product strategy and roadmap for our core platform.',
    benefits: ['Stock options', 'Flexible working', 'Health insurance'],
    requirementsMust: ['4+ years PM experience', 'B2B SaaS background', 'Data-driven decision making'],
    requirementsNice: ['Technical background', 'Startup experience'],
    experienceLevel: 'Senior', experienceYearsMin: 4, experienceYearsMax: 10,
    skillsRequired: ['Product Strategy', 'Agile', 'Analytics', 'Roadmapping'],
    educationRequired: ["Bachelor's in Business or Engineering"],
    screeningQuestions: [
      'How do you prioritise features with competing stakeholder requests?',
      'Describe a data-driven product decision you made.',
      'How do you work with engineering teams effectively?',
      'What are your salary expectations?'
    ],
    qualificationWeights: { locationWeight: 70, salaryWeight: 85, qualificationsWeight: 80, workRightsWeight: 90, skillsWeight: 85 },
    status: 'open', postedDate: '2026-05-18',
  },
  {
    id: 'job-3', organisationId: 'default', title: 'DevOps / Platform Engineer',
    department: 'Infrastructure', category: 'DevOps & Cloud',
    location: 'Remote (Australia)', employmentType: ['Full-time', 'Remote'],
    salaryMin: 120000, salaryMax: 145000, hideSalary: false,
    description: 'Own and scale our cloud infrastructure on AWS.',
    benefits: ['Fully remote', 'WFH setup allowance $2500', 'Health cover'],
    requirementsMust: ['Terraform', 'AWS', 'Kubernetes', '4+ years experience'],
    requirementsNice: ['Go or Python', 'Prometheus/Grafana'],
    experienceLevel: 'Mid', experienceYearsMin: 4, experienceYearsMax: 10,
    skillsRequired: ['Terraform', 'AWS', 'Kubernetes', 'Docker', 'CI/CD'],
    educationRequired: ["Bachelor's in Computer Science"],
    screeningQuestions: [
      'Describe your Kubernetes production experience.',
      'What are your Terraform best practices?',
      'Describe a major outage you handled.',
      'Do you have full Australian work rights? Salary expectation?'
    ],
    qualificationWeights: { locationWeight: 85, salaryWeight: 80, qualificationsWeight: 80, workRightsWeight: 100, skillsWeight: 90 },
    status: 'open', postedDate: '2026-05-20',
  },
  {
    id: 'job-4', organisationId: 'default', title: 'UX/UI Product Designer',
    department: 'Design', category: 'Product Design',
    location: 'Sydney, NSW (Flexible)', employmentType: ['Full-time', 'Hybrid'],
    salaryMin: 95000, salaryMax: 125000, hideSalary: false,
    description: 'Shape the visual language and user experience of our products.',
    benefits: ['Figma enterprise licence', 'Design conference budget'],
    requirementsMust: ['3+ years product design', 'Strong Figma skills', 'User research methodology'],
    requirementsNice: ['Frontend HTML/CSS', 'Motion design'],
    experienceLevel: 'Mid', experienceYearsMin: 3, experienceYearsMax: 8,
    skillsRequired: ['Figma', 'UX Research', 'Design Systems', 'Prototyping'],
    educationRequired: ["Degree in Design or HCI"],
    screeningQuestions: [
      'Walk us through your design process for a complex feature.',
      'How do you maintain a scalable design system?',
      'Describe a time engineering constraints changed your design.',
      'What is your salary expectation and notice period?'
    ],
    qualificationWeights: { locationWeight: 60, salaryWeight: 80, qualificationsWeight: 75, workRightsWeight: 85, skillsWeight: 90 },
    status: 'open', postedDate: '2026-05-22',
  },
  {
    id: 'job-5', organisationId: 'default', title: 'Data Scientist — AI/ML',
    department: 'AI Lab', category: 'Data Science',
    location: 'Melbourne, VIC (Office)', employmentType: ['Full-time'],
    salaryMin: 130000, salaryMax: 165000, hideSalary: false,
    description: 'Build and deploy ML models powering our candidate screening algorithms.',
    benefits: ['GPU compute budget', 'Conference sponsorships', 'Stock options'],
    requirementsMust: ['Python', 'PyTorch or TensorFlow', 'ML pipeline deployment', '4+ years experience'],
    requirementsNice: ['NLP/LLM experience', 'Published research'],
    experienceLevel: 'Senior', experienceYearsMin: 4, experienceYearsMax: 12,
    skillsRequired: ['Python', 'PyTorch', 'ML Pipelines', 'SQL', 'NLP'],
    educationRequired: ["Master's or PhD in CS or Mathematics"],
    screeningQuestions: [
      'How do you validate ML models for production?',
      'Describe your NLP or LLM experience.',
      'How do you handle model drift?',
      'Are you based in Melbourne? Salary expectation?'
    ],
    qualificationWeights: { locationWeight: 90, salaryWeight: 85, qualificationsWeight: 95, workRightsWeight: 90, skillsWeight: 100 },
    status: 'open', postedDate: '2026-05-24',
  },
];

export class RolesController {
  static async createRole(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body.title) {
        return res.status(400).json({ error: 'title required' });
      }
      const role = {
        id: `job-${Date.now()}`,
        organisationId: body.organisationId || 'default',
        ...body,
        createdAt: new Date().toISOString(),
      };
      roles.push(role);
      return res.status(201).json(role);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create role' });
    }
  }

  static async getRoles(req: Request, res: Response) {
    try {
      return res.json(roles);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idx = roles.findIndex(r => r.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Role not found' });
      roles[idx] = { ...roles[idx], ...req.body };
      return res.json(roles[idx]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update role' });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idx = roles.findIndex(r => r.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Role not found' });
      roles.splice(idx, 1);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete role' });
    }
  }
}
