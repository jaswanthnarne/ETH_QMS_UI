'use client'

import React from "react"

interface TextProps {
  label: string
  reverse?: boolean
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center"
  className?: string
  onClick?: () => void
}

export function LetterSwapForward({
  label,
  reverse = true,
  staggerDuration = 0.02,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const letters = label.split("");
  const len = letters.length;
  const mid = Math.floor(len / 2);

  return (
    <span
      className={`group/swap inline-flex items-center relative overflow-hidden select-none cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {letters.map((letter: string, i: number) => {
        // Calculate stagger delay mathematically based on staggerFrom direction
        let delayFactor = i;
        if (staggerFrom === "last") {
          delayFactor = len - 1 - i;
        } else if (staggerFrom === "center") {
          delayFactor = Math.abs(mid - i);
        }
        
        const delayMs = delayFactor * staggerDuration * 1000;

        return (
          <span 
            className="relative flex overflow-hidden leading-none h-[1.1em] pointer-events-none" 
            key={i}
          >
            {/* Primary Letter */}
            <span
              className={`relative block transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                reverse 
                  ? "group-hover/swap:translate-y-full" 
                  : "group-hover/swap:-translate-y-full"
              }`}
              style={{
                transitionDelay: `${delayMs}ms`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
            {/* Secondary Duplicate Letter */}
            <span
              className={`absolute top-0 left-0 w-full block transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                reverse 
                  ? "-translate-y-full group-hover/swap:translate-y-0" 
                  : "translate-y-full group-hover/swap:translate-y-0"
              }`}
              style={{
                transitionDelay: `${delayMs}ms`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function LetterSwapPingPong({
  label,
  reverse = true,
  staggerDuration = 0.02,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  return (
    <LetterSwapForward
      label={label}
      reverse={reverse}
      staggerDuration={staggerDuration}
      staggerFrom={staggerFrom}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
}
