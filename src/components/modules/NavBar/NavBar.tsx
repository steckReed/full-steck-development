'use client';

import { Box } from '@mui/material';
import { motion } from 'motion/react';
import Link from 'next/link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

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

      {/* GitHub */}
      <motion.div
        initial={{ opacity: 0, top: '-100px' }}
        animate={{ opacity: 1, top: '0' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: 'easeInOut', delay: animDelay, type: 'spring', bounce: 0 }}

        style={{ position: 'relative', alignSelf: 'center' }}
      >
        <Link href={'https://github.com/steckReed'} target='_blank'>
          <GitHubIcon sx={{ fontSize: '1.75rem', color: '#202328' }} />
        </Link>
      </motion.div>

      {/* LinkedIn */}
      <motion.div
        initial     = {{ opacity: 0, top:'-100px' }}
        animate     = {{ opacity: 1, top:'0' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 0.75, ease: 'easeInOut', delay: animDelay + 0.25, type: 'spring', bounce:0 }}

        style={{ position: 'relative', alignSelf: 'center' }}
      >
        <Link href={'https://www.linkedin.com/in/reed-steck-993b48286/'} target='_blank'>
          <LinkedInIcon sx={{ fontSize: '2rem', color:'#0077b5' }} />
        </Link>
      </motion.div>

      {/* Resume */}
      <motion.div
        initial     = {{ opacity: 0, top:'-100px' }}
        animate     = {{ opacity: 1, top:'0' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 0.75, ease: 'easeInOut', delay: animDelay + 0.50, type: 'spring', bounce:0 }}
        style={{
          position: 'relative',
          height:'min-content',
          alignSelf: 'center'
        }}
      >
        <Link href="/files/c-steck-reed-resume.pdf" download="c-steck-reed-resume.pdf" target='_blank' style={{ color:'black', textDecoration:'none' }}>
          <p>Resume</p>
        </Link>
      </motion.div>

    
    </Box>
  )
}

export default NavBar;

