// components/ui/gradient-card.jsx

import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50",
        gray: "bg-gradient-to-br from-slate-100 to-slate-200/50",
        purple: "bg-gradient-to-br from-purple-100 to-indigo-200/50",
        green: "bg-gradient-to-br from-emerald-100 to-teal-200/50",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

const GradientCard = React.forwardRef(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, ...props }, ref) => {
    
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.03, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.1, rotate: 3 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className, "p-6 sm:p-8")}
          {...props}
        >
          {/* Subtle background image cover instead of a cutout */}
          <motion.img
            src={imageUrl}
            alt={`${title} background`}
            variants={{
              rest: { scale: 1, opacity: 0.15 },
              hover: { scale: 1.05, opacity: 0.25 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay pointer-events-none"
          />

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full relative">
            {/* Badge */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-background/50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-foreground/80 backdrop-blur-md w-fit shadow-sm">
              <span 
                className="h-1.5 w-1.5 rounded-full" 
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-[1.15rem] font-bold text-foreground mb-1.5">{title}</h3>
              <p className="text-foreground/70 text-[13px] leading-relaxed">{description}</p>
            </div>
            
            {/* Call to Action Link */}
            <a
              href={ctaHref}
              className="group mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground"
            >
              {ctaText}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
