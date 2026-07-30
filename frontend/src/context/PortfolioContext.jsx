import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const PortfolioContext = createContext(null);

/* ── Fallback data (used when backend is unavailable) ── */
const FALLBACK_PORTFOLIO = {
  name: "Anup Dutta",
  title: "Data Analyst & Developer",
  tagline: "Turning data into insights and creating meaningful digital experiences",
  email: "anupdutta03work@gmail.com",
  phone: "+91 8017330067",
  location: "India",
  resumeLink: "/Anup_Dutta_New_Resume.pdf",
  social: {
    github: "https://github.com/anup2003D",
    linkedin: "https://www.linkedin.com/in/anup-dutta-9198171b6/",
    twitter: "",
  },
  about: "I'm a passionate Data Analyst with expertise in transforming complex data into actionable insights. With a strong background in statistical analysis, data visualization, and web development, I help businesses make data-driven decisions that drive growth and innovation.",
  stats: {
    yearsExperience: "3+",
    projectsCompleted: "15+",
    usersImpacted: "10K+",
  },
};

const FALLBACK_PROJECTS = [
  {
    _id: "fb-1",
    title: "House Price Prediction",
    description: "House price is predicted based on various features using machine learning algorithms.",
    image: "Cards.png",
    techStack: ["Python", "Tableau", "SQL"],
    category: "Data Science",
    demoLink: "https://github.com/anup2003D/House-Price-Prediction/blob/main/README.md",
    githubLink: "https://github.com/anup2003D/House-Price-Prediction",
    order: 1,
  },
  {
    _id: "fb-2",
    title: "Age and Gender Detector",
    description: "Detects age and gender of the person in the image using deep learning models.",
    image: "Profile CV.jpg",
    techStack: ["Python", "Scikit-learn", "Pandas"],
    category: "Deep Learning",
    demoLink: "#",
    githubLink: "https://github.com/anup2003D/Age-and-Gender-Detector",
    order: 2,
  },
  {
    _id: "fb-3",
    title: "JARVIS - AI Voice Assistant",
    description: "A Python-based AI voice assistant that performs voice-controlled tasks such as opening applications, searching the web, answering queries, and executing system commands using speech recognition and text-to-speech technologies.",
    image: "Profile CV.jpg",
    techStack: ["Python", "Speech Recognition", "pyttsx3", "OpenAI", "Automation", "APIs"],
    category: "Artificial Intelligence",
    demoLink: "https://github.com/anup2003D/JARVIS#readme",
    githubLink: "https://github.com/anup2003D/JARVIS",
    order: 3,
  },
  {
    _id: "fb-4",
    title: "AI-Powered Code Reviewer",
    description: "Intelligent code review system powered by machine learning.",
    image: "Anime.jpg",
    techStack: ["React", "Python", "FastAPI", "OpenAI API", "MongoDB"],
    category: "AI/ML",
    demoLink: "#",
    githubLink: "#",
    order: 4,
  },
  {
    _id: "fb-5",
    title: "Audit AI",
    description: "Creates Audit summary for influencers and content creators with NJA scraping",
    image: "Anime.jpg",
    techStack: ["React", "Python", "FastAPI", "OpenAI API", "MongoDB"],
    category: "AI/ML",
    demoLink: "#",
    githubLink: "#",
    order: 5,
  },
];

const FALLBACK_EXPERIENCES = [
  {
    _id: "fb-exp-1",
    company: "Arohanum Elevate",
    position: "AI Developer",
    period: "Oct 2025 - Present",
    location: "Remote",
    description: [
      "Developed interactive dashboards using Tableau and Power BI for stakeholder reporting",
      "Analyzed large datasets using Python and SQL to identify trends and insights",
      "Collaborated with cross-functional teams to implement data-driven solutions",
    ],
    technologies: ["Python", "Tableau", "SQL", "Power BI", "ClickUP"],
    order: 1,
  },
  // {
  //   _id: "fb-exp-2",
  //   company: "Freelance",
  //   position: "Data Science Developer",
  //   period: "Jan 2023 - May 2024",
  //   location: "Remote",
  //   description: [
  //     "Built machine learning models for customer segmentation and predictive analysis",
  //     "Created automated data pipelines for real-time analytics",
  //     "Developed web applications integrating data visualization components",
  //   ],
  //   technologies: ["Python", "React", "FastAPI", "MongoDB"],
  //   order: 2,
  // },
];

const FALLBACK_SKILLS = [
  {
    _id: "fb-sk-1",
    category: "data-analysis",
    categoryLabel: "Data Analysis",
    categoryColor: "#00d4ff",
    skills: [
      { name: "Python", level: 95 },
      { name: "R", level: 70 },
      { name: "SQL", level: 90 },
      { name: "Excel", level: 85 },
    ],
    order: 1,
  },
  {
    _id: "fb-sk-2",
    category: "data-visualization",
    categoryLabel: "Data Visualization",
    categoryColor: "#005eff",
    skills: [
      { name: "Tableau", level: 90 },
      { name: "Power BI", level: 85 },
      { name: "D3.js", level: 70 },
      { name: "Matplotlib", level: 85 },
    ],
    order: 2,
  },
  {
    _id: "fb-sk-3",
    category: "web-development",
    categoryLabel: "Web Development",
    categoryColor: "#22d3ee",
    skills: [
      { name: "JavaScript", level: 85 },
      { name: "React", level: 80 },
      { name: "HTML/CSS", level: 90 },
      { name: "Node.js", level: 75 },
    ],
    order: 3,
  },
  {
    _id: "fb-sk-4",
    category: "machine-learning",
    categoryLabel: "Machine Learning",
    categoryColor: "#3b82f6",
    skills: [
      { name: "Scikit-learn", level: 85 },
      { name: "TensorFlow", level: 65 },
      { name: "Pandas", level: 95 },
      { name: "NumPy", level: 90 },
    ],
    order: 4,
  },
];

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, proj, exp, skills] = await Promise.all([
        api.getPortfolio(),
        api.getProjects(),
        api.getExperiences(),
        api.getSkills(),
      ]);
      setPortfolio(p);
      setProjects(proj);
      setExperiences(exp);
      setSkillCategories(skills);
    } catch (err) {
      // Backend unavailable — use fallback data so the site still works
      console.warn('Backend unavailable, using fallback data:', err.message);
      setPortfolio(FALLBACK_PORTFOLIO);
      setProjects(FALLBACK_PROJECTS);
      setExperiences(FALLBACK_EXPERIENCES);
      setSkillCategories(FALLBACK_SKILLS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refetch = fetchAll;

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        projects,
        experiences,
        skillCategories,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
