import Image from "next/image"
import Title from "@/components/ui/Title"
import categories from "@/data/categories"
import Link from "next/link"



const CategoriesPage = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <Title>All Categories</Title>
            <section className="max-w-6xl mx-auto my-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {
                        categories.map((category) => (
                            <Link href={`/categories/${category.slug}`} key={category.slug}>
                                <Image width={500} height={500} alt={category.name} src={category.image} />
                                <p className="relative bottom-8 text-white font-bold text-xl left-2">{category.name}</p>
                            </Link>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default CategoriesPage