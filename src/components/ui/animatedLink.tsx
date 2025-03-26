import { Link } from 'react-router-dom';

import { cn } from "../../lib/utils";

const AnimatedLink = ({
  href,
  children,
  className,
}: { href?: string; children: React.ReactNode; className?: string }) => {
  const Component = href ? Link : "button"

  return (
    <Component 
      to={href || "#"} 
      className={cn(
        "relative uppercase font-medium group inline-block", 
        className
      )}
    >
      {children}
      <span 
        className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff4d00] 
        transition-all duration-300 
        group-hover:left-0 group-hover:right-auto group-hover:w-full
        group-hover:origin-right"
      />
    </Component>
  )
}

export default AnimatedLink;