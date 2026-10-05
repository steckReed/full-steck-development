import { AgileTimelineTicketsProps, TicketSizes, TicketStatusMap, TicketTypes } from '@/types/types';
import { Box, Tooltip } from '@mui/material';
import { motion } from 'motion/react';
import useIsMobile from '@/functions/useIsMobile';

interface Props {
  ticketNum     : string | number,
  text          : string,
  status        ?: TicketTypes,
  size          ?: TicketSizes,
  accent        ?: string,      // Hard shadow color (e.g. the ticket's branch color on the git graph)
  loadingBarId  ?: AgileTimelineTicketsProps['loadingBarId']
}

const ink = '#242424';

const TicketContainer = ({
  ticketNum,
  text,
  status      = 'not started',
  size        = 'lg',
  accent      = ink,
  loadingBarId  = undefined,
}: Props) => {
  const isMobile = useIsMobile();

  // Pull Status Info Via Map
  const ticketStatusInfo = TicketStatusMap[status];

  // Ticket Size Container Styles
  const ticketContainerStyle = {
    'lg': {
      minHeight : '50px',
      fontSize  : '24px',
      boxShadow : `5px 5px 0 ${accent}`,
    },
    'sm': {
      minHeight : '34px',
      fontSize  : '18px',
      boxShadow : `4px 4px 0 ${accent}`,
    }
  }

  // Ticket Size Number Tab Styles (status pip & number)
  const numTabStyle = {
    'lg': {
      padding : '0 14px 0 12px',
      gap     : '10px'
    },
    'sm': {
      padding : '0 10px 0 8px',
      gap     : '7px'
    }
  }

  // Ticket Size Name Styles
  const nameStyle = {
    'lg': {
      padding : '6px 16px 6px 14px'
    },
    'sm': {
      padding : '4px 12px 4px 10px'
    }
  }

  // Tickets Status Pip Style
  const statusPipStyle = {
    'lg': {
      height  : '20px',
      width   : '20px'
    },
    'sm':{
      height  : '15px',
      width   : '15px'
    }
  }

  return (<>
    <Box sx={{ display:'flex', flexDirection:'column' }}>
      <Tooltip title={(isMobile) && (text)} placement='right' arrow disableInteractive>
        <Box
          sx={{
            display:'flex',
            alignItems:'stretch',
            backgroundColor:'var(--color-cream)',
            border:`3px solid ${ink}`,
            borderRadius:'10px',
            overflow:'hidden',
            color:ink,
            width:'fit-content',
            ...ticketContainerStyle[size]
          }}
        >
          {/* Ticket status & number (ink tab) */}
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: ink, color: 'var(--color-cream)', ...numTabStyle[size] }}>

            <Tooltip title={ticketStatusInfo.desc} placement='top' arrow disableInteractive>
              <motion.span
                key         = {status} // Re-mounts on a status change so the pip pops
                initial     = {{ scale: 0.6 }}
                animate     = {{ scale: 1 }}
                transition  = {{ type: 'spring', bounce: 0.6, duration: 0.45 }}
                style       = {{ flexShrink: 0, backgroundColor: ticketStatusInfo.color, border: '2px solid var(--color-cream)', borderRadius: '3px', ...statusPipStyle[size] }}
              />
            </Tooltip>

            <p style={{ fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontWeight: 700, whiteSpace: 'nowrap' }}>#{ticketNum}</p>
          </Box>

          {(!isMobile) && (<>
            {/* Ticket Name */}
            <p style={{ display: 'flex', alignItems: 'center', fontWeight: 600, ...nameStyle[size] }}>{text}</p>
          </>)}
        </Box>
      </Tooltip>

      {(loadingBarId) && (<>
        <span
          id={loadingBarId}
          style={{
            height: '6px',
            marginTop: '8px', // Clears the hard shadow
            backgroundColor: ticketStatusInfo.color,
            borderRadius: '25px',
            width: 0
          }}
        />
      </>)}
    </Box>
  </>)
};

export default TicketContainer;
