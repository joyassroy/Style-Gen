'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const VerifyUser = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // @ts-ignore
            const role = session.user.role;
            
            if (role === 'admin') {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/u/dashboard";
            }
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifying Identity...</p>
            </div>
        </div>
    );
};

export default VerifyUser;