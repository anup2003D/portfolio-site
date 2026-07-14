from datetime import datetime
from typing import Optional

# pyrefly: ignore [missing-import]
from bson import ObjectId
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from config import get_collection
from models import (
    ContactMessage,
    Experience,
    PortfolioInfo,
    Project,
    SkillCategory,
)

app = FastAPI(title="Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_doc(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


# --- Portfolio Info ---


@app.get("/api/portfolio")
async def get_portfolio():
    col = get_collection("portfolio_info")
    doc = await col.find_one()
    if not doc:
        raise HTTPException(404, "Portfolio info not found")
    return serialize_doc(doc)


@app.put("/api/portfolio")
async def update_portfolio(data: PortfolioInfo):
    col = get_collection("portfolio_info")
    doc = await col.find_one()
    if doc:
        await col.update_one({}, {"$set": data.model_dump()})
    else:
        await col.insert_one(data.model_dump())
    return {"message": "Portfolio updated"}


# --- Projects ---


@app.get("/api/projects")
async def get_projects(category: Optional[str] = None):
    col = get_collection("projects")
    query = {"category": category} if category else {}
    docs = await col.find(query).sort("order", 1).to_list(None)
    return [serialize_doc(d) for d in docs]


@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    col = get_collection("projects")
    doc = await col.find_one({"_id": ObjectId(project_id)})
    if not doc:
        raise HTTPException(404, "Project not found")
    return serialize_doc(doc)


@app.post("/api/projects")
async def create_project(data: Project):
    col = get_collection("projects")
    result = await col.insert_one(data.model_dump())
    return {"_id": str(result.inserted_id)}


@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, data: Project):
    col = get_collection("projects")
    result = await col.update_one(
        {"_id": ObjectId(project_id)}, {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Project not found")
    return {"message": "Project updated"}


@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    col = get_collection("projects")
    result = await col.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Project not found")
    return {"message": "Project deleted"}


# --- Experiences ---


@app.get("/api/experiences")
async def get_experiences():
    col = get_collection("experiences")
    docs = await col.find().sort("order", 1).to_list(None)
    return [serialize_doc(d) for d in docs]


@app.post("/api/experiences")
async def create_experience(data: Experience):
    col = get_collection("experiences")
    result = await col.insert_one(data.model_dump())
    return {"_id": str(result.inserted_id)}


@app.put("/api/experiences/{experience_id}")
async def update_experience(experience_id: str, data: Experience):
    col = get_collection("experiences")
    result = await col.update_one(
        {"_id": ObjectId(experience_id)}, {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Experience not found")
    return {"message": "Experience updated"}


@app.delete("/api/experiences/{experience_id}")
async def delete_experience(experience_id: str):
    col = get_collection("experiences")
    result = await col.delete_one({"_id": ObjectId(experience_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Experience not found")
    return {"message": "Experience deleted"}


# --- Skills ---


@app.get("/api/skills")
async def get_skills():
    col = get_collection("skills")
    docs = await col.find().sort("order", 1).to_list(None)
    return [serialize_doc(d) for d in docs]


@app.put("/api/skills/{category}")
async def update_skills(category: str, data: SkillCategory):
    col = get_collection("skills")
    result = await col.update_one(
        {"category": category}, {"$set": data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Skill category not found")
    return {"message": "Skills updated"}


# --- Contact ---


@app.post("/api/contact")
async def submit_contact(data: ContactMessage):
    col = get_collection("contact_messages")
    result = await col.insert_one(data.model_dump())
    return {"_id": str(result.inserted_id), "message": "Message sent"}


@app.get("/api/contact/messages")
async def get_messages():
    col = get_collection("contact_messages")
    docs = await col.find().sort("createdAt", -1).to_list(None)
    return [serialize_doc(d) for d in docs]


@app.put("/api/contact/messages/{message_id}/read")
async def mark_read(message_id: str):
    col = get_collection("contact_messages")
    result = await col.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": {"status": "read", "readAt": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Message not found")
    return {"message": "Message marked as read"}
