import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer"

const WebLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default WebLayout