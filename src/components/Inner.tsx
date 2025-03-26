import { motion, type Variants } from "framer-motion";
import type * as React from "react";
import Header from "./Header";
import { opacity, perspective, slide } from "./ui/anim";

const anim = (variants: Variants) => ({
  initial: "initial",
  animate: "enter",
  exit: "exit",
  variants,
})

export default function Inner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Background animation */}
      <motion.div className="fixed inset-0 bg-white z-10" {...anim(slide)} />

      {/* Content animation - now includes Header */}
      <motion.div className="relative z-1 bg-white " {...anim(perspective)}>
        <motion.div {...anim(opacity)}>
          {/* Header is now inside the animation wrapper */}
          <Header />

          {/* Page content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  )
}

