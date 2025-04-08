"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define the structure of the face shape API result
type FaceShapeResult = {
    face_shape: string;
    confidence: number;
    [key: string]: string | number; // Optional: if API response has more fields
};

// Define the complete form data structure
export type FormData = {
    selfie?: File | null;
    name?: string;
    age?: string;
    gender?: string;
    profession?: string;
    hairLength?: string;
    hairType?: string;
    faceShapeResult?: FaceShapeResult;
};

// Define the context type
type FormContextType = {
    data: FormData;
    updateData: (newData: Partial<FormData>) => void;
    goToNextStep: () => void;
};

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook to use the context
export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within FormProvider");
    }
    return context;
};

// Define your form steps
const steps = ["/form/demographics", "/form/preferences", "/recommendations"];

// Context Provider Component
export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<FormData>({ selfie: null });
    const router = useRouter();

    const updateData = (newData: Partial<FormData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const goToNextStep = () => {
        const currentStepIndex = steps.findIndex(
            (step) => step === window.location.pathname
        );
        if (currentStepIndex < steps.length - 1) {
            router.push(steps[currentStepIndex + 1]);
        }
    };

    return (
        <FormContext.Provider value={{ data, updateData, goToNextStep }}>
            {children}
        </FormContext.Provider>
    );
};
