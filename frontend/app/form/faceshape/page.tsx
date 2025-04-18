"use client";
import React, { useState } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import { useFormContext } from "@/app/context/FormContext";

export default function FaceShape() {
    const [file, setFile] = useState(null as File | null);
    const [loading, setLoading] = useState(false);
    const { updateData, goToNextStep } = useFormContext();
    const [result, setResult] = useState<any>(null);

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
            return "Teen ( < 20)";
        } else if (age > 20 && age <= 30) {
            return "Youth ( 20 - 30 )";
        } else if (age > 30 && age <= 45) {
            return "Adult ( 30 - 45 )";
        } else {
            return "Senior ( > 45 )";
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

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-3">
                    {file && (
                        <div>
                            <img
                                src={URL.createObjectURL(file)}
                                className="w-32 rounded-md"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer border p-3 text-white rounded w-full md:w-[300px] text-center"
                    >
                        {file?.name ?? "Upload a file"}
                    </label>
                </div>
                {!result && (
                    <button
                        type="submit"
                        disabled={file === null || result !== null}
                        className="bg-white text-black p-3 rounded-sm mt-2 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer w-full md:w-[300px]"
                    >
                        {!loading ? "Determine Face Shape" : "Loading"}
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
