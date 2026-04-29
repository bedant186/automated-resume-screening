export const analyzeResumeWithJob = async (resumeText, jobDescription, jobTitle = "") => {  const clean = (text) =>
    text.toLowerCase().replace(/[^a-z0-9+#. ]/g, " ");

  const resume = clean(resumeText);
  const jd = clean(jobDescription + " " + jobTitle);

  const skillKeywords = [
    "javascript", "typescript", "react", "node", "express", "mongodb",
    "sql", "mysql", "python", "java", "c++", "html", "css",
    "api", "rest", "git", "github", "docker", "aws", "cloud",
    "database", "frontend", "backend", "full stack", "system design"
  ];

  const projectKeywords = [
    "project", "developed", "built", "implemented", "created",
    "deployed", "application", "website", "dashboard", "api"
  ];

  const educationKeywords = [
    "bachelor", "btech", "b.e", "computer science", "engineering",
    "degree", "university", "college", "cgpa"
  ];

  const certificationKeywords = [
    "certificate", "certification", "course", "training",
    "internship", "workshop"
  ];

  function calculateScore(keywords) {
    const required = keywords.filter(word => jd.includes(word));
    const searchList = required.length > 0 ? required : keywords;

    let matched = 0;

    searchList.forEach(word => {
      if (resume.includes(word)) matched++;
    });

    return Math.min(100, Math.round((matched / searchList.length) * 100));
  }

  const technicalSkills = calculateScore(skillKeywords);
  const projects = calculateScore(projectKeywords);
  const education = calculateScore(educationKeywords);
  const certifications = calculateScore(certificationKeywords);

  const coreKnowledge = Math.round(
    (technicalSkills * 0.6) + (projects * 0.4)
  );

  const overallScore = Math.round(
    technicalSkills * 0.4 +
    projects * 0.25 +
    coreKnowledge * 0.15 +
    education * 0.1 +
    certifications * 0.1
  );

  const missingSkills = skillKeywords.filter(
    skill => jd.includes(skill) && !resume.includes(skill)
  );

  return {
    overallScore,

    sectionScores: {
      technicalSkills,
      projects,
      coreKnowledge,
      education,
      certifications,
      atsStructure: 75
    },

    skillsBreakdown: {
      technical: technicalSkills,
      projects,
      coreKnowledge,
      education,
      certifications,
      atsStructure: 75
    },

    strengths: [
      technicalSkills > 50 ? "Good technical skill match" : "Basic technical match found",
      projects > 50 ? "Project experience is relevant" : "Some project keywords found"
    ],

    gaps: missingSkills.length > 0
      ? missingSkills.slice(0, 5)
      : ["No major keyword gaps found"],

    majorWeaknesses: missingSkills.length > 0
      ? ["Resume is missing some job-specific keywords"]
      : ["Resume matches the job description reasonably well"],

    mustDoImprovements: [
      "Add missing skills from the job description",
      "Mention project impact clearly",
      "Use ATS-friendly keywords"
    ],

    honestVerdict:
      overallScore >= 70
        ? "Good match for this role"
        : overallScore >= 40
        ? "Average match, improvement needed"
        : "Low match, resume needs improvement",

    recommendations: [
      "Add technologies mentioned in the JD",
      "Add measurable achievements",
      "Improve project descriptions"
    ],

    keywordMatches: skillKeywords.filter(skill => resume.includes(skill))
  };
};