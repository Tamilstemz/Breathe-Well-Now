import { motion } from "framer-motion";
import Hero from "@/components/hero";
import MissionVision from "@/components/mission-vision";
import Services from "@/components/services";
import About from "@/components/about";
import Process from "@/components/process";
import Documents from "@/components/documents";
import Contact from "@/components/contact";
import { ToastContainer } from "react-toastify";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <main>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <Hero />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <MissionVision />
        </motion.div>


        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <About />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <Services />
        </motion.div>

        

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <Process />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <Documents />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <Contact />
        </motion.div>
       
      </main>
    </motion.div>
  );
}
