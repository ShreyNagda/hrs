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
    const [results, setResults] = useState<[{}] | null>(null);
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

    const handleGetRecommendations = async () => {
        const payload = {
            age_group: data.age?.toLowerCase(),
            gender: data.gender?.toLowerCase(),
            role: data.profession,
            hair_length: data.hairLength,
            hair_type: data.hairType,
            face_shape: data.faceShapeResult?.face_shape.toLowerCase(),
        };

        for (const [key, value] of Object.entries(payload)) {
            if (key !== "hair_length" && key !== "hair_type" && !value) {
                toast.error(`Missing value for ${key}`);
                return;
            }
        }

        try {
            const res = await api.post("/recommend", payload);
            setResults(res.data);
        } catch (error: any) {
            console.error(error);
            toast.error(
                error?.response?.data?.detail ??
                    "Something went wrong while fetching recommendations!"
            );
        }
    };

    const Card = ({ hairstyle }: { hairstyle: any }) => {
        let query = encodeURIComponent(`${hairstyle.name} indian hairstyle`);
        let url = `https://www.google.com/search?tbm=isch&q=${query}`;
        return (
            <div className="bg-white text-black p-4 rounded-xl shadow-md w-full md:w-80">
                {/* <img src={hairstyle.name.toLowerCase() + ".jpeg"} /> */}
                <h3 className="text-xl font-bold mb-2">{hairstyle.name}</h3>
                <p className="text-sm mb-2">{hairstyle.desc}</p>
                <a
                    href={url}
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
                <div className="mt-8 bg-white/10 border border-white/20 rounded p-6 w-full max-w-md md:max-w-2xl text-center">
                    <h2 className="text-xl font-bold mb-3">
                        Your Recommended Hairstyles
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6 mt-10 items-center">
                        {results.map((rs) => (
                            <Card hairstyle={rs} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
