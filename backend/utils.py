### utils.py

import cv2
import numpy as np
import mediapipe as mp

# Initialize MediaPipe
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True)

def euclidean(p1, p2):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def slope(p1, p2):
    return (p2[1] - p1[1]) / (p2[0] - p1[0] + 1e-6)

# function with all the calculations
def analyze_face_shape_from_image(image):
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)

    if not results.multi_face_landmarks:
        return {"error": "No face detected."}

    ih, iw, _ = image.shape
    diagonal = np.sqrt(iw**2 + ih**2)
    PIXEL_TO_CM = 20 / diagonal  # Normalize to a 20cm diagonal reference size

    face_landmarks = results.multi_face_landmarks[0]

    indices = {
        'forehead': 10,
        'chin': 152,
        'left_jaw': 234,
        'right_jaw': 454,
        'left_cheek': 234,
        'right_cheek': 454,
        'left_forehead': 127,
        'right_forehead': 356
    }

    points = {}
    for name, idx in indices.items():
        landmark = face_landmarks.landmark[idx]
        x, y = int(landmark.x * iw), int(landmark.y * ih)
        points[name] = (x, y)

    face_length = euclidean(points['forehead'], points['chin'])
    jaw_width = euclidean(points['left_jaw'], points['right_jaw'])
    cheekbone_width = euclidean(points['left_cheek'], points['right_cheek'])
    forehead_width = euclidean(points['left_forehead'], points['right_forehead'])

    # Calculate jawline slope to determine sharpness
    left_slope = slope(points['chin'], points['left_cheek'])
    right_slope = slope(points['chin'], points['right_cheek'])
    avg_slope = (abs(left_slope) + abs(right_slope)) / 2

    jawline = "Sharp" if avg_slope > 1.3 else "Soft"

    scores = {
        "Round": 0,
        "Oblong": 0,
        "Heart": 0,
        "Oval": 0,
        "Square": 0,
        "Diamond": 0
    }

    # Length vs cheekbone width
    if face_length < cheekbone_width * 1.05:
        scores["Round"] += 1
    elif cheekbone_width * 1.05 <= face_length < cheekbone_width * 1.15:
        scores["Oval"] += 1
    elif cheekbone_width * 1.15 <= face_length <= cheekbone_width * 1.3:
        scores["Oval"] += 0.75
    elif cheekbone_width * 1.3 < face_length <= cheekbone_width * 1.45:
        scores["Oblong"] += 1
    elif face_length > cheekbone_width * 1.45:
        scores["Oblong"] += 1.25

    # Forehead vs jaw width
    if forehead_width >= jaw_width * 1.1:
        scores["Heart"] += 1
    elif forehead_width <= jaw_width * 0.9:
        scores["Square"] += 0.5
    elif abs(forehead_width - jaw_width) <= jaw_width * 0.1:
        scores["Round"] += 0.5
        scores["Oval"] += 0.5

    # Cheekbone prominence
    if cheekbone_width > forehead_width and cheekbone_width > jaw_width:
        scores["Diamond"] += 1

    # Jaw vs cheekbone width
    if jaw_width > cheekbone_width * 1.1:
        scores["Square"] += 0.5
    elif jaw_width < cheekbone_width * 0.9:
        scores["Heart"] += 0.5
    elif cheekbone_width * 0.95 <= jaw_width <= cheekbone_width * 1.05:
        scores["Round"] += 0.5

    # Modify scoring with jawline sharpness
    if jawline == "Sharp":
        scores["Round"] = 0
        scores["Oval"] -= 0.5
        scores["Square"] += 0.5
        scores["Diamond"] += 0.5
    else:
        scores["Round"] += 0.25

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_shape = sorted_scores[0][0] if sorted_scores[0][1] > 0 else "Uncertain"

    confidence = {
        shape: round(score / max(1, sum(scores.values())) * 100, 2)
        for shape, score in scores.items()
    }

    return {
        "face_shape": top_shape.lower(),
        "confidence": confidence,
        "face_length_cm": round(face_length * PIXEL_TO_CM, 2),
        "jaw_width_cm": round(jaw_width * PIXEL_TO_CM, 2),
        "cheekbone_width_cm": round(cheekbone_width * PIXEL_TO_CM, 2),
        "forehead_width_cm": round(forehead_width * PIXEL_TO_CM, 2),
        "jawline": jawline
    }

# main function called from routes
def analyze_face_shape(image_path):
    image = cv2.imread(image_path)
    return analyze_face_shape_from_image(image)


#Hairstyle recommendation
# utils.py

import joblib
import numpy as np

# Load the model and encoders only once
model = joblib.load("models/hairstyle_model.pkl")
le_dict = joblib.load("models/label_encoders.pkl")
def get_gender_compatible_style(predicted_style, gender, style_type, le_dict):
    import random
    # Decode style name
    style_name = le_dict[style_type].inverse_transform([predicted_style])[random.randint(0, 6)]

    # Define a mapping of styles per gender if available
    gendered_styles = {
        'male': ['crew cut', 'caesar cut', 'taper cut', 'flat top', 'faux hawk', 'slicked back undercut', 'man bun', 'wavy man bun'],
        'female': ['classic bob', 'pixie cut', 'messy layers', 'blunt bangs', 'curtain bangs', 'layered bob', 'braided updo', 'french braid']
    }

    if style_name.lower() not in [s.lower() for s in gendered_styles.get(gender.lower(), [])]:
        # Replace with a fallback compatible style
        fallback_style = gendered_styles[gender.lower()][Math.random(0)]
        return fallback_style
    return style_name


def predict_hairstyles(user_input, model_path='hairstyle_model.pkl', encoder_path='label_encoders.pkl'):

    # Define the same weights used during training
    weights = {
        'age group': 1,
        'gender': 3,
        'role': 1,
        'hair length': 1,
        'hair type': 1,
        'face shape': 2
    }

    # Encode and apply weights to user input
    input_encoded = []
    for feature in ['age group', 'gender', 'role', 'hair length', 'hair type', 'face shape']:
        le = le_dict[feature]
        val = user_input[feature]
        if val not in le.classes_:
            raise ValueError(f"Value '{val}' not recognized for feature '{feature}'.")
        encoded_val = le.transform([val])[0]

        # Apply the feature's weight
        weighted_val = encoded_val * weights[feature]
        input_encoded.append(weighted_val)

    # Predict using the model
    input_array = np.array(input_encoded).reshape(1, -1)
    classic_encoded, trendy_encoded = model.predict(input_array)[0]


    classic_name = get_gender_compatible_style(classic_encoded, user_input['gender'], 'classic', le_dict)
    trendy_name = get_gender_compatible_style(trendy_encoded, user_input['gender'], 'trendy', le_dict)


    return {
        'classic': classic_name,
        'trendy': trendy_name
    }
