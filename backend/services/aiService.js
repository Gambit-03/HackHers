const DUMMY_INTERNSHIPS = [
	{
		id: "INT-001",
		title: "AI Research Intern",
		company: "Innova Labs",
		domain: "AI",
		skillsRequired: ["python", "ml", "pytorch", "rag"],
		availability: "offline",
		duration: "1 year",
		experienceLevel: "intermediate",
		stipend: "INR 25,000/month",
	},
	{
		id: "INT-002",
		title: "Frontend Developer Intern",
		company: "Pixel Forge",
		domain: "Web Development",
		skillsRequired: ["react", "javascript", "css", "html"],
		availability: "remote",
		duration: "6 months",
		experienceLevel: "fresher",
		stipend: "INR 18,000/month",
	},
	{
		id: "INT-003",
		title: "Data Analyst Intern",
		company: "DataVista",
		domain: "Data Science",
		skillsRequired: ["python", "sql", "excel", "power bi"],
		availability: "hybrid",
		duration: "1 year",
		experienceLevel: "fresher",
		stipend: "INR 22,000/month",
	},
	{
		id: "INT-004",
		title: "Backend Engineering Intern",
		company: "CloudNest",
		domain: "Software Engineering",
		skillsRequired: ["node.js", "express", "mongodb", "api"],
		availability: "offline",
		duration: "1 year",
		experienceLevel: "intermediate",
		stipend: "INR 28,000/month",
	},
	{
		id: "INT-005",
		title: "Computer Vision Intern",
		company: "VisionGrid",
		domain: "AI",
		skillsRequired: ["python", "opencv", "pytorch", "deep learning"],
		availability: "offline",
		duration: "1 year",
		experienceLevel: "advanced",
		stipend: "INR 30,000/month",
	},
];

const normalize = (value = "") => value.toString().trim().toLowerCase();

const toSkillArray = (skillsInput) => {
	if (Array.isArray(skillsInput)) {
		return skillsInput.map((s) => normalize(s)).filter(Boolean);
	}

	return normalize(skillsInput)
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
};

exports.getRecommendations = (profile) => {
	const userDomain = normalize(profile.domain);
	const userSkills = toSkillArray(profile.skills);
	const userAvailability = normalize(profile.availability);
	const userDuration = normalize(profile.preferredDuration);
	const userExperience = normalize(profile.experienceLevel);

	// 4 criteria: domain, skills, availability (mode), duration/commitment.
	const ranked = DUMMY_INTERNSHIPS.map((internship) => {
		const internDomain = normalize(internship.domain);
		const internSkills = internship.skillsRequired.map((s) => normalize(s));
		const internAvailability = normalize(internship.availability);
		const internDuration = normalize(internship.duration);
		const internExperience = normalize(internship.experienceLevel);

		const criteriaScores = {
			domain: internDomain === userDomain ? 25 : 0,
			skills: 0,
			availability: internAvailability === userAvailability ? 25 : 0,
			duration: internDuration === userDuration ? 25 : 0,
		};

		const matchedSkills = internSkills.filter((skill) => userSkills.includes(skill));
		criteriaScores.skills = Math.round((matchedSkills.length / internSkills.length) * 25);

		// Experience acts as a tie-breaker placeholder to make ranking more realistic.
		const experienceBonus = userExperience && userExperience === internExperience ? 5 : 0;

		const totalScore =
			criteriaScores.domain +
			criteriaScores.skills +
			criteriaScores.availability +
			criteriaScores.duration +
			experienceBonus;

		return {
			...internship,
			matchedSkills,
			criteriaScores,
			totalScore,
		};
	}).sort((a, b) => b.totalScore - a.totalScore);

	return ranked;
};