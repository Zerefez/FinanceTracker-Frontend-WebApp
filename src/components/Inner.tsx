import { motion, type Variants } from "framer-motion";
import type * as React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { opacity, perspective, slide } from "./ui/animation/anim";

const anim = (variants: Variants) => ({
  initial: "initial",
  animate: "enter",
  exit: "exit",
  variants,
})

interface InnerProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function Inner({ children, showHeader = true }: InnerProps) {
  const location = useLocation();
  
  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Background animation */}
      <motion.div className="fixed inset-0 bg-white z-10" {...anim(slide)} />

      {/* Content animation - conditionally includes Header */}
      <motion.div className="relative z-1 bg-white " {...anim(perspective)}>
        <motion.div {...anim(opacity)}>
          {/* Header is now conditionally rendered */}
          {showHeader && <Header />}

          {/* Page content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  )
}

