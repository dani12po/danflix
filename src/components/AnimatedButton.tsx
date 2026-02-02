'use client';

import { motion } from 'framer-motion';
import { forwardRef, useRef, useState } from 'react';

interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  ripple?: boolean;
  onClick?: (event: any) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ripple = true, onClick, disabled, type = 'button', ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

    const createRipple = (event: any) => {
      if (!ripple || !buttonRef.current) return;

      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size
      };

      setRipples((prev: any[]) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev: any[]) => prev.filter((r: any) => r.id !== newRipple.id));
      }, 600);
    };

    const handleClick = (event: any) => {
      createRipple(event);
      onClick?.(event);
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'btn-primary';
        case 'secondary':
          return 'btn-secondary';
        case 'ghost':
          return 'btn-ghost';
        default:
          return 'btn-primary';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'px-4 py-2 text-sm';
        case 'lg':
          return 'px-8 py-4 text-lg';
        default:
          return 'px-6 py-3 text-base';
      }
    };

    return (
      <motion.button
        ref={buttonRef}
        className={`${getVariantClasses()} ${getSizeClasses()} ${className} relative overflow-hidden`}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={handleClick}
        disabled={disabled}
        type={type}
        {...props}
      >
        {ripples.map((ripple: any) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
