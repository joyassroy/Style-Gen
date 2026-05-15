import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        // ইউজার আগে থেকেই আছে কি না চেক করা
        const exists = await User.findOne({ email });
        if (exists) {
            return NextResponse.json({ message: "User already exists!" }, { status: 400 });
        }

        // পাসওয়ার্ড হাশ করা
        const hashedPassword = await bcrypt.hash(password, 10);

        // নতুন ইউজার তৈরি
        await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}