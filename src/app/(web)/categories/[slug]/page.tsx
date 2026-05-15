'use client'
import { useParams } from "next/navigation"

const CategoriesDetailsPage = () => {
    const { slug } = useParams()

    return (
        <div>
            {slug}
        </div>
    )
}

export default CategoriesDetailsPage