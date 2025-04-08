"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "@/app/context/FormContext";

export default function Demographics() {
    const { data, updateData, goToNextStep } = useFormContext();
    const [name, setName] = useState(data.name || "");
    const [age, setAge] = useState(data.age || "");
    const [gender, setGender] = useState(data.gender || "");
    const [profession, setProfession] = useState(data.profession || "");

    useEffect(() => {
        console.log(data);
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !age || !gender || !profession) {
            alert("Please fill in all fields");
            return;
        }

        updateData({ name, age, gender, profession });
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

                {/* Age */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Age Group</label>
                    <select
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                        required
                    >
                        <option value="">Select age group</option>
                        <option value="teens">Teens</option>
                        <option value="youth">Youth</option>
                        <option value="adults">Adult</option>
                        <option value="seniors">Senior</option>
                    </select>
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Gender</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                value="male"
                                checked={gender === "male"}
                                onChange={() => setGender("male")}
                                required
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                value="female"
                                checked={gender === "female"}
                                onChange={() => setGender("female")}
                                required
                            />
                            Female
                        </label>
                    </div>
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
