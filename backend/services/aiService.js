// const Internship = require("../models/Internship");

// exports.getRecommendations = async (student) => {
//   const internships = await Internship.find({});

//   const results = internships.map((intern) => {
//     let score = 0;

//     const studentSkills = student.skills.map(s => s.toLowerCase());

//     // 🎯 Domain Match (30)
//     if (
//       student.domain &&
//       intern.domain.toLowerCase() === student.domain.toLowerCase()
//     ) {
//       score += 30;
//     }

//     // 🎯 Mode Match (10)
//     if (
//       student.mode &&
//       intern.mode.toLowerCase() === student.mode.toLowerCase()
//     ) {
//       score += 10;
//     }

//     // 🎯 Skill Match (50 max)
//     const matchedSkills = intern.skillsRequired.filter(skill =>
//       studentSkills.includes(skill.toLowerCase())
//     );

//     const skillScore =
//       (matchedSkills.length / intern.skillsRequired.length) * 50;

//     score += skillScore;

//     // 🎯 Skill Gap
//     const skillGap = intern.skillsRequired.filter(
//       skill => !studentSkills.includes(skill.toLowerCase())
//     );

//     return {
//       internship: intern,
//       score: Math.round(score),
//       skillGap
//     };
//   });

//   // 🏆 Ranking System
//   const ranked = results.sort((a, b) => b.score - a.score);

//   // 🔥 Return Top 5
//   return ranked.slice(0, 5);
// };