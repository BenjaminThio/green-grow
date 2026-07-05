import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function GlassCard({ children, className = '', ...rest }: GlassCardProps) {
    return (
        <div className={`glass-card rounded-3xl ${className}`} {...rest}>
            {children}
        </div>
    );
}
