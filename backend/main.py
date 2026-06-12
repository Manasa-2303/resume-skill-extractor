from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from extractor import extract_text_from_pdf, extract_skills, match_jd

app = FastAPI(title="Resume Skill Extractor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "running", "version": "1.0"}

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text_from_pdf(content)
    skills = extract_skills(text)
    total = sum(len(v) for v in skills.values())
    return {
        "skills": skills,
        "total_found": total,
        "filename": file.filename
    }

@app.post("/match")
async def match(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    content = await file.read()
    text = extract_text_from_pdf(content)
    skills = extract_skills(text)
    result = match_jd(skills, job_description)
    return {
        "resume_skills": skills,
        "match_result": result
    }
