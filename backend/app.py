### app.py

from fastapi import FastAPI
from routes import router

app = FastAPI(title="Hairstyle Recommendation API")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Welcome to the Hairstyle Recommendation API"}
