import { Link } from 'react-router-dom';

import { cn } from "../../../lib/utils";

interface AnimatedLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const AnimatedLink = ({
  href,
  children,
  className,
  onClick,
}: AnimatedLinkProps) => {
  const Component = href ? Link : "button"

  return (
    <Component 
      to={href || "#"} 
      onClick={onClick}
      className={cn(
        "relative uppercase font-semibold group inline-block", 
        className
      )}
    >
      {children}
      <span 
        className="absolute bottom-0 right-0 w-0 h-0.5 bg-accent 
        transition-all duration-300 
        group-hover:left-0 group-hover:right-auto group-hover:w-full
        group-hover:origin-right"
      />
    </Component>
  )
}

export default AnimatedLink;