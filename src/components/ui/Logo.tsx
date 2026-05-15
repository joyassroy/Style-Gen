import Link from "next/link"
import Image from "next/image"
const Logo = () => {
    return (
        <Link href="/">
            <Image src="/logo.png" alt="StyleGen Logo" width="150" height="70" />
        </Link>
    )
}

export default Logo