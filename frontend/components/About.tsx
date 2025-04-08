"use client";

import { motion } from "framer-motion";
import {
    User,
    Scissors,
    Smile,
    Ruler,
    Briefcase,
    CalendarCheck,
} from "lucide-react";

export default function AboutSection() {
    return (
        <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-transparent to-[#0f172a] text-white rounded-sm">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto text-center"
            >
                <h2 className="text-4xl font-bold mb-6 tracking-tight">
                    About <span className="text-purple-400">StyleSync</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
                    <span className="text-white font-semibold">StyleSync</span>{" "}
                    is your AI-powered personal hairstyle advisor. It recommends
                    the most suitable hairstyles based on your unique features
                    and lifestyle.
                </p>

                {/* Info Grid */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="bg-[#1e293b] p-5 rounded-xl shadow-md hover:shadow-purple-700/30 transition duration-300"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <item.icon className="text-purple-400" />
                                <h3 className="text-lg font-semibold text-white">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-12 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium transition-all duration-300"
                >
                    Discover Your Look
                </motion.button>
            </motion.div>
        </section>
    );
}

const features = [
    {
        title: "Face Shape",
        desc: "Tailored styles for round, oval, heart, and square faces.",
        icon: Smile,
    },
    {
        title: "Hair Type",
        desc: "Curly, straight, or wavy? We’ve got styles that work for all.",
        icon: Scissors,
    },
    {
        title: "Hair Length",
        desc: "From pixie cuts to flowing locks, we match your ideal length.",
        icon: Ruler,
    },
    {
        title: "Age & Gender",
        desc: "Teen, adult, senior — each style is personalized for you.",
        icon: User,
    },
    {
        title: "Profession & Role",
        desc: "Student, creative, professional? We recommend accordingly.",
        icon: Briefcase,
    },
    {
        title: "Occasion Style",
        desc: "Adapt styles for weddings, interviews, parties, or everyday looks.",
        icon: CalendarCheck,
    },
];
