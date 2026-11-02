"use client";
import { motion, useReducedMotion } from "framer-motion";

// Scroll-entrance wrapper used across the site (award-site style staggered reveals).
export default function Reveal({ children, delay = 0, y = 28, className = "", once = true }) {
    const reduce = useReducedMotion();
    if (reduce)
        return <div className={className}>{children}</div>;
    return (<motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>);
}
