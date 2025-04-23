"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Hairstyle {
    name: string;
    description: string;
    type: string;
    url: string;
}


export default function RandomHairstyles() {
    const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);

    useEffect(() => {
        fetch("/hairstyles.json")
            .then((res) => res.json())
            .then((data: Hairstyle[]) => {
                const shuffled = data.sort(() => 0.5 - Math.random());
                setHairstyles(shuffled.slice(0, 4));
            });
    }, []);

    return (
        <section className="min-h-svh py-16 px-4 md:px-10 bg-gradient-to-b from-transparent to-pink-300/20 rounded-sm flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-pink-500 mb-10 text-center">
                Discover Styles You’ll Love
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {hairstyles.map((style, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="p-6 border border-pink-500 rounded-lg shadow-lg hover:bg-pink-950 transition-colors"
                    >
                        {/* <img
                            src={`/hairstyles/${formatFilename(style.name)}`}
                            alt={style.name}
                            className="h-40 object-cover rounded-md mb-4 border border-pink-500"
                        /> */}
                        <h3 className="text-xl font-semibold text-pink-400 capitalize mb-2">
                            {style.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                            {style.description}
                        </p>
                        <div className="text-xs uppercase tracking-widest text-pink-300 mb-4">
                            {style.type}
                        </div>
                        <a
                            href={style.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm text-pink-400 underline hover:text-pink-300 transition"
                        >
                            View Style
                        </a>
                    </motion.div>
                ))}
            </div>
            <div className="text-end py-4 w-full flex justify-end">
                <Link
                    href={"/explore"}
                    className="flex items-center justify-end bg-white text-black px-4 py-3 rounded-full"
                >
                    Show all <ChevronRight />
                </Link>
            </div>
        </section>
    );
}
