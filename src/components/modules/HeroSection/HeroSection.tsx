'use client';

import { motion, useAnimation } from "motion/react"
import { useEffect } from 'react';
import Image from "next/image";
import ResponsiveImage from '../../elements/ResponsiveImage';
import useIsMobile from '@/functions/useIsMobile';


const HeroSection = () => {
  const isMobile = useIsMobile();
  const controls = useAnimation();

  // Desktop/tablet scales the whole row with the viewport so it never wraps.
  // Mobile stacks the photo on top with "I'M" + "REED" side by side below it.
  const headlineSize  = isMobile ?('clamp(40px, 14vw, 128px)') :('clamp(52px, 11vw, 128px)');
  const subheadSize   = isMobile ?('clamp(15px, 4.5vw, 24px)') :('clamp(16px, 2vw, 24px)');
  const imageSize     = isMobile ?('clamp(160px, 55vw, 252px)') :('clamp(140px, 21.5vw, 252px)');


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
        flexWrap: isMobile ?('wrap') :('nowrap'),
        justifyContent:'center',
        alignItems: isMobile ?('flex-start') :('center'),
        rowGap:isMobile ?('0') :('1rem'),
        width:'fit-content',
        maxWidth:'100%',
        margin: 'auto',
        userSelect: 'none',
        paddingTop:'40px',
        paddingBottom: isMobile ?('1.5rem') :('0')
      }}
    >
      {/* Left-hand text */}
      <motion.div 
        initial     = {{ opacity: 0, left: '100px' }}
        animate     = {{ opacity: 1, left: isMobile ?(0) :'15px' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 1.5, ease:'backInOut' }}
        style       = {{ 
          position: 'relative', 
          bottom: isMobile ?(0) :('14px'), 
          display:'grid', 
          justifyItems: isMobile ?('end') :('normal'), 
          height:'min-content', 
          margin: isMobile ?('0 3vw 0 0') :('auto') 
        }}
      >
        
        <motion.div 
          initial     = {{ opacity: 0, left:'100px' }}
          animate     = {{ opacity: 1, left:'unset', right:isMobile ?(0) :('2vw') }}
          exit        = {{ opacity: 0 }}
          transition  = {{ duration: 1.25, ease: 'backInOut', delay:0.15 }}

          style       = {{ position: 'relative' }}
        >
          <h5 style={{ fontSize: subheadSize, fontWeight:400 }}>
            Hello world
          </h5>
        </motion.div>

        <h1 
          style={{ 
            textTransform: 'uppercase',
            fontSize: headlineSize, 
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
        style       = {{ 
          display:'flex',
          justifyContent:'center',
          flexShrink:0,
          margin: isMobile ?('0') :('auto'),
          zIndex:1,
          ...(isMobile && { order:-1, flexBasis:'100%' })
        }}
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
              objectFit: 'contain',
              width: imageSize,
              height: 'auto'
            }}
          />
        </ResponsiveImage>
      </motion.div>

      {/* Right-hand text (on mobile, pushed down one subheading line so "REED" sits level with "I'M") */}
      <motion.div 
        initial     = {{ opacity: 0, right: '100px' }}
        animate     = {{ opacity: 1, right: isMobile ?(0) :('25px') }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 1.5, ease:'backInOut' }}
        style       = {{ 
          position: 'relative', 
          top: isMobile ?(`calc(${subheadSize} * 1.22)`): '15px', 
          display: 'grid', 
          margin: isMobile ?('0') :('auto'), 
          zIndex: 1 
        }}
      >
        <h1 
          style={{ 
            textTransform: 'uppercase', 
            fontSize: headlineSize, 
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
          <h5 style={{ fontSize: subheadSize, textAlign:'right', fontWeight:400, whiteSpace:'nowrap' }}>a Full Stack Developer</h5>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default HeroSection;

