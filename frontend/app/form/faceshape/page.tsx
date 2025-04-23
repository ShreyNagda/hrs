"use client";
import React, { useState, useRef } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import { useFormContext } from "@/app/context/FormContext";

export default function FaceShape() {
    const [file, setFile] = useState(null as File | null);
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const { updateData, goToNextStep } = useFormContext();
    const [result, setResult] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setFile(null);
        setResult(null);
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 200 },
                    height: { ideal: 300 },
                    facingMode: "user"
                }
            });
            console.log('Got stream:', stream);
            
            if (!videoRef.current) {
                console.error('Video ref not found');
                return;
            }

            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            
            videoRef.current.onloadedmetadata = async () => {
                console.log('Video metadata loaded');
                try {
                    await videoRef.current?.play();
                    console.log('Video playing');
                    
                } catch (err) {
                    console.error('Error playing video:', err);
                }
            };
        } catch (err) {
            console.error('Camera error:', err);
            toast.error("Unable to access camera. Please check permissions.");
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && streamRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Mirror the image after drawing
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(canvas, -canvas.width, 0);
                ctx.restore();

                canvas.toBlob((blob) => {
                    if (blob) {
                        const newFile = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                        setFile(newFile);
                        stopCamera();
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };


    const clearPhoto = () => {
        setFile(null);
        setResult(null);
    };

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setLoading(true);
        if (!file) {
            toast.error("Please upload a file");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", file);
            const face_shape_response = await api.post("/faceshape", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (face_shape_response.data["error"]) {
                throw new Error("No Face Detected!");
            } else {
                setResult({
                    ...face_shape_response.data,
                    age: getAgeGroup(
                        face_shape_response.data["age"]
                    ).toLowerCase(),
                });
                updateData({
                    selfie: file,
                    faceShapeResult: face_shape_response.data,
                    age: getAgeGroup(
                        face_shape_response.data["age"]
                    ).toLowerCase(),
                    gender: face_shape_response.data["gender"],
                });
                console.log(face_shape_response.data);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || "Something went wrong");
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (result) {
            setResult(null);
        }
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const getAgeGroup = (age: number) => {
        if (age <= 20) {
            return "Teen";
        } else if (age > 20 && age <= 30) {
            return "Youth";
        } else if (age > 30 && age <= 45) {
            return "Adult";
        } else {
            return "Senior";
        }
    };

    return (
        <div className="bg-gradient-to-b from-indigo-900/70 to-black p-4 flex flex-col items-center justify-center min-h-svh text-white">
            <div className="text-2xl md:text-4xl text-center font-bold">
                Step 1: Determine Face Shape
            </div>
            <div className="my-3 text-center text-lg md:text-xl">
                Upload a straight face selfie or click one now
            </div>

            {/* Camera UI */}
            {showCamera && (
                <div className="relative w-[200px] mb-4 mx-auto"> {/* Fixed width */}
                    <div className="relative h-[300px] bg-black rounded-lg overflow-hidden"> {/* Fixed height */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            width={200}
                            height={300}
                            className="w-full h-full object-cover mirror-mode"
                            style={{ transform: 'scaleX(-1)' }}
                        />
                    </div>
                    <div className="flex justify-center gap-3 mt-3">
                        <button
                            onClick={capturePhoto}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Capture
                        </button>
                        <button
                            onClick={stopCamera}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex flex-col items-center gap-3">
                    {file && (
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                className="w-full max-w-[300px] rounded-md"
                                alt="Preview"
                            />
                            <div className="flex justify-center gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                >
                                    Retake
                                </button>
                                <button
                                    type="button"
                                    onClick={clearPhoto}
                                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {!file && !showCamera && (
                        <div className="flex gap-3 w-full justify-center">
                            <button
                                type="button"
                                onClick={startCamera}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Open Camera
                            </button>
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                            >
                                Upload Photo
                            </label>
                        </div>
                    )}
                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                </div>

                {file && !result && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-black p-3 rounded-md mt-4 w-full disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : "Determine Face Shape"}
                    </button>
                )}
            </form>

            {/* Show Result */}
            {result && (
                <div className="bg-white text-black rounded-xl shadow-md p-6 mt-6 w-full max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Face Shape Analysis
                    </h2>

                    <div className="space-y-2">
                        <div>
                            <strong>Detected Face Shape:</strong>{" "}
                            <span className="capitalize">
                                {result.face_shape}
                            </span>
                        </div>
                        <div>
                            <strong>Jawline:</strong> {result.jawline}
                        </div>
                        <div>
                            <strong>Age Group:</strong> {result.age}
                        </div>
                        <div>
                            <strong>Gender:</strong> {result.gender}
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <button
                    onClick={goToNextStep}
                    className="bg-white text-black px-5 py-2 mt-5 rounded-md"
                >
                    Continue
                </button>
            )}
        </div>
    );
}
