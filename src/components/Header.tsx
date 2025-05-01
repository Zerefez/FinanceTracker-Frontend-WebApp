import { Fragment } from 'react';
import { loginLink, mainLinks, userLinks } from '../data/navigationLinks';
import { useAuth, useLocalization, useMenu, useNavigation } from '../lib/hooks';
import AnimatedLink from './ui/animation/animatedLink';
import Clock from './ui/clock';
import LanguageSwitcher from './ui/LanguageSwitcher';
import Menu from './ui/Menu';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { isMenuActive, toggleMenu } = useMenu();
  const { handleLogout } = useNavigation();
  const { t } = useLocalization();

  return (
    <>
      <Menu/>
      <header className="w-full h-full pt-6 pb-4 bg-white z-40 relative">
        <div className="border-b-2 border-black mx-8">
          <div className="px-2 md:px-4 py-4 items-stretch justify-items-stretch">
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-6 md:gap-[100px] text-md">
              {/* First Column */}
              <div className="space-y-1">
                <p className="text-muted font-medium">App</p>
                <AnimatedLink className="font-bold" href="/">{t('app.title')}</AnimatedLink>
                <p className="text-muted"><Clock /></p>
              </div>

              {/* Second Column */}
              <div className="space-y-1">
                <p className="text-muted font-medium">{t('status.title')}</p>
                <p className="uppercase font-semibold">{t('status.paycheck')}</p>
              </div>

              {/* Desktop Navigation - Hidden on Mobile */}
              <div className="hidden lg:block space-y-1">
                <p className="text-muted font-medium">{t('navigation.sitemap')}</p>
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
                <div className="flex justify-between items-center">
                  <p className="text-muted font-medium">{t('navigation.user')}</p>
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Conditional login/logout link */}
                  {isAuthenticated ? (
                    <Fragment key="logout">
                      <AnimatedLink href="#" onClick={handleLogout}>
                        {t('auth.logout')}
                      </AnimatedLink>
                      <span>,</span>
                    </Fragment>
                  ) : (
                    <Fragment key="login">
                      <AnimatedLink href={loginLink.href}>
                        {t('auth.login')}
                      </AnimatedLink>
                      <span>,</span>
                    </Fragment>
                  )}
                  
                  {/* Other user links */}
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
