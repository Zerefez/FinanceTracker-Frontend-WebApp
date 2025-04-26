import { motion } from 'framer-motion';
import { loginLink, logoutLink, mainLinks, userLinks } from '../../data/navigationLinks';
import { useAuth, useNavigation } from '../../lib/hooks';
import { perspective, slideIn } from "./animation/animNav";

export default function Nav() {
  const { isAuthenticated } = useAuth();
  const { handleLogout } = useNavigation();
  
  return (
    <div className="flex flex-col justify-between h-full box-border">
      <div className="container mx-auto px-8 py-20">
        <div className="space-y-12 z-2000">
          <div className="space-y-4">
            <motion.h2 
              variants={perspective}
              custom={-1}
              initial="initial"
              animate="enter"
              exit="exit"
              className="text-xl font-medium mb-6 border-b pb-2 border-black"
            >
              Sitemap
            </motion.h2>
            <div className="flex gap-4 flex-col">
              {
                mainLinks.map((link, i) => {
                  const { title, href } = link;
                  return (
                    <div key={`b_${i}`} className="perspective-120px perspective-origin-bottom ">
                      <motion.div
                        custom={i}
                        variants={perspective}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                      >
                        <a href={href} className="block text-2xl font-semibold">
                          {title}
                        </a>
                      </motion.div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div>
            <motion.h2 
              variants={slideIn}
              custom={-1}
              initial="initial"
              animate="enter"
              exit="exit"
              className="text-xl font-medium mb-6 border-b pb-2 border-black"
            >
              User
            </motion.h2>
            <div className="flex gap-4 flex-col">
              {/* Conditional login/logout link */}
              {isAuthenticated ? (
                <div className="perspective-120px perspective-origin-bottom">
                  <motion.div
                    custom={-2}
                    variants={perspective}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                  >
                    <a onClick={handleLogout} href="#" className="block text-2xl font-semibold">
                      {logoutLink.title}
                    </a>
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
                    <a href={loginLink.href} className="block text-2xl font-semibold">
                      {loginLink.title}
                    </a>
                  </motion.div>
                </div>
              )}
              {
                userLinks.map((link, i) => {
                  const { title, href } = link;
                  return (
                    <div key={`b_${i}`} className="perspective-120px perspective-origin-bottom ">
                      <motion.div
                        custom={i}
                        variants={perspective}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                      >
                        <a href={href} className="block text-2xl font-semibold">
                          {title}
                        </a>
                      </motion.div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}