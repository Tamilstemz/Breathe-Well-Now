import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import logoPath from "@assets/ND India Logo-01 (1)_1749586357933.png";
import { useLocation } from "wouter";
import { environment } from "../../../environment/environment";
import "./header.css";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
 


  const scrollToSection = (sectionId: string) => {

    const getDynamicOffset = (id: string): number => {
      const header = document.getElementById(id); // updated to use ID
      if (header) {
        const computedStyle = getComputedStyle(header);
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        return Math.round( marginBottom + paddingBottom + 70);
      }
      return 100; // fallback
    };

    const getElementPosition = (element: HTMLElement): number => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientTop = document.documentElement.clientTop || 0;
      return rect.top + scrollTop - clientTop;
    };

    const scrollWithOffset = (id: string, retries = 10) => {
      const element = document.getElementById(id);
      const offset = getDynamicOffset(id);

      if (element) {
        const elementTop = getElementPosition(element);
        const offsetTop = Math.max(0, elementTop - offset);


        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      } else if (retries > 0) {
        console.log(`Element #${id} not found. Retrying... (${retries})`);
        setTimeout(() => scrollWithOffset(id, retries - 1), 300);
      } else {
        console.warn(`Failed to find section: #${id}`);
      }
    };

    if (window.location.pathname !== environment.BASE_PATH) {
      navigate(environment.BASE_PATH);
      setTimeout(() => {
        scrollWithOffset(sectionId);
      }, 500);
      setMobileMenuOpen(false);
    } else {
      setTimeout(() => {
        scrollWithOffset(sectionId);
      }, 300);
      setMobileMenuOpen(false);
      
    }
  };


  const headerVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.header
      className="glass-effect shadow-lg sticky top-0 z-50 border-b border-white/20 w-full"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-4 gap-y-2 w-full">

          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.img
              src={logoPath}
              alt="ND Diagnostics India Logo"
              className="h-[80px] sm:h-[100px] w-auto object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          <motion.nav
            className="hidden md:flex flex-grow justify-center items-center flex-wrap gap-10 whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About Us" },
              { id: "services", label: "Services" },
              { id: "documents", label: "Documents Required" },
              { id: "contact", label: "Contact" },
            ].map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="Navlinks text-gray-700 hover:text-brand-orange text-sm md:text-base font-medium transition-colors"
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.nav>

          <motion.div
            className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a
              href="tel:+919582116116"
              className="Navlinks phone-link text-brand-black hover:text-brand-orange font-medium flex items-center transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-light-orange"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
            >
              <Phone className="mr-2 h-4 w-4" />
              +91 9582-116116
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  navigate(`${environment.BASE_PATH}AppointmentBooking`);
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className="card-gradient-orange w-full md:w-auto px-6 py-2 text-white font-medium hover:shadow-lg transition-all duration-300 border-0 book-btn"
              >
                Book Appointment
              </Button>
            </motion.div>
          </motion.div>

          <motion.button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

      {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-gray-200 overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="flex flex-col space-y-4">
                {[
                  { id: "home", label: "Home" },
                  { id: "about", label: "About Us" },
                  { id: "services", label: "Services" },
                  { id: "documents", label: "Documents Required" },
                  { id: "contact", label: "Contact" },
                ].map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="Navlinks text-gray-700 hover:text-brand-orange text-left block w-full font-medium transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
      
                  <a
                    href="tel:+919582116116"
                    className="text-brand-blue hover:text-accent-blue font-medium flex items-center mb-4"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    +91 9582-116116
                  </a>
                  <Button
                    onClick={() => {
                      navigate(`${environment.BASE_PATH}AppointmentBooking`);
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 50);
                    }}
                    className="card-gradient-orange w-full px-6 py-2 text-white font-medium hover:shadow-lg transition-all duration-300 border-0"
                  >
                    Book Appointment
                  </Button>
              
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
