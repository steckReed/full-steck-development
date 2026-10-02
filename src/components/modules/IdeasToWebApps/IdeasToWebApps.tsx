'use client';

import { useRef } from 'react';
import { Box } from '@mui/material';
import { motion, useAnimate } from 'motion/react';
import { AgileTimelineTicketsProps, AnimationSequence } from '@/types/types';
import Image from "next/image";
import LegendContainer from '../LegendContainer/LegendContainer';
import useRefScrollPercentage from '@/hooks/useRefScrollPercentage';
import useAnimationSequence from '@/hooks/useAnimationSequence';
import CustomChip from '@/components/elements/CustomChip/CustomChip';
import ResponsiveImage from '@/components/elements/ResponsiveImage';
import TicketContainer from '@/components/elements/TicketContainer/TicketContainer';
import useIsMobile from '@/functions/useIsMobile';


const IdeasToWebApps = () => {
  // Container Ref
  const containerRef      = useRef<HTMLDivElement>(null);
  const scrollPercentage  = useRefScrollPercentage(containerRef);
  const [scope, animate]  = useAnimate();
  const animDelay         = 0.75;
  const isMobile          = useIsMobile();

  // Map Containing Animation Trigger Points
  const startAnimOn = new Map([
    ['item1', scrollPercentage > 0],
    ['item2', scrollPercentage > 33],
    ['item3', scrollPercentage > 66],
  ])
  
  // Settings for carousel items animations
  const carouselItemAnimSettings = {
    initial     : { opacity: 0, bottom: '-225px', transform: 'scale(0.75)' },
    animate     : { opacity: 1, bottom: '0', transform: 'scale(1)' },
    transition  : { duration: 0.85, ease: 'easeInOut', delay: 1 / 3, type: 'spring', bounce: 0 }
  }
  
  // Components Animation Sequence
  const animationSequence: AnimationSequence[] = [
    // Carousel Items
      { 'id': 'carouselItem_Idea',
        'animStartOn': 'item1',

        'initial': carouselItemAnimSettings.initial,
        'animations': [
          {
            animate: carouselItemAnimSettings.animate,
            transition: carouselItemAnimSettings.transition
          }
        ],
      },
      { 'id': 'carouselItem_Wireframe',
        'animStartOn': 'item2',

        'initial': carouselItemAnimSettings.initial,
        'animations': [
          {
            animate: carouselItemAnimSettings.animate,
            transition: carouselItemAnimSettings.transition
          }
        ],
      },

      { 'id': 'carouselItem_AgileTimeline',
        'animStartOn': 'item3',

        'initial': carouselItemAnimSettings.initial,
        'animations': [
          {
            animate: carouselItemAnimSettings.animate,
            transition: carouselItemAnimSettings.transition
          }
        ],
      },



    // Agile Timeline
      { 'id': 'ticket1',
        'animStartOn': 'item3',

        'initial': { opacity: 0, left: '0%' },
        'animations': [
          {
            animate: { opacity: 1, },
            transition: { duration: 0.75, ease: 'easeInOut', delay: animDelay },
          }
        ],
      },
      { 'id': 'ticket2',
        'animStartOn': 'item3',

        'initial': { opacity: 0, left: '0%' },
        'animations': [
          {
            animate: { opacity: 1, },
            transition: { duration: 0.75, ease: 'easeInOut', delay: animDelay + 0.1 },
          },
        ],
      },
      { 'id': 'ticket3',
        'animStartOn': 'item3',

        'initial': { opacity: 0, left: '0%' },
        'animations': [
          {
            animate: { opacity: 1, },
            transition: { duration: 0.75, ease: 'easeInOut', delay: animDelay + 0.15 },
          },
          {
            animate: { left: '11%' },
            transition: { duration: 0.5, delay: 0.5 },
          },
        ],
      },
      { 'id': 'ticket4',
        'animStartOn': 'item3',

        'initial': { opacity: 0, left: '0%' },
        'animations': [
          {
            animate: { opacity: 1, },
            transition: { duration: 0.75, ease: 'easeInOut', delay: animDelay + 0.2},
          },
          {
            animate: { left: '11%' },
            transition: { duration: 0.5, delay: 0.5 },
          },
        ],
      },
      { 'id': 'ticket5',
        'animStartOn': 'item3',

        'initial': { opacity: 0, left: '0%' },
        'animations': [
          {
            animate: { opacity: 1, },
            transition: { duration: 0.75, ease: 'easeInOut', delay: animDelay + 0.25 },
          },
          {
            animate: { left: '26%' },
            transition: { duration: 0.75, delay: 0.5 },
          },
        ],
      },
      
      { 'id': 'ticket1LoadingBar',
        'animStartOn': 'item3',

        'initial': { opacity: 0, width: '0%' },
        'animations': [
          {
            animate: { opacity: 1, width: '11%'},
            transition: { duration: 1.75, ease: 'backInOut', delay: animDelay + 0.2 },
          }
        ],
      },
      { 'id': 'ticket2LoadingBar',
        'animStartOn': 'item3',

        'initial': { opacity: 0, width: '0%' },
        'animations': [
          {
            animate: { opacity: 1, width: '7%'},
            transition: { duration: 1.75, ease: 'backInOut', delay: animDelay + 0.25 },
          }
        ],
      },
      { 'id': 'ticket3LoadingBar',
        'animStartOn': 'item3',

        'initial': { opacity: 0, width: '0%' },
        'animations': [
          {
            animate: { opacity: 1, width: '15%'},
            transition: { duration: 1.75, ease: 'backInOut', delay: animDelay + 0.3 },
          }
        ],
      },
      { 'id': 'ticket4LoadingBar',
        'animStartOn': 'item3',

        'initial': { opacity: 0, width: '0%' },
        'animations': [
          {
            animate: { opacity: 1, width: '89%'},
            transition: { duration: 3.75, ease: 'backInOut', delay: animDelay + 0.35 },
          }
        ],
      },
      { 'id': 'ticket5LoadingBar',
        'animStartOn': 'item3',

        'initial': { opacity: 0, width: '0%' },
        'animations': [
          {
            animate: { opacity: 1, width: '74%'},
            transition: { duration: 3, ease: 'backInOut', delay: animDelay + 0.4 },
          }
        ],
      },

    // Version Control

  ]
  
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


  // Animation Sequence Hook
  useAnimationSequence(scope, animate, animationSequence, startAnimOn);


  return(<>
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '0 auto', gap: 'clamp(45px, 10vh, 125px)', paddingBottom: 'calc(2.5vh + 1rem)' }}>
      <Box ref={containerRef} sx={{ minHeight: '4000px', height: '300vh', }}>
        <Box ref={scope} sx={{ position: 'sticky', top: '9vh', display: 'grid', gap: '50px', }}>

          {/* Section Title */}
          <Box style={{ gridColumn: '1', gridRow: '1' }}>
            <h4 
              style={{ 
                textAlign:'center',
                letterSpacing: '2px',
                fontWeight: 'normal',
                fontSize:'clamp(22px, 5vw, 26px)'
              }}
            >
              I Turn <CustomChip>Ideas</CustomChip> into
            </h4>

            <h1
              style={{ 
                position:'relative',
                top:'-2px',
                textAlign: 'center',
                letterSpacing: '-2px',
                fontWeight: 'bold',
                fontSize: 'clamp(48px, 8vw, 60px)',
              }}
            >
              Achievable Web Apps
            </h1>
          </Box>


          {/* Container for timeline components */}
          <Box sx={{ position: 'sticky', top: '9vh', display: 'grid', gridTemplateColumns: (!isMobile) ?('unset') :('10vw max-content'), columnGap: '1vw' }}>

            {/* Timeline guide */}
            <Box
              style={{
                position: 'relative',
                top:'4px',
                gridColumn: '1', gridRow: '1',
                height: '100%', 
                transform: (!isMobile) ?'translateX(-3.5vw)': 'translateX(50%)',
              }}
            >
              <span 
                style={{
                  display:'inline-block',
                  height: `${scrollPercentage - 4}%`,
                  width: '5px',
                  backgroundColor: '#00304b',
                  borderRadius: '10px',
                }}
              />

              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'initial', position: 'absolute', top: '0%' }}
              >
                <motion.circle
                  cx={'-2px'}
                  cy={0}
                  r="10"
                  fill="#F9F7F4"
                  stroke="#00304B"
                  strokeWidth="5"
                />
              </svg>

              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'initial', position: 'absolute', top: '33%' }}
              >
                <motion.circle
                  cx={'-2px'}
                  cy={0}
                  r="10"
                  fill="#F9F7F4"
                  stroke="#00304B"
                  strokeWidth="5"
                />
              </svg>

              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'initial', position: 'absolute', top: '66%' }}
              >
                <motion.circle
                  cx={'-2px'}
                  cy={0}
                  r="10"
                  fill="#F9F7F4"
                  stroke="#00304B"
                  strokeWidth="5"
                />
              </svg>

            </Box>

            {/* Idea */}
            <motion.div
              id      = 'carouselItem_Idea'
              initial = {carouselItemAnimSettings.initial}
              style   = {{ position: 'relative', gridColumn: 2, gridRow: 1 }}
            >
              <LegendContainer title={'Idea'}>
                <p style={{ textAlign: 'center', fontSize:'24px', padding:'0 2rem' }}>
                  Develop and implement an interactive dashboard to fetch internal data for analysis
                </p>
              </LegendContainer>
            </motion.div>

            {/* Wireframe */}
            <motion.div
              id      = 'carouselItem_Wireframe'
              initial = {carouselItemAnimSettings.initial}
              style   = {{ position: 'relative', gridColumn: 2, gridRow: 1 }}
            >
              <LegendContainer title={'Wireframe'}>
                <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center' }}>

                <ResponsiveImage src="/images/wireframe-dashboard.png">
                  <Image
                    src={"/images/wireframe-dashboard.png"}
                    alt={"A Picture of Me, Reed!"}
                    draggable="false"
                    width={415}
                    height={286}
                    style={{
                      maxWidth:'415px',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      margin:'auto',
                      padding:'2vh 0 1.25vh'
                    }}
                  />
                </ResponsiveImage>

                </Box>
              </LegendContainer>
            </motion.div>

            {/* Agile Timeline */}
            <motion.div
              id      = 'carouselItem_AgileTimeline'
              initial = {carouselItemAnimSettings.initial}
              style   = {{ position: 'relative', gridColumn: 2, gridRow: 1 }}
            >
              <LegendContainer title={'Agile Timeline'} width='clamp(250px, 85vw, 815px)'>
                <Box 
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
                    {agileTimelineTickets.map((val, key) => {
                      return(
                        <motion.div
                          key         = { key }
                          id          = { val.id }
                          transition  = {{ duration: 0.75, ease: 'easeInOut' }}
                          style       = {{ position:'relative' }}
                        >
                          <TicketContainer 
                            ticketNum     = {key + 1}
                            size          = {val.size}
                            status        = {val.status}
                            text          = {val.text}
                            loadingBarId  = {val.loadingBarId} 
                          />
                        </motion.div>
                      )
                    })}
                  </Box>
                </Box>
              </LegendContainer>
            </motion.div>
          </Box>

        </Box>
      </Box>
    </Box>
  </>)
}

export default IdeasToWebApps;

