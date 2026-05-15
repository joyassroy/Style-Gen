interface TitleProps {
    children: React.ReactNode;
}

const Title = ({ children }: TitleProps) => {
    return (
        <h1 className="text-4xl font-bold text-center my-5">{children}</h1>
    )
}

export default Title