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

    # def classify_face_shape(jaw_width, cheekbone_width, forehead_width, face_height):
    #     jaw_to_cheek = jaw_width / cheekbone_width
    #     face_ratio = face_height / cheekbone_width

    #     if face_ratio > 1.5:
    #         if cheekbone_width > jaw_width:
    #             return 'Oval'
    #         else:
    #             return 'Oblong'
    #     elif abs(jaw_width - cheekbone_width) < 10 and abs(cheekbone_width - forehead_width) < 10:
    #         return 'Square'
    #     elif jaw_width > cheekbone_width and cheekbone_width < forehead_width:
    #         return 'Triangle'
    #     elif cheekbone_width > jaw_width and face_ratio < 1.4:
    #         return 'Round'
    #     elif forehead_width > cheekbone_width and cheekbone_width > jaw_width:
    #         return 'Heart'
    #     else:
    #         return 'Heart'

    # def classify_face_shape(jaw_width, cheekbone_width, forehead_width, face_height):
    #     face_ratio = face_height / cheekbone_width
    #     jaw_to_cheek = jaw_width / cheekbone_width
    #     forehead_to_jaw = forehead_width / jaw_width
    #     cheek_to_forehead = cheekbone_width / forehead_width

    #     scores = {
    #         'Oval': 0,
    #         'Oblong': 0,
    #         'Square': 0,
    #         'Round': 0,
    #         'Heart': 0,
    #         'Triangle': 0
    #     }

    #     # Oblong: very long face
    #     if face_ratio > 1.6:
    #         scores['Oblong'] += 2
    #     elif face_ratio > 1.5:
    #         scores['Oval'] += 2
    #     elif face_ratio < 1.3:
    #         scores['Round'] += 2

    #     # Square: all widths similar
    #     if abs(jaw_width - cheekbone_width) < 10 and abs(cheekbone_width - forehead_width) < 10:
    #         scores['Square'] += 2

    #     # Heart: forehead > cheekbone > jaw
    #     if forehead_width > cheekbone_width > jaw_width:
    #         scores['Heart'] += 2

    #     # Triangle: jaw > cheekbone and forehead
    #     if jaw_width > cheekbone_width and jaw_width > forehead_width:
    #         scores['Triangle'] += 2

    #     # Round: short face, wide cheekbones
    #     if face_ratio < 1.4 and cheekbone_width > jaw_width:
    #         scores['Round'] += 1

    #     # Oval: soft chin, cheekbones > jaw
    #     if cheekbone_width > jaw_width and face_ratio > 1.5:
    #         scores['Oval'] += 1

    #     # Square/Triangle edge case
    #     if abs(jaw_width - cheekbone_width) < 15 and jaw_width > forehead_width:
    #         scores['Square'] += 1

    #     # Return the shape with the highest score
    #     return max(scores, key=scores.get)
    def classify_face_shape(jaw_width, cheekbone_width, forehead_width, face_height):
        # Normalize facial features
        norm_jaw = jaw_width / face_height
        norm_cheek = cheekbone_width / face_height
        norm_forehead = forehead_width / face_height
        face_ratio = face_height / cheekbone_width  # Height-to-width ratio
        print("face ratio: ", face_ratio)
        print("jaw width: " , norm_jaw)
        print("cheek width: ", norm_cheek)
        print("forehead: ", norm_forehead)
        # Begin elimination logic
        # ------------------------------------------------------
        # Oblong: face is clearly longer than wide, and widths are nearly equal
        if face_ratio > 1.6 and norm_forehead > 0.5 and norm_cheek > 0.5:
            return "Oblong"

        # Oval: face is slightly longer than wide, jaw slightly narrower than forehead
        if face_ratio >= 1.3 and face_ratio <= 1.6 and norm_cheek > norm_forehead:
            return "Oval"

        # Round: face is short and widths are almost equal
        if face_ratio >= 1.1 and face_ratio <= 1.4 and abs(norm_cheek - norm_forehead) > 0 and abs(norm_cheek - norm_forehead) < 0.04:
            return "Round"

        # Square: short face like round, but with wider jaw and forehead
        if face_ratio < 1.3 and (abs(norm_jaw - norm_forehead) < 0.05 or abs(norm_jaw - norm_cheek) < 0.05):
            return "Square"

        # Heart: forehead > cheekbone > jaw, noticeable tapering down
        if norm_forehead > norm_cheek > norm_jaw and face_ratio >= 1.2:
            return "Heart"

        # Triangle: jaw > cheekbone > forehead, prominent lower face
        if norm_jaw >= norm_cheek >= norm_forehead:
            return "Triangle"

        # Fallback
        return "Heart"






    def determine_jaw_sharpness(landmarks):
        # Use left6, chin, right6 to get jaw angle
        angle = angle_between(landmarks['contour_left6'], landmarks['contour_chin'], landmarks['contour_right6'])
        return 'Sharp' if angle < 100 else 'Soft'

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
