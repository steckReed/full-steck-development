import { Box } from '@mui/material';
import { ReactNode } from 'react';
import styles from './_LegendContainer.module.scss'

interface Props{
  title: string;
  width?: string;
  children: ReactNode;
  animateBorder?: boolean;
  paperColor?: string;
  hideTitle?: boolean;
}

const LegendContainer = ({
  title,
  width='clamp(250px, 85vw, 544px)',
  children,
  animateBorder,
  paperColor='paper-olive',
  hideTitle=false
}: Props) => {

  return (<>
  <Box className={`paper ${paperColor}`}>
    <Box 
      sx={{ 
        backgroundColor:'#F9F7F4',
        border:'4px solid #242424',
        borderRadius:'12px',
        height:'min-content',
        width: width,
        margin:'auto'
      }}
    >
      {/* Legend */}
      <Box
        sx={{ 
          zIndex:'0',
          position: 'absolute',
          left:'50%',
          right:'-50%',
          transform: 'translate(-50%,-60%)',
          display:'flex',
          alignItems:'center',
          backgroundColor: '#242424',
          borderRadius:'12px',
          height:'40px',
          padding:'0 2.5rem',
          width:'min-content',
          opacity: hideTitle ?(0) :(1),
          pointerEvents: hideTitle ?('none') :('auto'),
          transition:'opacity 0.3s'
        }}
      >
        <h4 
          style={{ 
            margin:0,
            padding:0,
            color:'white', 
            fontWeight:'normal', 
            whiteSpace:'nowrap',
            fontSize:'24px'
          }}
        >
          {title}
        </h4>
      </Box>

      <Box sx={{ padding:'1.5rem 1rem' }}>
        {children}
      </Box>
    </Box>
    </Box>
  </>)
}

export default LegendContainer;
