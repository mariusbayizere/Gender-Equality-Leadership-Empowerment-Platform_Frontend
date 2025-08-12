// // Mock data
// const mentors = [
//   {
//     id: 1,
//     name: "Jeanne d'Arc Mujawamariya",
//     title: "Chief Executive Officer",
//     company: "Rwanda Development Board",
//     location: "Kigali, Rwanda",
//     expertise: ["Strategic Leadership", "Public Policy", "Economic Development", "International Relations"],
//     experience: 15,
//     rating: 4.9,
//     sessions: 127
//   },
//   {
//     id: 2,
//     name: "Dr. Diane Karusisi",
//     title: "Chief Executive Officer",
//     company: "Bank of Kigali",
//     location: "Kigali, Rwanda",
//     expertise: ["Financial Leadership", "Banking", "Corporate Strategy", "Digital Transformation"],
//     experience: 18,
//     rating: 4.8,
//     sessions: 98
//   },
//   {
//     id: 3,
//     name: "Clarisse Iribagiza",
//     title: "Chief Executive Officer",
//     company: "HeHe Limited",
//     location: "Kigali, Rwanda",
//     expertise: ["Technology Innovation", "Startup Leadership", "Product Development", "Market Expansion"],
//     experience: 12,
//     rating: 4.7,
//     sessions: 156
//   }
// ];

// const mentees = [
//   {
//     id: 1,
//     name: "Aline Uwimana",
//     currentRole: "Senior Policy Analyst",
//     company: "Ministry of Finance",
//     location: "Kigali, Rwanda",
//     goals: ["Strategic Leadership", "Policy Development", "Team Management"],
//     interests: ["Public Administration", "Economic Policy", "Leadership Development"],
//     experience: 5
//   },
//   {
//     id: 2,
//     name: "Grace Mutesi",
//     currentRole: "Operations Manager",
//     company: "Equity Bank Rwanda",
//     location: "Kigali, Rwanda",
//     goals: ["Executive Leadership", "Financial Management", "Digital Banking"],
//     interests: ["Financial Services", "Technology", "Customer Experience"],
//     experience: 7
//   },
//   {
//     id: 3,
//     name: "Immaculée Ingabire",
//     currentRole: "Product Manager",
//     company: "Andela Rwanda",
//     location: "Kigali, Rwanda",
//     goals: ["Technology Leadership", "Product Strategy", "Innovation Management"],
//     interests: ["Software Development", "AI/ML", "Tech Entrepreneurship"],
//     experience: 4
//   }
// ];

// const sessionData = [
//   {
//     id: 1,
//     mentorId: 1,
//     menteeId: 1,
//     title: "Strategic Leadership Development",
//     date: "2025-08-05",
//     time: "14:00",
//     duration: 60,
//     status: "scheduled",
//     type: "video",
//     agenda: "Leadership frameworks and decision-making processes"
//   },
//   {
//     id: 2,
//     mentorId: 2,
//     menteeId: 2,
//     title: "Financial Management Excellence",
//     date: "2025-08-06",
//     time: "10:00",
//     duration: 45,
//     status: "scheduled",
//     type: "video",
//     agenda: "Financial planning and risk management strategies"
//   },
//   {
//     id: 3,
//     mentorId: 3,
//     menteeId: 3,
//     title: "Innovation Leadership",
//     date: "2025-07-28",
//     time: "16:00",
//     duration: 60,
//     status: "completed",
//     type: "video",
//     agenda: "Product innovation and market strategies"
//   }
// ];

// const progressData = [
//   {
//     menteeId: 1,
//     mentorId: 1,
//     sessionsCompleted: 8,
//     totalSessions: 12,
//     skillsProgress: {
//       "Strategic Thinking": 75,
//       "Policy Development": 85,
//       "Team Leadership": 70,
//       "Public Speaking": 60
//     },
//     feedback: "Excellent progress in policy analysis and strategic thinking. Ready for more complex leadership challenges.",
//     nextMilestone: "Lead cross-departmental policy initiative"
//   },
//   {
//     menteeId: 2,
//     mentorId: 2,
//     sessionsCompleted: 6,
//     totalSessions: 10,
//     skillsProgress: {
//       "Financial Analysis": 80,
//       "Digital Banking": 65,
//       "Team Management": 75,
//       "Customer Relations": 85
//     },
//     feedback: "Strong analytical skills developing. Focus needed on digital transformation leadership.",
//     nextMilestone: "Present digital strategy to executive team"
//   }
// ];





  // Hardcoded data for mentors - Rwandan context with diverse fields
  export const mentors = [
    {
      id: 1,
      name: "Jeanne d'Arc Mujawamariya",
      title: "Minister of Education",
      company: "Government of Rwanda",
      expertise: ["Public Leadership", "Policy Development", "Educational Reform"],
      experience: 18,
      rating: 4.9,
      availability: "Weekends, Evenings",
      bio: "Experienced public sector leader passionate about education and women's empowerment in Rwanda",
      location: "Kigali"
    },
    {
      id: 2,
      name: "Grace Uwimana",
      title: "Chief Executive Officer",
      company: "Rwanda Women's Network",
      expertise: ["Non-profit Leadership", "Women's Rights", "Community Development"],
      experience: 15,
      rating: 4.8,
      availability: "Flexible",
      bio: "NGO executive dedicated to advancing gender equality and women's rights in Rwanda",
      location: "Kigali"
    },
    {
      id: 3,
      name: "Dr. Inyumba Aloisea",
      title: "Director of Research",
      company: "University of Rwanda",
      expertise: ["Academic Leadership", "Research Management", "Higher Education"],
      experience: 20,
      rating: 4.9,
      availability: "Weekdays 2-5 PM",
      bio: "Academic leader with extensive experience in research and university administration",
      location: "Butare"
    },
    {
      id: 4,
      name: "Clarisse Iribagiza",
      title: "CEO & Founder",
      company: "HeHe Limited",
      expertise: ["Entrepreneurship", "Business Development", "Tech Innovation"],
      experience: 12,
      rating: 4.7,
      availability: "Evenings",
      bio: "Tech entrepreneur and business leader driving innovation in Rwanda's digital economy",
      location: "Kigali"
    },
    {
      id: 5,
      name: "Immaculée Uwanyirigira",
      title: "Director General",
      company: "Rwanda Governance Board",
      expertise: ["Governance", "Public Administration", "Institutional Development"],
      experience: 16,
      rating: 4.8,
      availability: "Weekends",
      bio: "Public administration expert focused on strengthening governance systems in Rwanda",
      location: "Kigali"
    }
  ];

export const mentees = [
    {
      id: 1,
      name: "Abijuru Raissa",
      currentRole: "Nurse",
      company: "Kigali University Hospital",
      goals: ["Career Development", "Healthcare Skills", "Patient Care Excellence"],
      experience: 3,
      interests: ["Healthcare", "Patient Care", "Medical Training"],
      bio: "Dedicated nurse looking to advance career and improve patient care skills",
      location: "Kigali"
    },
    {
      id: 2,
      name: "Mukamana Claudine",
      currentRole: "Administrative Assistant",
      company: "Pro-Femmes Twese Hamwe",
      goals: ["Professional Growth", "Project Coordination", "Communication Skills"],
      experience: 2,
      interests: ["Administration", "Community Work", "Women's Rights"],
      bio: "Administrative professional seeking to develop project management and leadership skills",
      location: "Kigali"
    },
    {
      id: 3,
      name: "Nyirahabimana Alice",
      currentRole: "Teaching Assistant",
      company: "University of Rwanda",
      goals: ["Teaching Excellence", "Research Skills", "Academic Growth"],
      experience: 4,
      interests: ["Education", "Student Mentoring", "Academic Research"],
      bio: "Teaching assistant working towards becoming a qualified lecturer and researcher",
      location: "Butare"
    },
    {
      id: 4,
      name: "Uwizeyimana Solange",
      currentRole: "Bank Teller",
      company: "Bank of Kigali",
      goals: ["Financial Knowledge", "Customer Service", "Career Advancement"],
      experience: 2,
      interests: ["Finance", "Customer Relations", "Banking Operations"],
      bio: "Bank teller eager to learn more about financial services and advance within banking",
      location: "Kigali"
    },
    {
      id: 5,
      name: "Mukarugwiza Esperance",
      currentRole: "Farm Worker",
      company: "Abahizi Women's Cooperative",
      goals: ["Agricultural Skills", "Cooperative Management", "Sustainable Farming"],
      experience: 3,
      interests: ["Farming", "Rural Development", "Women's Empowerment"],
      bio: "Farm worker passionate about learning modern agricultural techniques and cooperative principles",
      location: "Musanze"
    }
  ];

  // Hardcoded session data with Rwandan context
  export const sessionData = [
    {
      id: 1,
      mentorId: 1,
      menteeId: 1,
      title: "Public Sector Leadership Transition",
      date: "2025-07-30",
      time: "14:00",
      duration: 60,
      status: "scheduled",
      type: "video",
      agenda: "Discuss transition from mid-management to senior leadership in public health"
    },
    {
      id: 2,
      mentorId: 2,
      menteeId: 2,
      title: "Women's Rights Advocacy Strategy",
      date: "2025-08-02",
      time: "10:00",
      duration: 90,
      status: "completed",
      type: "video",
      agenda: "Review advocacy strategies and coalition building for gender equality"
    },
    {
      id: 3,
      mentorId: 4,
      menteeId: 4,
      title: "Financial Sector Innovation",
      date: "2025-08-05",
      time: "16:00",
      duration: 75,
      status: "scheduled",
      type: "video",
      agenda: "Exploring fintech opportunities and leadership in banking sector"
    }
  ];

  // Hardcoded progress data with Rwandan context
  export const progressData = [
    {
      menteeId: 1,
      mentorId: 1,
      sessionsCompleted: 10,
      totalSessions: 15,
      skillsProgress: {
        "Public Leadership": 78,
        "Policy Development": 65,
        "Health System Management": 72
      },
      feedback: "Vestine demonstrates exceptional understanding of health policy and shows strong leadership potential",
      nextMilestone: "Lead national health campaign initiative"
    },
    {
      menteeId: 2,
      mentorId: 2,
      sessionsCompleted: 8,
      totalSessions: 12,
      skillsProgress: {
        "Non-profit Leadership": 85,
        "Women's Rights": 90,
        "Advocacy": 82
      },
      feedback: "Claudine shows remarkable progress in advocacy skills and coalition building",
      nextMilestone: "Present gender equality policy recommendations to Parliament"
    },
    {
      menteeId: 4,
      mentorId: 4,
      sessionsCompleted: 6,
      totalSessions: 10,
      skillsProgress: {
        "Financial Leadership": 75,
        "Banking Innovation": 68,
        "Economic Development": 70
      },
      feedback: "Solange demonstrates strong analytical skills and innovative thinking in financial services",
      nextMilestone: "Lead digital banking transformation project"
    }
  ];