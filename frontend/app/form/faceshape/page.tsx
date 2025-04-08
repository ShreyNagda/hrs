"use client";
import React, { useState } from "react";
import api from "../../axios";
import { toast } from "react-toastify";
import { useFormContext } from "@/app/context/FormContext";
import Link from "next/link";

export default function FaceShape() {
    const [file, setFile] = useState(null as File | null);
    const { updateData, goToNextStep } = useFormContext();
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
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
                setResult(face_shape_response.data);
                updateData({
                    selfie: file,
                    faceShapeResult: face_shape_response.data,
                });
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="bg-gradient-to-b from-indigo-900/70 to-black p-4 flex flex-col items-center justify-center min-h-svh text-white">
            <div className="md:text-2xl text-lg font-bold">Step 1 </div>
            <div className="text-xl md:text-4xl text-center font-bold">
                Determine Face Shape
            </div>
            <div className="my-3">
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
                        className="cursor-pointer border p-3 text-white rounded"
                    >
                        {file?.name ?? "Upload a file"}
                    </label>
                </div>
                {!result && (
                    <button
                        type="submit"
                        disabled={file === null}
                        className="bg-white text-black p-3 rounded-sm mt-2 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Determine Face Shape
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
                            <strong>Face Length:</strong>{" "}
                            {result.face_length_cm} cm
                        </div>
                        <div>
                            <strong>Cheekbone Width:</strong>{" "}
                            {result.cheekbone_width_cm} cm
                        </div>
                        <div>
                            <strong>Forehead Width:</strong>{" "}
                            {result.forehead_width_cm} cm
                        </div>
                        <div>
                            <strong>Jaw Width:</strong> {result.jaw_width_cm} cm
                        </div>
                    </div>

                    {result.confidence && (
                        <div className="mt-4">
                            <strong>Confidence Scores:</strong>
                            <ul className="list-disc list-inside text-sm mt-2">
                                {Object.entries(result.confidence).map(
                                    ([shape, score]) => (
                                        <li key={shape}>
                                            {shape}:{" "}
                                            {(score as number).toFixed(2)}%
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {result && <button onClick={goToNextStep}>Continue</button>}
        </div>
    );
}
