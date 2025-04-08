"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Hero() {
    return (
        <section className="min-h-svh flex items-center px-6 md:px-16 text-white p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center">
                {/* Left Text Section */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h1 className="md:text-lg font-bold leading-2 tracking-widest">
                        <span className="text-white">innov8ors</span>
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-pink-400">
                        StyleSync
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl">
                        AI-powered hairstyle recommendations tailored to your
                        unique features. Find your next look with confidence.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full font-semibold w-fit"
                    >
                        <Link href={"/form/faceshape"}>Get Your Hairstyle</Link>
                    </motion.div>
                </motion.div>

                {/* Right Visual Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative flex justify-center md:justify-end"
                >
                    <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem]">
                        {/* Glowing morphing blob */}
                        <div className="absolute inset-0 animate-blob bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 opacity-60 blur-2xl rounded-full z-0" />

                        {/* Floating glow layer */}
                        <div className="absolute inset-4 animate-float bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 rounded-full shadow-[0_0_60px_15px_rgba(168,85,247,0.4)] z-0" />

                        {/* Image inside the blob */}
                        <div className="absolute inset-8 z-10 rounded-full overflow-hidden animate-float">
                            <img
                                src="/hero.jpg" // Make sure this file is placed inside your Next.js `public` folder
                                alt="Hairstyle recommendation"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
