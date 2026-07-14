import asyncio

from config import get_collection
from models import (
    ContactMessage,
    Experience,
    PortfolioInfo,
    Project,
    Skill,
    SkillCategory,
)


async def seed():
    # Portfolio Info
    portfolio = PortfolioInfo(
        name="Anup Dutta",
        title="Data Analyst & Developer",
        tagline="Turning data into insights and creating meaningful digital experiences",
        email="anupdutta03work@gmail.com",
        phone="+91 8017330067",
        location="India",
        resumeLink="/Goldman Sachs Application.png",
        social={
            "github": "https://github.com/anup2003D",
            "linkedin": "https://www.linkedin.com/in/anup-dutta-9198171b6/",
            "twitter": "",
        },
        about="I'm a passionate Data Analyst with expertise in transforming complex data into actionable insights. With a strong background in statistical analysis, data visualization, and web development, I help businesses make data-driven decisions that drive growth and innovation.",
        stats={
            "yearsExperience": "3+",
            "projectsCompleted": "15+",
            "usersImpacted": "10K+",
        },
    )

    # Projects
    projects = [
        Project(
            title="House Price Prediction",
            description="House price is predicted based on various features using machine learning algorithms.",
            image="Cards.png",
            techStack=["Python", "Tableau", "SQL"],
            category="Data Science",
            demoLink="#",
            githubLink="#",
            color="#00d4ff",
            order=1,
            featured=True,
        ),
        Project(
            title="Customer Segmentation Model",
            description="Machine learning model for customer segmentation and targeting.",
            image="Profile CV.jpg",
            techStack=["Python", "Scikit-learn", "Pandas"],
            category="Machine Learning",
            demoLink="#",
            githubLink="#",
            color="#005eff",
            order=2,
            featured=True,
        ),
        Project(
            title="Financial Forecasting App",
            description="Web application for financial forecasting and risk analysis.",
            image="Profile CV.jpg",
            techStack=["React", "Node.js", "D3.js"],
            category="Web Development",
            demoLink="#",
            githubLink="#",
            color="#22d3ee",
            order=3,
            featured=True,
        ),
        Project(
            title="AI-Powered Code Reviewer",
            description="Intelligent code review system powered by machine learning.",
            image="Anime.jpg",
            techStack=["React", "Python", "FastAPI", "OpenAI API", "MongoDB"],
            category="AI/ML",
            demoLink="#",
            githubLink="#",
            color="#3b82f6",
            order=4,
            featured=False,
        ),
    ]

    # Experiences
    experiences = [
        Experience(
            company="Tech Innovations Inc.",
            position="Data Analyst Intern",
            period="Jun 2024 - Present",
            location="Remote",
            description=[
                "Developed interactive dashboards using Tableau and Power BI for stakeholder reporting",
                "Analyzed large datasets using Python and SQL to identify trends and insights",
                "Collaborated with cross-functional teams to implement data-driven solutions",
            ],
            technologies=["Python", "Tableau", "SQL", "Power BI"],
            order=1,
            current=True,
        ),
        Experience(
            company="Freelance",
            position="Data Science Developer",
            period="Jan 2023 - May 2024",
            location="Remote",
            description=[
                "Built machine learning models for customer segmentation and predictive analysis",
                "Created automated data pipelines for real-time analytics",
                "Developed web applications integrating data visualization components",
            ],
            technologies=["Python", "React", "FastAPI", "MongoDB"],
            order=2,
            current=False,
        ),
    ]

    # Skill Categories
    skill_categories = [
        SkillCategory(
            category="data-analysis",
            categoryLabel="Data Analysis",
            categoryColor="#00d4ff",
            skills=[
                Skill(name="Python", level=95),
                Skill(name="R", level=70),
                Skill(name="SQL", level=90),
                Skill(name="Excel", level=85),
            ],
            order=1,
        ),
        SkillCategory(
            category="data-visualization",
            categoryLabel="Data Visualization",
            categoryColor="#005eff",
            skills=[
                Skill(name="Tableau", level=90),
                Skill(name="Power BI", level=85),
                Skill(name="D3.js", level=70),
                Skill(name="Matplotlib", level=85),
            ],
            order=2,
        ),
        SkillCategory(
            category="web-development",
            categoryLabel="Web Development",
            categoryColor="#22d3ee",
            skills=[
                Skill(name="JavaScript", level=85),
                Skill(name="React", level=80),
                Skill(name="HTML/CSS", level=90),
                Skill(name="Node.js", level=75),
            ],
            order=3,
        ),
        SkillCategory(
            category="machine-learning",
            categoryLabel="Machine Learning",
            categoryColor="#3b82f6",
            skills=[
                Skill(name="Scikit-learn", level=85),
                Skill(name="TensorFlow", level=65),
                Skill(name="Pandas", level=95),
                Skill(name="NumPy", level=90),
            ],
            order=4,
        ),
    ]

    # Seed portfolio info
    col = get_collection("portfolio_info")
    await col.delete_many({})
    await col.insert_one(portfolio.model_dump())
    print("Seeded portfolio_info")

    # Seed projects
    col = get_collection("projects")
    await col.delete_many({})
    await col.insert_many([p.model_dump() for p in projects])
    print("Seeded projects")

    # Seed experiences
    col = get_collection("experiences")
    await col.delete_many({})
    await col.insert_many([e.model_dump() for e in experiences])
    print("Seeded experiences")

    # Seed skills
    col = get_collection("skills")
    await col.delete_many({})
    await col.insert_many([s.model_dump() for s in skill_categories])
    print("Seeded skills")


if __name__ == "__main__":
    asyncio.run(seed())
