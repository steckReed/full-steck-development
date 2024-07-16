'use client';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NavBar = () => {
  const animDelay = 1;

  return(
    <Box sx={{
      position: 'fixed', 
      top: 0, 
      display: 'flex', 
      height: 'min-content', 
      width: '100%', 
      px: 3, 
      alignContent: 'center', 
      justifyContent: 'end', 
      gap: '2vw', 
      backgroundColor: '#F9F7F4',
      zIndex: 999, 
      }}
    >
      {/* LinkedIn */}
      <motion.div
        initial     = {{ opacity: 0, top:'-100px' }}
        animate     = {{ opacity: 1, top:'0' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 0.75, ease: 'backInOut', delay: animDelay, type: 'spring', bounce:0 }}

        style={{ position: 'relative' }}
      >
        <Link href={'https://www.linkedin.com/in/reed-steck-993b48286/'} target='_blank'>
          <LinkedInIcon sx={{ fontSize: '2rem' }} />
        </Link>
      </motion.div>

      {/* Resume */}
      <motion.div
        initial     = {{ opacity: 0, top:'-100px' }}
        animate     = {{ opacity: 1, top:'0' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 0.75, ease: 'backInOut', delay: animDelay + 0.25, type: 'spring', bounce:0 }}
        style={{
          position: 'relative',
          height:'min-content',
          alignSelf:'center'
        }}
      >
        <Link href="/files/steck-reed-resume.pdf" download="steck-reed-resume.pdf" target='_blank' style={{ color:'black', textDecoration:'none' }}>
          <p>Resume</p>
        </Link>
      </motion.div>

    
    </Box>
  )
}

export default NavBar;
