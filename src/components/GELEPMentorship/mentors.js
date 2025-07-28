


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

  // Hardcoded data for mentees - Rwandan context with diverse career goals
  export const mentees = [
    {
      id: 1,
      name: "Uwimana Vestine",
      currentRole: "Assistant Director",
      company: "Ministry of Health",
      goals: ["Public Leadership", "Policy Development", "Health System Management"],
      experience: 6,
      interests: ["Healthcare", "Public Policy", "Community Health"],
      bio: "Healthcare administrator aspiring to lead Rwanda's health system transformation",
      location: "Kigali"
    },
    {
      id: 2,
      name: "Mukamana Claudine",
      currentRole: "Program Manager",
      company: "Pro-Femmes Twese Hamwe",
      goals: ["Non-profit Leadership", "Women's Rights", "Advocacy"],
      experience: 8,
      interests: ["Gender Equality", "Women's Empowerment", "Social Justice"],
      bio: "Women's rights advocate seeking to expand impact in gender equality initiatives",
      location: "Kigali"
    },
    {
      id: 3,
      name: "Nyirahabimana Alice",
      currentRole: "Senior Lecturer",
      company: "University of Rwanda",
      goals: ["Academic Leadership", "Research Excellence", "Higher Education Reform"],
      experience: 9,
      interests: ["Education", "Research", "Student Development"],
      bio: "Academic professional aiming for university leadership and educational innovation",
      location: "Butare"
    },
    {
      id: 4,
      name: "Uwizeyimana Solange",
      currentRole: "Business Development Manager",
      company: "Bank of Kigali",
      goals: ["Financial Leadership", "Banking Innovation", "Economic Development"],
      experience: 7,
      interests: ["Finance", "Banking", "Economic Growth"],
      bio: "Banking professional seeking executive leadership in Rwanda's financial sector",
      location: "Kigali"
    },
    {
      id: 5,
      name: "Mukarugwiza Esperance",
      currentRole: "Cooperative Manager",
      company: "Abahizi Women's Cooperative",
      goals: ["Cooperative Leadership", "Rural Development", "Agricultural Innovation"],
      experience: 5,
      interests: ["Agriculture", "Rural Development", "Women's Cooperatives"],
      bio: "Cooperative leader working to empower rural women through agricultural initiatives",
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