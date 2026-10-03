import { motion } from 'motion/react';
import GitHubIcon from '@mui/icons-material/GitHub';

const VersionControlTitle = () => {

  return(<>
    <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <GitHubIcon sx={{ fontSize: 'clamp(175px, 45vw, 300px)', color: '#202328' }} />

      <h1
        style={{
          textAlign: 'center',
          letterSpacing: '-1px',
          fontWeight: 'bold',
          fontSize: 'clamp(48px, 8vw, 60px)',
        }}
      >
        Version Control
      </h1>

      <h4
        style={{
          position: 'relative',
          top: '-2px',
          textAlign: 'center',
          letterSpacing: '2px',
          fontWeight: 'normal',
          fontSize: 'clamp(22px, 5vw, 26px)'
        }}
      >
        Git Good
      </h4>
    </motion.div>
  </>)
}

export default VersionControlTitle;
