"use client";

import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

type Hairstyle = {
    index: number;
    name: string;
    description: string;
    type: "Classic" | "Trendy";
    work_suitability: string;
    url: string;
};

function formatFilename(name: string) {
    return name.toLowerCase() + ".jpeg";
}

export default function HairstyleExplorer() {
    const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
    const [filtered, setFiltered] = useState<Hairstyle[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"all" | "formal" | "casual" | "festive">(
        "all"
    );

    useEffect(() => {
        fetch("/hairstyles.json")
            .then((res) => res.json())
            .then((data) => {
                setHairstyles(data);
                setFiltered(data);
            });
    }, []);

    useEffect(() => {
        const query = search.toLowerCase();
        const results = hairstyles.filter((style) => {
            const matchesSearch = style.name.toLowerCase().includes(query);
            const matchesType =
                filterType === "all" || style.work_suitability.includes(filterType);
            return matchesSearch && matchesType;
        });

        setFiltered(results);
    }, [search, filterType, hairstyles]);

    return (
        <section className="min-h-screen bg-gradient-to-b from-blue-900 to-black/80 bg-fixed text-white px-4 py-20 md:px-10">
            <div className="flex items-center mb-8 gap-2">
                <Link
                    href="/"
                    className="bg-white text-black h-full p-3 rounded-full"
                >
                    <ChevronLeft />
                </Link>
                <h1 className="text-4xl font-bold">Explore Hairstyles</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 bg-black border border-white rounded text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-2 border border-white rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <option value="all">All Types</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="festive">Festive</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((style, index) => (
                    <div
                        key={index}
                        className="p-5 rounded-lg bg-black/50 hover:bg-black transition"
                    >
                        {/* <img
                            src={`/hairstyles/${formatFilename(style.name)}`}
                            alt={style.name}
                            className="w-48 h-48 object-cover object-center rounded mb-4 border border-white"
                        /> */}
                        <h2 className="text-xl font-semibold capitalize">
                            {style.name}
                        </h2>
                        <p className="text-sm text-gray-300 mb-2">
                            {style.description}
                        </p>
                        <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                            {style.type}
                        </div>
                        <a
                            href={style.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline hover:text-gray-300"
                        >
                            View on Google
                        </a>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-gray-400 mt-10">
                    No matching hairstyles found.
                </p>
            )}
        </section>
    );
}
