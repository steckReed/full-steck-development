import { AgileTimelineTicketsProps, TicketSizes, TicketStatusMap, TicketTypes } from '@/types/types';
import { Box, Tooltip } from '@mui/material';
import useIsMobile from '@/functions/useIsMobile';

interface Props {
  ticketNum     : string | number,
  text          : string,
  status        ?: TicketTypes,
  size          ?: TicketSizes,
  loadingBarId  ?: AgileTimelineTicketsProps['loadingBarId']
}

const TicketContainer = ({
  ticketNum,
  text,
  status      = 'not started',
  size        = 'lg',
  loadingBarId  = undefined,
}: Props) => {
  const isMobile = useIsMobile();
  
  // Pull Status Info Via Map
  const ticketStatusInfo = TicketStatusMap[status];

  // Ticket Size Container Styles
  const ticketContainerStyle = {
    'lg': { 
      minHeight : '50px',
      height    : 'fit-content',
      padding   : '0 1rem 0 0.5rem',
      fontSize  : '24px',
      gap       : '12px',
    },
    'sm': { 
      minHeight : '34px',
      height    : 'fit-content',
      padding   : '0 0.85rem 0 0.5rem',
      fontSize  : '18px',
      gap       : '8px',
    }
  }

  // Ticket Size Status Number Container Styles
  const statusNumContainerStyle = {
    'lg': {
      gap: '12px'
    },
    'sm': {
      gap: '8px'
    }
  }

  // Tickets Status Dot Style
  const statusDotStyle = {
    'lg': {
      height  : '30px',
      width   : '30px'
    },
    'sm':{
      height  : '24px',
      width   : '24px'
    }
  }

  return (<>
    <Box sx={{ display:'flex', flexDirection:'column' }}>
      <Tooltip title={(isMobile) && (text)} placement='right' arrow disableInteractive>
        <Box 
          sx={{ 
            display:'flex',
            alignItems:'center',
            backgroundColor:'#242424', 
            borderRadius:'12px', 
            color:'#F9F7F4',
            width:'fit-content',
            ...ticketContainerStyle[size]
          }}
        >
          {/* Ticket status & number */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...statusNumContainerStyle[size] }}>

            <Tooltip title={ticketStatusInfo.desc} placement='top' arrow disableInteractive>
              <span style={{ backgroundColor: ticketStatusInfo.color, borderRadius: '50%', ...statusDotStyle[size] }}/>
            </Tooltip>

            <p>#{ticketNum}</p>
          </Box>

          {(!isMobile) && (<>
            {/* Ticket Name */}
            <p>{text}</p>
          </>)}
        </Box>
      </Tooltip>

      {(loadingBarId) && (<>
        <span 
          id={loadingBarId}
          style={{ 
            height: '6px', 
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
