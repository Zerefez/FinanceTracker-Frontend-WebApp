import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loginLink, logoutLink, mainLinks, userLinks } from "../../data/navigationLinks";
import { useAuth, useNavigation } from "../../lib/hooks";
import { perspective, slideIn } from "./animation/animNav";

export default function Nav() {
  const { isAuthenticated } = useAuth();
  const { handleLogout } = useNavigation();
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallMobile(window.innerWidth < 480);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="box-border flex h-full flex-col justify-between">
      <div className={`container mx-auto ${isSmallMobile ? "px-4 py-12" : "px-8 py-20"}`}>
        <div className="z-2000 space-y-12">
          <div className="space-y-4">
            <motion.h2
              variants={perspective}
              custom={-1}
              initial="initial"
              animate="enter"
              exit="exit"
              className={`${isSmallMobile ? "text-lg text-white" : "text-xl"} mb-6 border-b border-white pb-2 font-medium text-white`}
            >
              Sitemap
            </motion.h2>
            <div className="flex flex-col gap-4">
              {mainLinks.map((link, i) => {
                const { title, href } = link;
                return (
                  <div
                    key={`b_${i}`}
                    className="perspective-120px perspective-origin-bottom text-white"
                  >
                    <motion.div
                      custom={i}
                      variants={perspective}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                    >
                      <Link
                        to={href}
                        className={`block ${isSmallMobile ? "text-xl" : "text-2xl"} font-semibold`}
                      >
                        {title}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <motion.h2
              variants={slideIn}
              custom={-1}
              initial="initial"
              animate="enter"
              exit="exit"
              className={`${isSmallMobile ? "text-lg text-white" : "text-xl"} mb-6 border-b border-white pb-2 font-medium text-white`}
            >
              User
            </motion.h2>
            <div className="flex flex-col gap-4">
              {/* Conditional login/logout link */}
              {isAuthenticated ? (
                <div className="perspective-120px perspective-origin-bottom text-white">
                  <motion.div
                    custom={-2}
                    variants={perspective}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                  >
                    <Link
                      onClick={handleLogout}
                      to="#"
                      className={`block ${isSmallMobile ? "text-xl" : "text-2xl"} font-semibold`}
                    >
                      {logoutLink.title}
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="perspective-120px perspective-origin-bottom">
                  <motion.div
                    custom={-2}
                    variants={perspective}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                  >
                    <Link
                      to={loginLink.href}
                      className={`block ${isSmallMobile ? "text-xl" : "text-2xl"} font-semibold`}
                    >
                      {loginLink.title}
                    </Link>
                  </motion.div>
                </div>
              )}
              {userLinks.map((link, i) => {
                const { title, href } = link;
                return (
                  <div
                    key={`b_${i}`}
                    className="perspective-120px perspective-origin-bottom text-white"
                  >
                    <motion.div
                      custom={i}
                      variants={perspective}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                    >
                      <Link
                        to={href}
                        className={`block ${isSmallMobile ? "text-xl" : "text-2xl"} font-semibold`}
                      >
                        {title}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
