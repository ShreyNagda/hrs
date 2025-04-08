"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "@/app/context/FormContext";
import api from "@/app/axios";
import { toast } from "react-toastify";
// import hairstyles from "/hairstyles.json";

type Hairstyle = {
    index: number;
    name: string;
    description: string;
    type: "Classic" | "Trendy";
    url: string;
};

export default function Recommendations() {
    const { data } = useFormContext();
    const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);

    useEffect(() => {
        fetch("/hairstyles.json")
            .then((res) => res.json())
            .then((data) => {
                setHairstyles(data);
            });
    }, []);
    useEffect(() => {
        if (!data.selfie) {
            window.location.pathname = "/form/faceshape";
        }
    }, [data]);

    const [results, setResults] = useState<{
        classic: Hairstyle | null;
        trendy: Hairstyle | null;
    }>({ classic: null, trendy: null });

    const handleGetRecommendations = async () => {
        const payload = {
            age_group: data.age,
            gender: data.gender,
            role: data.profession,
            hair_length: data.hairLength,
            hair_type: data.hairType,
            face_shape: data.faceShapeResult?.face_shape,
        };

        for (const [key, value] of Object.entries(payload)) {
            if (!value) {
                toast.error(`Missing value for ${key}`);
                return;
            }
        }

        try {
            const res = await api.post("/hairstyle", payload);
            const {
                recommended_classic_hairstyle,
                recommended_trendy_hairstyle,
            } = res.data;

            // Find matching hairstyles from the JSON
            const classic = hairstyles.find(
                (style) =>
                    style.name.toLowerCase() ===
                    recommended_classic_hairstyle.toLowerCase()
            );
            const trendy = hairstyles.find(
                (style) =>
                    style.name.toLowerCase() ===
                    recommended_trendy_hairstyle.toLowerCase()
            );

            setResults({ classic: classic ?? null, trendy: trendy ?? null });
        } catch (error: any) {
            console.error(error);
            toast.error(
                error?.response?.data?.detail ??
                    "Something went wrong while fetching recommendations!"
            );
        }
    };

    const Card = ({ hairstyle }: { hairstyle: Hairstyle }) => {
        console.log(hairstyle);
        return (
            <div className="bg-white text-black p-4 rounded-xl shadow-md w-full md:w-80">
                <img src={hairstyle.name.toLowerCase() + ".jpeg"} />
                <h3 className="text-xl font-bold mb-2">{hairstyle.name}</h3>
                <p className="text-sm mb-2">{hairstyle.description}</p>
                <a
                    href={hairstyle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                >
                    View Examples
                </a>
            </div>
        );
    };

    return (
        <div className="min-h-svh p-8 flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">
                Hairstyle Recommendations
            </h1>

            <button
                onClick={handleGetRecommendations}
                className="bg-white text-black px-6 py-2 rounded shadow font-semibold"
            >
                Get Recommendations
            </button>

            {results && (
                <div className="mt-8 bg-white/10 border border-white/20 rounded p-6 w-full max-w-md text-center">
                    <h2 className="text-xl font-bold mb-3">
                        Your Recommended Hairstyles
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6 mt-10 items-center">
                        {results.classic && (
                            <Card hairstyle={results.classic} />
                        )}
                        {results.trendy && <Card hairstyle={results.trendy} />}
                    </div>
                </div>
            )}
        </div>
    );
}
