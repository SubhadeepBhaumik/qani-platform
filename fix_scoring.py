with open('/home/qani/backend/src/api/screening/screening.controller.ts', 'r') as f:
    content = f.read()

old = "      session.score = Math.random() * 100;\n      return res.json(session);"

new = """      const userMsgs = session.messages.filter((m: any) => m.role === 'user');
      const transcript = session.messages
        .map((m: any) => (m.role === 'assistant' ? 'Interviewer' : 'Candidate') + ': ' + m.content)
        .join('\\n');

      let scorecard = { locationScore: 25, salaryScore: 25, qualificationsScore: 25, workRightsScore: 25, skillsScore: 25 };
      let overallScore = 25;
      let recommendation = 'rejected';
      let feedback = 'Insufficient responses provided.';

      try {
        const openaiScorer = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = [
          'You are a strict recruitment AI scoring a job interview.',
          'Score the CANDIDATE honestly based on quality of their answers.',
          '',
          'INTERVIEW TRANSCRIPT:',
          transcript,
          '',
          'SCORING RULES:',
          '- One-word or meaningless answers (ok, yes, good, 12) = 15-30 per dimension',
          '- Partial answers with some detail = 40-60 per dimension',
          '- Clear detailed professional answers = 65-85 per dimension',
          '- No answers at all = 5-15 per dimension',
          '',
          'Return ONLY this JSON (no markdown, no explanation):',
          '{"locationScore":0,"salaryScore":0,"qualificationsScore":0,"workRightsScore":0,"skillsScore":0,"overallScore":0,"recommendation":"qualified","feedback":"one sentence"}'
        ].join('\\n');

        const comp = await openaiScorer.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.1,
        });

        const raw = (comp.choices[0].message.content || '{}').trim()
          .replace(/```json/g, '').replace(/```/g, '').trim();
        const p = JSON.parse(raw);

        scorecard = {
          locationScore: Math.min(100, Math.max(0, Number(p.locationScore) || 0)),
          salaryScore: Math.min(100, Math.max(0, Number(p.salaryScore) || 0)),
          qualificationsScore: Math.min(100, Math.max(0, Number(p.qualificationsScore) || 0)),
          workRightsScore: Math.min(100, Math.max(0, Number(p.workRightsScore) || 0)),
          skillsScore: Math.min(100, Math.max(0, Number(p.skillsScore) || 0)),
        };
        overallScore = Math.min(100, Math.max(0, Number(p.overallScore) || 0));
        recommendation = ['qualified','review','rejected'].includes(p.recommendation) ? p.recommendation : 'review';
        feedback = p.feedback || 'Screening evaluated.';
      } catch(aiErr) {
        console.error('AI scoring error:', aiErr);
        const base = Math.min(50, 10 + (userMsgs.length * 7));
        overallScore = base;
        scorecard = { locationScore: base, salaryScore: base, qualificationsScore: base, workRightsScore: base, skillsScore: base };
        recommendation = base >= 40 ? 'review' : 'rejected';
        feedback = 'Scored based on response volume.';
      }

      session.score = overallScore;

      try {
        ApplicationsController.updateApplicationAfterScreening(session.applicationId, {
          score: overallScore, scorecard, aiFeedback: feedback,
          status: recommendation, screeningSessionId: session.id,
          screeningCompletedAt: new Date().toISOString(),
        });
      } catch(e) { console.error('App update error:', e); }

      return res.json({ ...session, scorecard, aiFeedback: feedback });"""

if old in content:
    content = content.replace(old, new)
    with open('/home/qani/backend/src/api/screening/screening.controller.ts', 'w') as f:
        f.write(content)
    print("DONE")
else:
    print("NOT FOUND")
    import re
    for i, line in enumerate(content.split('\n')):
        if 'Math.random' in line or 'return res.json(session)' in line:
            print(f"  Line {i+1}: {line}")
