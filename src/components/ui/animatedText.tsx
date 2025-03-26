// components/AnimatedText.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedText({
  phrases,
  accentWords = [],
  className,
  accentClassName,
}: {
  phrases: string[];
  accentWords?: string[]; // List of words or phrases to be accented
  className?: string;
  accentClassName?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Trigger animation once the component is mounted
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

  // Split phrases and identify accent words
  const processedPhrases = phrases.map((phrase) => {
    const parts = phrase.split(/(\s+)/).map((part) => {
      const isAccent = accentWords.some((accentWord) =>
        part.toLowerCase().includes(accentWord.toLowerCase())
      );
      return { text: part, isAccent };
    });
    return parts;
  });

  return (
    <div>
      {processedPhrases.map((phraseParts, index) => (
        <div key={index} className="lineMask overflow-hidden">
          <motion.p
            custom={index}
            variants={animation}
            initial="initial"
            animate={hasMounted ? "enter" : ""}
            className={className}
          >
            {phraseParts.map((part, partIndex) => (
              <span key={partIndex} className={part.isAccent ? accentClassName : ''}>
                {part.text}
              </span>
            ))}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
