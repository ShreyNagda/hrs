"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "@/app/context/FormContext";

export default function Demographics() {
    const { data, updateData, goToNextStep } = useFormContext();
    const [name, setName] = useState(data.name || "");
    const [profession, setProfession] = useState(data.profession || "");

    useEffect(() => {
        console.log(data);
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateData({ name, profession });
        goToNextStep();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-svh px-4 text-white">
            <div className="md:text-2xl text-lg font-bold mb-2">Step 2</div>
            <div className="text-xl md:text-4xl font-bold text-center mb-6">
                Demographics
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md flex flex-col gap-4"
            >
                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                {/* Profession */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Role</label>
                    <select
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                        required
                    >
                        <option value="">Select role</option>
                        <option value="student">Student</option>
                        <option value="creative">Creative</option>
                        <option value="professional">Professional</option>
                        <option value="others">Others</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-white text-black font-medium py-2 rounded mt-2"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
