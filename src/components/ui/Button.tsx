import Link from "next/link";
import React from "react";

interface ButtonProps {
    link?: string;
    children: React.ReactNode;
    style?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ 
    link, 
    children, 
    style = "", 
    type = "button", 
    disabled = false,
    onClick 
}: ButtonProps) => {
    const baseStyle = `flex items-center justify-center bg-[#FF5A1F] hover:bg-[#e04d1a] py-2 px-4 text-white rounded-md transition-colors ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${style}`;

    // যদি link থাকে, তাহলে Next.js এর <Link> কাজ করবে
    if (link) {
        return (
            <Link href={link} className={baseStyle}>
                {children}
            </Link>
        );
    }

    // link না থাকলে সাধারণ <button> হিসেবে কাজ করবে
    return (
        <button 
            type={type}
            className={baseStyle}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;