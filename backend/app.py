from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
#api keys from .env
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import os
#helper functions
from utils.face_shape import analyze_faceshape
from utils.hairstyles import get_recommendations

# Load the .env file
load_dotenv()

# Access the keys
API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")


app = FastAPI(title="Hairstyle Recommendation")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API request schema
class UserProfile(BaseModel):
    face_shape: str
    age_group: str
    gender: str
    hair_length: Optional[str] = None # Short, Medium, Long
    hair_type: Optional[str] = None # Straight, Curly, Wavy
    occasion: Optional[str] = None # Formal, Casual, Sports, Festive

def resize_image(file, size=(200, 300)):
    image = Image.open(file)
    image = image.convert("RGB")  # Ensure it's in a compatible format
    image = image.resize(size)

    # Save resized image to BytesIO
    buffer = BytesIO()
    image.save(buffer, format='JPEG')
    buffer.seek(0)

    return ('filename.jpg', buffer, 'image/jpeg')

@app.get("/")
def home():
    return JSONResponse(content="Hairstyle Recommendation System API v1 working successfully!")

@app.post("/faceshape/")
async def analyze_face_endpoint(file: UploadFile = File(...)):
    try:
        result = analyze_faceshape(
            image_file=resize_image(file.file),
            api_key=API_KEY,
            api_secret=API_SECRET
        )
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/recommend")
def get_hairstyles(user: UserProfile):
    return get_recommendations(face_shape=user.face_shape, age_group=user.age_group, gender=user.gender, hair_length=user.hair_length, hair_type=user.hair_type, occasion=user.occasion)
