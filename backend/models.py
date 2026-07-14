from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SocialLinks(BaseModel):
    github: str = ""
    linkedin: str = ""
    twitter: str = ""


class PortfolioStats(BaseModel):
    yearsExperience: str = ""
    projectsCompleted: str = ""
    usersImpacted: str = ""


class PortfolioInfo(BaseModel):
    name: str
    title: str
    tagline: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    resumeLink: str = ""
    social: SocialLinks = SocialLinks()
    about: str = ""
    stats: PortfolioStats = PortfolioStats()


class Project(BaseModel):
    title: str
    description: str = ""
    image: str = ""
    techStack: list[str] = []
    category: str = ""
    demoLink: str = ""
    githubLink: str = ""
    color: str = "#3b82f6"
    order: int = 0
    featured: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class Experience(BaseModel):
    company: str
    position: str
    period: str = ""
    location: str = ""
    description: list[str] = []
    technologies: list[str] = []
    order: int = 0
    current: bool = False
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None


class Skill(BaseModel):
    name: str
    level: int = 0


class SkillCategory(BaseModel):
    category: str
    categoryLabel: str = ""
    categoryColor: str = "#22d3ee"
    skills: list[Skill] = []
    order: int = 0


class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str
    status: str = "unread"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    readAt: Optional[datetime] = None
