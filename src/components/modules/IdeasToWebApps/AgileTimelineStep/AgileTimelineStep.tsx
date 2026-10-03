'use client'

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAnimate } from 'motion/react';
import { AgileTimelineTicketsProps } from '@/types/types';
import TicketContainer from '@/components/elements/TicketContainer/TicketContainer';

interface Props{
  active: boolean;
}

// Agile timeline ticket objects
const agileTimelineTickets: AgileTimelineTicketsProps[] = [
  { 'id': 'ticket1',
    'size':'sm',
    'status':'on hold',
    'text':'Drag & Drop Package',
    'loadingBarId': 'ticket1LoadingBar'
  },
  { 'id': 'ticket2',
    'size': 'sm',
    'status': 'completed',
    'text': 'Charting Package',
    'loadingBarId': 'ticket2LoadingBar'
  },
  { 'id': 'ticket3',
    'size': 'sm',
    'status': 'working on it',
    'text': 'Fetch Data From Source',
    'loadingBarId': 'ticket3LoadingBar'
  },
  { 'id': 'ticket4',
    'size': 'sm',
    'status': 'completed',
    'text': 'Build Drag & Drop Layout',
    'loadingBarId': 'ticket4LoadingBar'
  },
  { 'id': 'ticket5',
    'size': 'sm',
    'status': 'working on it',
    'text': 'Implement Charts in Layout',
    'loadingBarId': 'ticket5LoadingBar'
  },
]

// Where each ticket slides to (sprint offset) & how far its loading bar fills
const ticketAnims = [
  { left: '0%',  barWidth: '11%', barDuration: 1.75 },
  { left: '0%',  barWidth: '7%',  barDuration: 1.75 },
  { left: '11%', barWidth: '15%', barDuration: 1.75 },
  { left: '11%', barWidth: '89%', barDuration: 3.75 },
  { left: '26%', barWidth: '74%', barDuration: 3 },
];

const AgileTimelineStep = ({ active }: Props) => {
  const [scope, animate]  = useAnimate();
  const animDelay         = 0.75;

  // Play the ticket sequence each time this step becomes active, reset when it isn't
  useEffect(() => {
    if (!scope.current) return;

    agileTimelineTickets.forEach((ticket, i) => {
      const ticketSel = `#${ticket.id}`;
      const barSel    = `#${ticket.loadingBarId}`;

      if (!active) {
        animate(ticketSel, { opacity: 0, left: '0%' }, { duration: 0 });
        animate(barSel, { opacity: 0, width: '0%' }, { duration: 0 });
        return;
      }

      const sequence = async () => {
        await animate(ticketSel, { opacity: 1 }, { duration: 0.75, ease: 'easeInOut', delay: animDelay + i * 0.05 });
        if (ticketAnims[i].left !== '0%') {
          await animate(ticketSel, { left: ticketAnims[i].left }, { duration: 0.5, delay: 0.5 });
        }
      };
      sequence();

      animate(barSel, { opacity: 1, width: ticketAnims[i].barWidth }, { duration: ticketAnims[i].barDuration, ease: 'backInOut', delay: animDelay + 0.2 + i * 0.05 });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return(<>
    <Box
      ref={scope}
      sx={{
        display: 'flex',
        flexDirection:'column',
        gap: 'clamp(16px, 2.5vh, 25px)',
        padding: '0 1rem',
      }}
    >
      {/* Title */}
      <Box sx={{ paddingTop:'2vh' }}>
        <p style={{ textAlign: 'center', fontSize: '24px' }}>
          Deliverables In
        </p>
        <p style={{ textAlign: 'center', fontWeight:'bold', letterSpacing:'-2px', fontSize:'28px' }}>
          2 - 3 Week Sprints
        </p>
      </Box>

      {/* Timeline */}
      <Box sx={{ display:'flex', }}>
        <span style={{ display: 'inline-block', height:'clamp(26px, 5vh, 50px)', border:'2px dashed #242424'}}/>

        <span style={{ display: 'inline-block', border: '2px dashed #242424', width:'100%', height:'0px', margin:'auto'}}/>

        <span style={{ display: 'inline-block', height: 'clamp(26px, 5vh, 50px)', border: '2px dashed #242424' }} />
      </Box>

      {/* Tickets */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 2.5vh, 25px)',
          overflow: 'hidden'
        }}
      >
        {agileTimelineTickets.map((val, key) => (
          <div
            key   = {val.id}
            id    = {val.id}
            style = {{ position:'relative', opacity: 0 }}
          >
            <TicketContainer
              ticketNum     = {key + 1}
              size          = {val.size}
              status        = {val.status}
              text          = {val.text}
              loadingBarId  = {val.loadingBarId}
            />
          </div>
        ))}
      </Box>
    </Box>
  </>)
}

export default AgileTimelineStep;
