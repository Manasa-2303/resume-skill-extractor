import io
import pdfplumber
import spacy
from skills_db import SKILLS

nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.lower()

def extract_skills(text: str) -> dict:
    found = {}
    for category, skill_list in SKILLS.items():
        matched = [s for s in skill_list if s in text]
        if matched:
            found[category] = matched
    return found

def match_jd(resume_skills: dict, jd_text: str) -> dict:
    jd_lower = jd_text.lower()
    all_resume = [s for lst in resume_skills.values() for s in lst]
    all_jd = [s for lst in SKILLS.values() for s in lst if s in jd_lower]
    matched = [s for s in all_resume if s in all_jd]
    missing = [s for s in all_jd if s not in all_resume]
    score = round(len(matched) / len(all_jd) * 100) if all_jd else 0
    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "match_score": score
    }
