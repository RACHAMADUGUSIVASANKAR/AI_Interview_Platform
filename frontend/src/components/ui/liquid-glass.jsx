import React from 'react';
import { cn } from '../../lib/utils'; // Adjust path if needed

export const LiquidGlassCard = ({
    children,
    className,
    glowIntensity = 'md',
    shadowIntensity = 'md',
    blurIntensity = 'md',
    borderRadius = '16px',
    ...props
}) => {
    // Map intensities to actual CSS values
    const glowStyles = {
        sm: '0 0 10px rgba(255, 255, 255, 0.05)',
        md: '0 0 20px rgba(255, 255, 255, 0.1)',
        lg: '0 0 30px rgba(255, 255, 255, 0.15)',
    };

    const shadowStyles = {
        sm: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        md: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        lg: '0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    };

    const blurStyles = {
        sm: 'blur(10px)',
        md: 'blur(20px)',
        lg: 'blur(30px)',
    };

    const containerStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: blurStyles[blurIntensity],
        WebkitBackdropFilter: blurStyles[blurIntensity],
        borderRadius: borderRadius,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `${shadowStyles[shadowIntensity]}, ${glowStyles[glowIntensity]}`,
    };

    return (
        <div
            className={cn('relative overflow-hidden transition-all duration-300', className)}
            style={containerStyle}
            {...props}
        >
            {/* Optional: Add a subtle overlay gradient for more "liquid" feel */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
                }}
            />

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default LiquidGlassCard;
