import React from "react";

export default function Footer() {
    return (
        <footer className="flex gap-[24px] flex-wrap items-center justify-center p-8 md:p-20">
            <p className="text-lg">
                &copy; {new Date().getFullYear()} Innov8ors. All rights
                reserved.
            </p>
        </footer>
    );
}
