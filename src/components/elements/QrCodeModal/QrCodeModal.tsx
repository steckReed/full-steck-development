'use client'

import { Box, Modal } from '@mui/material';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LegendContainer from '@/components/modules/LegendContainer/LegendContainer';

interface Props{
  open    : boolean;
  onClose : () => void;
}

// Where the QR code sends people (the live site, even when shown from a local/dev copy)
export const siteUrl = 'https://full-steck-development.com';

const ink = '#242424';

// MUI Modal handles locking background scroll, trapping focus & closing on Esc / backdrop click
const QrCodeModal = ({ open, onClose }: Props) => (
  <Modal
    open              = {open}
    onClose           = {onClose}
    aria-labelledby   = 'qr-modal-title'
    aria-describedby  = 'qr-modal-description'
    slotProps         = {{ backdrop: { sx: { backgroundColor: 'rgba(38, 34, 21, 0.55)' } } }}
    sx                = {{ display: 'grid', placeItems: 'center', padding: '16px' }}
  >
    <Box tabIndex={-1} sx={{ outline: 'none' }}>
      <motion.div
        initial     = {{ opacity: 0, y: 40, scale: 0.9 }}
        animate     = {{ opacity: 1, y: 0, scale: 1 }}
        transition  = {{ duration: 0.45, ease: 'backInOut', type: 'spring', bounce: 0.25 }}
        style       = {{ position: 'relative', paddingTop: '20px' }}
      >
        <LegendContainer title='Scan Me' width='min(360px, calc(100vw - 48px))' paperColor='paper-navy'>
          <Box sx={{ display: 'grid', justifyItems: 'center', gap: '14px', paddingTop: '0.75rem' }}>

            {/* Close */}
            <button
              type        = 'button'
              onClick     = {onClose}
              aria-label  = 'Close QR code'
              style={{
                position: 'absolute', top: '10px', right: '10px',
                display: 'grid', placeItems: 'center',
                width: '36px', height: '36px', padding: 0,
                border: `3px solid ${ink}`, borderRadius: '50%',
                backgroundColor: 'var(--color-cream)', color: ink, cursor: 'pointer'
              }}
            >
              <CloseRoundedIcon fontSize='small' />
            </button>

            <h2 id='qr-modal-title' style={{ fontSize: '22px', letterSpacing: '-0.5px', textAlign: 'center', marginTop: '6px' }}>
              Take the site with you!
            </h2>

            {/* QR code */}
            <Box sx={{ width: '100%', maxWidth: '260px', padding: '12px', border: `3px solid ${ink}`, borderRadius: '12px', backgroundColor: 'var(--color-cream)' }}>
              <QRCodeSVG
                value     = {siteUrl}
                size      = {256}
                level     = 'M'
                fgColor   = {ink}
                bgColor   = '#F9F7F4'
                title     = {`QR code linking to ${siteUrl}`}
                style     = {{ display: 'block', width: '100%', height: 'auto' }}
              />
            </Box>

            <p id='qr-modal-description' style={{ textAlign: 'center', fontSize: '15px', lineHeight: 1.4 }}>
              <a href={siteUrl} target='_blank' rel='noopener noreferrer' style={{ color: 'var(--color-navy)', fontWeight: 700 }}>
                {siteUrl.replace('https://', '')}
              </a>
            </p>
          </Box>
        </LegendContainer>
      </motion.div>
    </Box>
  </Modal>
);

export default QrCodeModal;
