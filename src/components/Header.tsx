import { Fragment, useState } from 'react';
import { mainLinks, userLinks } from '../data/navigationLinks';
import AnimatedLink from './ui/animation/animatedLink';
import Clock from './ui/clock';
import Menu from './ui/Menu';

export default function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  return (
    <>
      <Menu/>
      <header className="w-full h-full pt-6 pb-4 bg-white z-10">
        <div className="border-b-2 border-black mx-8">
          <div className="px-2 md:px-4 py-4 items-stretch justify-items-stretch">
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-6 md:gap-[100px] text-md">
              {/* First Column */}
              <div className="space-y-1">
                <p className="text-muted font-medium">App</p>
                <AnimatedLink className="font-bold" href="/">FINANCE TRACKER</AnimatedLink>
                <p className="text-muted"><Clock /></p>
              </div>

              {/* Second Column */}
              <div className="space-y-1">
                <p className="text-muted font-medium">Status</p>
                <p className="uppercase font-semibold">New generated paycheck Currently available for viewing</p>
              </div>

              {/* Desktop Navigation - Hidden on Mobile */}
              <div className="hidden lg:block space-y-1">
                <p className="text-muted font-medium">Sitemap</p>
                <div className="flex flex-wrap gap-2">
                  {mainLinks.map((link, index) => (
                    <Fragment key={link.href}>
                      <AnimatedLink href={link.href}>{link.title}</AnimatedLink>
                      {index < mainLinks.length - 1 && <span>,</span>}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* Desktop User Links - Hidden on Mobile */}
              <div className="hidden lg:block space-y-1">
                <p className="text-muted font-medium">User</p>
                <div className="flex flex-wrap gap-2">
                  {userLinks.map((link, index) => (
                    <Fragment key={link.href}>
                      <AnimatedLink href={link.href}>{link.title}</AnimatedLink>
                      {index < userLinks.length - 1 && <span>,</span>}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
