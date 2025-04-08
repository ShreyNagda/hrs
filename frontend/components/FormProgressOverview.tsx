"use client";

import { useFormContext } from "@/app/context/FormContext";
import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";

const steps = [
    { label: "Face Shape", path: "/form/faceshape", key: "faceshape" },
    {
        label: "User Demographics",
        path: "/form/demographics",
        keys: ["name", "age", "gender", "profession"],
    },
    {
        label: "Preferences",
        path: "/form/preferences",
        keys: ["hairLength", "hairType"],
    },
];

export default function FormProgressOverview() {
    const { data } = useFormContext();

    const isStepComplete = (step: (typeof steps)[0]) => {
        if (typeof step.key === "string") {
            return Boolean(data[step.key]);
        } else if (Array.isArray(step.keys)) {
            return step.keys.every((key) => data[key as keyof typeof data]);
        }
        return false;
    };

    const renderStepSummary = (step: (typeof steps)[0]) => {
        if (step.label === "Selfie") {
            return data.selfie ? (
                <p className="text-sm text-gray-300">✅ Selfie uploaded</p>
            ) : null;
        }

        if (Array.isArray(step.keys)) {
            const filled = step.keys
                .map((key) => {
                    const value = data[key as keyof typeof data];
                    return value ? (
                        <span key={key} className="text-sm text-gray-300">
                            {key}: <span className="text-white">{value}</span>
                        </span>
                    ) : null;
                })
                .filter(Boolean);

            return <div className="flex flex-col gap-1 mt-1">{filled}</div>;
        }

        return null;
    };

    return (
        <div className="p-6 text-white bg-gradient-to-b from-blue-900 to-black min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>

            <div className="flex flex-col space-y-6">
                {steps.map((step, index) => {
                    const complete = isStepComplete(step);
                    return (
                        <Link key={step.label} href={step.path}>
                            <div className="group cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    {complete ? (
                                        <CheckCircleIcon className="h-6 w-6 text-pink-500 transition-colors group-hover:text-pink-400" />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full bg-white group-hover:bg-pink-400 transition-colors" />
                                    )}
                                    <span className="text-lg group-hover:text-pink-400 transition-colors">
                                        Step {index + 1}: {step.label}
                                    </span>
                                </div>
                                {complete && renderStepSummary(step)}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
