'use client';

import { motion, useAnimation } from "motion/react"
import { useEffect } from 'react';
import Image from "next/image";
import ResponsiveImage from '../../elements/ResponsiveImage';
import useIsMobile from '@/functions/useIsMobile';


const HeroSection = () => {
  const isMobile = useIsMobile();
  const controls = useAnimation();


  useEffect(() => {
    async function sequence() {
      // Load in 'center' of page
      await controls.start({ opacity: 1, top: '20vh', transition: { duration: 1 } });

      // Move up to default position
      await controls.start({ top:'0', transition: { duration: 0.5, delay:0.75 } });
    }

    sequence();
  }, [controls]);

  return (
    <motion.div
      initial     = {{ opacity: 0, top: '20vh' }}
      animate     = {controls}
      exit        = {{ opacity: 0 }}
      transition  = {{ duration: 1.5, ease: 'backInOut' }}
      style = {{ 
        position:'relative',
        display:'flex',
        flexWrap:'wrap',
        width:'fit-content',
        margin: 'auto',
        userSelect: 'none',
        paddingTop:'40px'
      }}
    >
      {/* Left-hand text */}
      <motion.div 
        initial     = {{ opacity: 0, left: '100px' }}
        animate     = {{ opacity: 1, left: isMobile ?(0) :'15px' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 1.5, ease:'backInOut' }}
        style       = {{ position: 'relative', bottom: isMobile ?(0) :('14px'), display:'grid', height:'min-content', margin:'auto' }}
      >
        
        <motion.div 
          initial     = {{ opacity: 0, left:'100px' }}
          animate     = {{ opacity: 1, left:'unset', right:isMobile ?(0) :('2vw') }}
          exit        = {{ opacity: 0 }}
          transition  = {{ duration: 1.25, ease: 'backInOut', delay:0.15 }}

          style       = {{ position: 'relative' }}
        >
          <h5 style={{ fontSize:'24px', fontWeight:400 }}>
            Hello world
          </h5>
        </motion.div>

        <h1 
          style={{ 
            textTransform: 'uppercase',
            fontSize: 'clamp(52px, 24vw, 128px)', 
            padding:'0',
            margin:'0', 
            lineHeight:'69%',
            textAlign: 'center'
          }}
        >
          {"I\'m"}
        </h1>
      </motion.div>

      {/* Picture of me */}
      <motion.div 
        initial     = {{ opacity: 0 }}
        animate     = {{ opacity: 1 }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 0.5, ease:'backInOut' }}
        style       = {{ margin:'auto', zIndex:1 }}
      >
        <ResponsiveImage src="/images/rs-headshot.png">
          <Image
            src={"/images/rs-headshot.png"}
            alt={"A Picture of Me, Reed!"}
            draggable="false"
            width={252}
            height={252}
            style={{
              borderRadius: '50%',
              objectFit: 'contain'
            }}
          />
        </ResponsiveImage>
      </motion.div>

      {/* Right-hand text */}
      <motion.div 
        initial     = {{ opacity: 0, right: '100px' }}
        animate     = {{ opacity: 1, right: isMobile ?(0) :('25px') }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 1.5, ease:'backInOut' }}
        style={{ position: 'relative', top: isMobile ?('-15px'): '15px', display: 'grid', margin: 'auto', zIndex: 1 }}
      >
        <h1 
          style={{ 
            textTransform: 'uppercase', 
            fontSize: 'clamp(52px, 24vw, 128px)', 
            padding: '0', 
            margin: '0', 
            lineHeight: '69%',
            textAlign:'center'
          }}
        >
          Reed
        </h1>

        <motion.div
          initial    = {{ opacity: 0, right: '100px' }}
          animate    = {{ opacity: 1, right: 'unset', left: '2vw' }}
          exit       = {{ opacity: 0 }}
          transition = {{ duration: 1.25, ease: 'backInOut', delay:0.15 }}

          style      = {{ position: 'relative', marginLeft: '0' }}
        >
          <h5 style={{ fontSize: '24px', textAlign:'right', fontWeight:400 }}>a Full Stack Developer</h5>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default HeroSection;

