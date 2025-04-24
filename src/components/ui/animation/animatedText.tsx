import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

export default function AnimatedText({
  phrases,
  accentWords = [],
  className = "",
  accentClassName = "text-accent",
}: {
  phrases: (string | ReactNode)[];
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

  // Process each phrase to create JSX elements with highlighted parts
  const processPhrase = (phrase: string | ReactNode): ReactNode => {
    // If phrase is already a ReactNode, return it directly
    if (typeof phrase !== 'string') {
      return phrase;
    }
    
    if (!accentWords || accentWords.length === 0 || !phrase) {
      return <span>{phrase}</span>;
    }

    // Sort accentWords by length (descending) to prioritize longer matches
    const sortedAccentWords = [...accentWords].filter(Boolean).sort((a, b) => b.length - a.length);
    
    if (sortedAccentWords.length === 0) {
      return <span>{phrase}</span>;
    }

    let remainingText = phrase;
    let index = 0;
    let result: ReactNode[] = [];

    // Keep processing until we've gone through the entire text
    while (remainingText.length > 0) {
      let matchFound = false;
      
      // Try to find any accent word in the remaining text
      for (const accentWord of sortedAccentWords) {
        const accentIndex = remainingText.indexOf(accentWord);
        
        if (accentIndex !== -1) {
          // Add text before the accent word
          if (accentIndex > 0) {
            result.push(
              <span key={`part-${index++}`}>
                {remainingText.substring(0, accentIndex)}
              </span>
            );
          }
          
          // Add the accent word with highlighting
          result.push(
            <span key={`accent-${index++}`} className={accentClassName}>
              {accentWord}
            </span>
          );
          
          // Update remaining text
          remainingText = remainingText.substring(accentIndex + accentWord.length);
          matchFound = true;
          break;
        }
      }
      
      // If no match was found, add the rest of the text and exit
      if (!matchFound) {
        result.push(<span key={`part-${index++}`}>{remainingText}</span>);
        break;
      }
    }
    
    return <>{result}</>;
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
            {processPhrase(phrase)}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
