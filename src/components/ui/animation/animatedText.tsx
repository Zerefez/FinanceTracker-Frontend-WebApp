import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedText({
  phrases,
  accentWords = [],
  className = "",
  accentClassName = "text-accent",
}: {
  phrases: string[];
  accentWords?: string[];
  className?: string;
  accentClassName?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const animation = {
    initial: { y: "100%" },
    enter: (i: number) => ({
      y: "0",
      transition: {
        duration: 0.75,
        ease: [0.33, 1, 0.68, 1],
        delay: 0.075 * i,
      },
    }),
  };

  return (
    <div>
      {phrases.map((phrase, index) => (
        <div key={index} className="overflow-hidden">
          <motion.p
            custom={index}
            variants={animation}
            initial="initial"
            animate={hasMounted ? "enter" : ""}
            className={className}
          >
            {phrase.split(" ").map((word, wordIndex) => (
              <span
                key={wordIndex}
                className={accentWords.includes(word) ? accentClassName : ""}
              >
                {word}{" "}
              </span>
            ))}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
