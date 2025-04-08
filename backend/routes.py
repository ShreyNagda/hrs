### routes.py

from http.client import HTTPException
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Literal
from pydantic import BaseModel
import shutil
import os
from utils import analyze_face_shape, predict_hairstyles

router = APIRouter()

@router.post("/faceshape")
async def analyze_face(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_face_shape(file_path)
    os.remove(file_path)
    return result

class UserInfo(BaseModel):
    age_group: Literal['teens', 'youth', 'adults', 'seniors']
    gender: Literal['male', 'female']
    role: Literal['creative', 'student', 'professional', 'others']
    hair_length: str
    hair_type: str
    face_shape: str

@router.post("/hairstyle")
async def get_hairstyle(user: UserInfo):
    print(user)
    user_dict = {
        'age group': user.age_group,
        'gender': user.gender,
        'role': user.role,
        'hair length': user.hair_length,
        'hair type': user.hair_type,
        'face shape': user.face_shape
    }

    result = predict_hairstyles(user_dict)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])


    return {
        "recommended_classic_hairstyle": result["classic"],
        "recommended_trendy_hairstyle": result["trendy"]
    }
