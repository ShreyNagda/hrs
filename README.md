# 💇‍♂️ Haircut Recommendation System

The **Haircut Recommendation System** is an intelligent web-based platform that recommends the most suitable hairstyles for users based on their facial features, demographics, and hair preferences. By combining AI-powered face analysis with a curated dataset of hairstyles, this system helps users confidently explore looks tailored to their unique profile.

## 🌟 Features

- Upload or capture a selfie for automatic face shape detection
- Enter demographic details (name, age, gender, profession)
- Choose preferences like hair type and length
- Receive hairstyle recommendations based on facial analysis and user input
- Covers both classic and trendy styles with an India-specific focus

## 🧠 Machine Learning & Computer Vision

- **Face Shape Detection**:
  - Facial landmarks extracted using **MediaPipe Face Mesh**
  - Custom facial proportion logic calculates key ratios and jawline angles to determine face shape
  - Face shape categories include: Round, Oval, Square, Heart, and Diamond

- **Recommendation Engine**:
  - A rule-based filtering system combined with user demographics and hair preferences
  - Fetches relevant styles from the dataset based on compatibility scores

- **Modeling**:
  - CNN-based classifier (using TensorFlow/Keras) for face shape prediction (optional module)
  - Uses real-time image preprocessing for robust inference

## 🛠️ Tech Stack

### 🧑‍🎨 Frontend
- **Next.js** (App Router)
- **Tailwind CSS** for responsive design and styling
- **Context API** for managing multi-step form state

### 🧑‍🍳 Backend
- **FastAPI** for fast and scalable backend APIs
- **Python** for handling ML logic and image processing
- **Pillow** / **OpenCV** for image handling and preprocessing

## 🗃️ Dataset

- A **synthetic dataset** generated using AI tools
- Enhanced with **10 rows of real-world data** for baseline accuracy
- Dataset includes:
  - 60+ hairstyles (classic + trendy)
  - Metadata for each: gender, age group, hair length, hair type, face shape suitability, work suitability, and descriptions
  - Focus on Indian hair textures and face shapes

## 📈 Roadmap / Future Enhancements

- Integrate live AR preview for hairstyles
- Store user history and favorites
- Add hairstyle trends and seasonal recommendations
- Enable social sharing of recommendations

---

> ✂️ Making smart grooming decisions easier with the power of AI and personalization.
