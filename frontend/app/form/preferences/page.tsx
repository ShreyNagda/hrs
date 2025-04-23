"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "@/app/context/FormContext";

export default function Preferences() {
    const { data, updateData, goToNextStep } = useFormContext();

    const [hairLength, setHairLength] = useState(data.hairLength || "");
    const [hairType, setHairType] = useState(data.hairType || "");
    useEffect(() => {
        console.log(data);
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hairLength !== "" && hairType !== "")
            updateData({ hairLength, hairType });
        goToNextStep();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-svh px-4 text-white">
            <div className="md:text-2xl text-lg font-bold mb-2">Step 3</div>
            <div className="text-xl md:text-4xl font-bold text-center mb-6">
                Hair Preferences
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex flex-col gap-4"
            >
                {/* Hair Length */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Hair Length</label>
                    <select
                        value={hairLength}
                        onChange={(e) => setHairLength(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                    >
                        <option value="">Select hair length</option>
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select>
                </div>

                {/* Hair Type */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Hair Type</label>
                    <select
                        value={hairType}
                        onChange={(e) => setHairType(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                    >
                        <option value="">Select hair type</option>
                        <option value="straight">Straight</option>
                        <option value="wavy">Wavy</option>
                        <option value="curly">Curly</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-white text-black font-medium py-2 rounded mt-2"
                >
                    Get Recommendations
                </button>
            </form>
        </div>
    );
}
