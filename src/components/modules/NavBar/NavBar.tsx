'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'motion/react';
import Link from 'next/link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeModal from '@/components/elements/QrCodeModal/QrCodeModal';

const NavBar = () => {
  const animDelay = 1;
  const [qrOpen, setQrOpen] = useState(false);

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
      backgroundColor: 'var(--navbar-bg, #F9F7F4)', // ProcessCube tints this to match its pixel-curtain background
      transition: 'background-color 0.15s linear',
      zIndex: 999, 
      }}
    >

      {/* QR Code (far left: margin-right auto pushes the links to the right) */}
      <motion.div
        initial     = {{ opacity: 0, top:'-100px' }}
        animate     = {{ opacity: 1, top:'0' }}
        exit        = {{ opacity: 0 }}
        transition  = {{ duration: 0.75, ease: 'easeInOut', delay: animDelay - 0.25, type: 'spring', bounce:0 }}
        style       = {{ position: 'relative', alignSelf: 'center', marginRight: 'auto' }}
      >
        <button
          type        = 'button'
          onClick     = {() => setQrOpen(true)}
          aria-label  = 'Show QR code for this site'
          title       = 'Show QR code'
          style       = {{ display: 'grid', placeItems: 'center', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <QrCode2Icon sx={{ fontSize: '1.9rem', color: '#202328' }} />
        </button>
      </motion.div>

      <QrCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />

      {/* GitHub */}
      <motion.div
        initial={{ opacity: 0, top: '-100px' }}
        animate={{ opacity: 1, top: '0' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: 'easeInOut', delay: animDelay, type: 'spring', bounce: 0 }}

        style={{ position: 'relative', alignSelf: 'center' }}
      >
        <Link href={'https://github.com/steckReed'} target='_blank' aria-label='GitHub'>
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
        <Link href={'https://www.linkedin.com/in/reed-steck-993b48286/'} target='_blank' aria-label='LinkedIn'>
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

