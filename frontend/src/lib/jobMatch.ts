export interface MatchProfile {
  skills: string[];
  location: string;
  salaryExpectation: string | number;
}

const normTerm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

export function computeJobMatchScore(job: any, profile: MatchProfile): number {
  const skills = profile.skills || [];
  const location = profile.location || '';
  let scoreSum = 0;
  let totalWeight = 0;
  if ((job.skillsRequired || []).length > 0 && skills.length > 0) {
    const jobSkills = job.skillsRequired.map(normTerm);
    const mySkills = skills.map(normTerm);
    const matched = jobSkills.filter((sk: string) => mySkills.some((ms: string) => ms.includes(sk) || sk.includes(ms))).length;
    scoreSum += (matched / jobSkills.length) * 100 * 0.5;
    totalWeight += 0.5;
  }
  if (job.location && location) {
    const isRemote = /remote/i.test(job.location);
    const jobWords = new Set(job.location.toLowerCase().split(/[^a-z]+/).filter((w: string) => w.length > 2));
    const myWords = new Set(location.toLowerCase().split(/[^a-z]+/).filter((w: string) => w.length > 2));
    const locMatch = isRemote || [...jobWords].some((w) => myWords.has(w as string));
    scoreSum += (locMatch ? 100 : 40) * 0.25;
    totalWeight += 0.25;
  }
  const expectedSalaryNum = parseInt(String(profile.salaryExpectation || ''), 10);
  if (job.salaryMin && job.salaryMax && expectedSalaryNum) {
    let fitScore = 100;
    if (expectedSalaryNum > job.salaryMax) fitScore = Math.max(0, 100 - ((expectedSalaryNum - job.salaryMax) / job.salaryMax) * 100);
    scoreSum += fitScore * 0.25;
    totalWeight += 0.25;
  }
  if (totalWeight === 0) return 50;
  return Math.round(scoreSum / totalWeight);
}
