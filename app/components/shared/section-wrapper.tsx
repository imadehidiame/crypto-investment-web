import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// A simple wrapper for sections to animate on scroll
const SectionWrapper = ({ children, className = "", animationType = "fadeInUp", delay = 0, threshold = 0.1,padding='12',md_padding='20' }:{children?:React.ReactNode,className?:string,animationType?:string,delay?:number,threshold?:number,padding?:string,md_padding?:string}) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only animate once
    threshold: 0.1,
  });

  const variants = {
    fadeInUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, delay } },
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
    },
    slideInRight: {
      hidden: { opacity: 0, x: 100 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
    }
  };

  //type types = keyof typeof variants;

  return (
    <motion.section
      ref={ref}
      className={`py-${padding} md:py-${md_padding} ${className}`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={ variants[animationType as keyof typeof variants] || variants.fadeInUp}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;