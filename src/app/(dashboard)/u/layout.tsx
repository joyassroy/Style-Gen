import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer"
import UserSidebar from "@/components/layouts/UserSidebar";

const UserDashboardLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <main className="w-full">
            <Header />
            <section className="w-6xl mx-auto flex gap-4">
                <div>
                    <UserSidebar />
                </div>
                {children}
            </section>
            <Footer />
        </main>
    )
}

export default UserDashboardLayout