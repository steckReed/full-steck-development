'use client'

import { useRef } from 'react';
import { Box } from '@mui/material';
import { motion, useInView } from 'motion/react';
import LegendContainer from '../LegendContainer/LegendContainer';
import FeatureShippingStep from '../IdeasToWebApps/FeatureShippingStep/FeatureShippingStep';

// Standalone, full-size copy of the "Feature Shipping" dashboard for visitors to play with
const DashboardPlayground = () => {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const nearScreen  = useInView(sectionRef, { once: true, margin: '0px 0px 300px 0px' }); // Load the card data just before it's needed
  const inView      = useInView(sectionRef, { once: true, amount: 0.25 });

  return(<>
    {/* z-index 1: the next section's pixel curtain reaches up behind this one, so keep this content on top of it */}
    <Box ref={sectionRef} sx={{ position: 'relative', zIndex: 1, display: 'grid', justifyItems: 'center', gap: '40px', marginTop: '4.5vh' }}>

      {/* Title */}
      <motion.div
        initial     = {{ opacity: 0, y: 24 }}
        animate     = {inView ?({ opacity: 1, y: 0 }) :({ opacity: 0, y: 24 })}
        transition  = {{ duration: 0.6, ease: 'backInOut', type: 'spring', bounce: 0 }}
        style       = {{ textAlign: 'center' }}
      >
        <h4 style={{ letterSpacing: '2px', fontWeight: 'normal', fontSize: 'clamp(20px, 5vw, 26px)' }}>
          Shipped &amp; Ready to Use
        </h4>
        <h1 style={{ letterSpacing: '-2px', fontWeight: 'bold', fontSize: 'clamp(40px, 8vw, 60px)', lineHeight: 1.05 }}>
          Take It for a Spin
        </h1>
        <p style={{ marginTop: '12px', fontSize: 'clamp(15px, 3.8vw, 18px)' }}>
          The same dashboard from above, but full size. Filter, sort, & hover the charts!
        </p>
      </motion.div>

      {/* Dashboard */}
      <motion.div
        initial     = {{ opacity: 0, y: 60 }}
        animate     = {inView ?({ opacity: 1, y: 0 }) :({ opacity: 0, y: 60 })}
        transition  = {{ duration: 0.75, ease: 'backInOut', type: 'spring', bounce: 0, delay: 0.15 }}
        style       = {{ position: 'relative', paddingTop: '20px' }}
      >
        <LegendContainer title='Playground' width='min(1000px, calc(100vw - 48px))' paperColor='paper-navy'>
          <FeatureShippingStep active={nearScreen} />
        </LegendContainer>
      </motion.div>
    </Box>
  </>)
}

export default DashboardPlayground;
