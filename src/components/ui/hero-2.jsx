import React from "react";
import { cn } from "@/lib/utils";

/**
 * Injects the CSS keyframes for the aurora animation.
 */
const AuroraAnimation = () => (
  <style>
    {`
      @keyframes aurora-1 {
        0% { transform: translate(0%, 0%) scale(1); }
        25% { transform: translate(25%, -15%) scale(1.15); }
        50% { transform: translate(-15%, 20%) scale(0.85); }
        75% { transform: translate(15%, -10%) scale(1.05); }
        100% { transform: translate(0%, 0%) scale(1); }
      }
      @keyframes aurora-2 {
        0% { transform: translate(0%, 0%) scale(1); }
        25% { transform: translate(-20%, 25%) scale(1.1); }
        50% { transform: translate(15%, -20%) scale(0.9); }
        75% { transform: translate(-10%, 15%) scale(1.15); }
        100% { transform: translate(0%, 0%) scale(1); }
      }
    `}
  </style>
);

export const AuroraHero = ({ children, className }) => {
  return (
    <div className="h-full w-full">
      <AuroraAnimation />
      <div
        className={cn(
          "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 antialiased",
          className
        )}
      >
        {/* The Aurora Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Main Aurora Blob 1 (Brand Blue Color) */}
          <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] animate-[aurora-1_25s_ease-in-out_infinite] rounded-full bg-[#004AAD]/15 opacity-60 blur-[100px] filter" />
          {/* Main Aurora Blob 2 (Accent Indigo Color) */}
          <div className="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] animate-[aurora-2_25s_ease-in-out_infinite] rounded-full bg-indigo-500/10 opacity-40 blur-[100px] filter" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    </div>
  );
};
