import React, { ReactNode } from 'react';

interface TitleProps {
    children: ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
    return (
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            {children}
        </h1>
    )
};

export default Title;
