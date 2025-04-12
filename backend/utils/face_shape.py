def analyze_faceshape(image_file, api_key, api_secret):
    import requests
    import math

    def euclidean(p1, p2):
        return math.sqrt((p1['x'] - p2['x'])**2 + (p1['y'] - p2['y'])**2)

    def angle_between(p1, p2, p3):
        # returns angle at p2 in degrees
        a = euclidean(p2, p3)
        b = euclidean(p1, p3)
        c = euclidean(p1, p2)
        angle_rad = math.acos((c**2 + a**2 - b**2) / (2 * c * a))
        return math.degrees(angle_rad)

    def classify_face_shape(jaw_width, cheekbone_width, forehead_width, face_height):
        jaw_to_cheek = jaw_width / cheekbone_width
        face_ratio = face_height / cheekbone_width

        if face_ratio > 1.5:
            if cheekbone_width > jaw_width:
                return 'Oval'
            else:
                return 'Oblong'
        elif abs(jaw_width - cheekbone_width) < 10 and abs(cheekbone_width - forehead_width) < 10:
            return 'Square'
        elif jaw_width > cheekbone_width and cheekbone_width < forehead_width:
            return 'Triangle'
        elif cheekbone_width > jaw_width and face_ratio < 1.4:
            return 'Round'
        elif forehead_width > cheekbone_width and cheekbone_width > jaw_width:
            return 'Heart'
        else:
            return 'Heart'

    def determine_jaw_sharpness(landmarks):
        # Use left6, chin, right6 to get jaw angle
        angle = angle_between(landmarks['contour_left6'], landmarks['contour_chin'], landmarks['contour_right6'])
        return 'Sharp' if angle < 130 else 'Soft'

    try:
        detect_url = 'https://api-us.faceplusplus.com/facepp/v3/detect'
        detect_res = requests.post(
            detect_url,
            data={
                'api_key': api_key,
                'api_secret': api_secret,
                'return_landmark': 1,
                'return_attributes': 'gender,age'
            },
            files={'image_file': image_file}
        ).json()

        if not detect_res.get('faces'):
            return {"error": "No face detected"}

        face = detect_res['faces'][0]
        attr = face['attributes']
        landmarks = face['landmark']

        # Measurements
        jaw_width = euclidean(landmarks['contour_left1'], landmarks['contour_right1'])
        cheekbone_width = euclidean(landmarks['contour_left5'], landmarks['contour_right5'])
        forehead_width = euclidean(landmarks['left_eyebrow_left_corner'], landmarks['right_eyebrow_right_corner'])
        face_height = euclidean(landmarks['contour_chin'], landmarks['left_eyebrow_upper_middle'])

        face_shape = classify_face_shape(jaw_width, cheekbone_width, forehead_width, face_height)
        jaw_sharpness = determine_jaw_sharpness(landmarks)

        return {
            "age": attr['age']['value'],
            "gender": attr['gender']['value'],
            "face_shape": face_shape,
            "jawline": jaw_sharpness
        }

    except Exception as e:
        return {"error": str(e)}
