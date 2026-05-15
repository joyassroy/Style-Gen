import Link from "next/link"
import Logo from "@/components/ui/Logo"
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <section className="max-w-6xl mx-auto py-12">
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <Logo />
                    <div>
                        <h2 className="uppercase font-semibold">QUICK LINKS</h2>
                        <ul>
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/products">Products</Link>
                            </li>
                            <li>
                                <Link href="/categories">Categories</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="uppercase font-semibold">contact us</h2>
                        <ul>
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/products">Products</Link>
                            </li>
                            <li>
                                <Link href="/categories">Categories</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="uppercase font-semibold">contact us</h2>
                        <div className="flex items-center gap-2"><p className="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-full">
                            <FaFacebook size={25} />
                        </p>
                            <p className="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-full">
                                <FaInstagram size={25} />
                            </p></div>
                    </div>
                </section>
            </section>
            <section className="bg-primary text-white py-4 text-center">
                © StyleGen {new Date().getFullYear()} All rights reserved
            </section>
        </footer>
    )
}
export default Footer;