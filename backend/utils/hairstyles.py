import numpy as np
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Load hairstyle dataset
def load_hairstyles(path="data/hairstyles.json"):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Vectorize hairstyle features
def vectorize_hairstyles(data):
    feature_dicts = []
    for h in data:
        f = {}
        for shape in h['face_shapes']:
            f[f'face_shape_{shape}'] = 1
        for age in h['age_groups']:
            f[f'age_{age}'] = 1
        f[f'gender_{h["gender"]}'] = 1
        f[f'hair_length_{h["hair_length"]}'] = 1
        for ht in h['hair_type']:
            f[f'hair_type_{ht}'] = 1
        for occ in h.get('work_suitability', []):
            f[f'occasion_{occ}'] = 1
        feature_dicts.append(f)
    vectorizer = DictVectorizer(sparse=False)
    vectors = vectorizer.fit_transform(feature_dicts)
    return vectorizer, np.array(vectors)

# Load data and vectorize once
hairstyles = load_hairstyles()
vectorizer, hairstyle_vectors = vectorize_hairstyles(hairstyles)

# Create user vector
def create_user_vector(face_shape, age_group, gender, hair_length=None, hair_type=None, occasion=None):
    user_dict = {
        f'face_shape_{face_shape}': 1,
        f'age_{age_group}': 1,
        f'gender_{gender}': 1
    }
    if hair_length:
        user_dict[f'hair_length_{hair_length}'] = 1
    if hair_type:
        user_dict[f'hair_type_{hair_type}'] = 1
    if occasion:
        user_dict[f'occasion_{occasion}'] = 1
    return vectorizer.transform([user_dict])

# Recommend hairstyles
def recommend_hairstyles(user_vector, top_n=3):
    scores = cosine_similarity(user_vector, hairstyle_vectors)[0]
    print(scores)
    ranked = sorted(zip(hairstyles, scores), key=lambda x: x[1], reverse=True)
    return [
        {"name": r["name"], "score": round(s, 2), "desc": r.get("description")}
        for r, s in ranked[:top_n]
    ]

# Main recommendation function
def get_recommendations(face_shape, age_group, gender, hair_length=None, hair_type=None, occasion=None, top_n=3):
    user_vector = create_user_vector(
        face_shape,
        age_group,
        gender,
        hair_length,
        hair_type,
        occasion
    )
    return recommend_hairstyles(user_vector, top_n=top_n)
