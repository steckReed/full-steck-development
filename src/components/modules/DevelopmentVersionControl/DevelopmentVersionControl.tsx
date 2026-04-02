'use client';

import { Box } from '@mui/material';
import { motion, useAnimate, useScroll, useTransform } from 'motion/react';
import { AnimationSequence } from '@/types/types';
import useAnimationSequence from '@/hooks/useAnimationSequence';
import useRefScrollPercentage from '@/hooks/useRefScrollPercentage';
import useIsMobile from '@/functions/useIsMobile';
import TicketContainer from '@/components/elements/TicketContainer/TicketContainer';
import GitHubIcon from '@mui/icons-material/GitHub';


const DevelopmentVersionControl = () => {
  const isMobile              = useIsMobile();
  const [scope, animate]      = useAnimate();
  const { scrollYProgress }   = useScroll({ target: scope })
  const scrollPercentage      = useRefScrollPercentage(scope);
  const mainBranchPath        = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Map Containing Animation Trigger Points
  const startAnimOn = new Map([
    // Default Enter of Element
    ['enter'        ,scrollPercentage > 0],


    // Branches
    ['rightBranch1' ,scrollPercentage > 25],
    ['leftBranch1'  ,scrollPercentage > 37],
    ['rightBranch2' ,scrollPercentage > 45],


    // Tickets
    ['floatingTicket1'    ,scrollPercentage > 20],
    ['floatingTicket2'    ,scrollPercentage > 30],
    ['rightBranch1Ticket' ,scrollPercentage > 40],
    ['leftBranch1Ticket'  ,scrollPercentage > 58],
    ['rightBranch2Ticket' ,scrollPercentage > 60],

    // Dashboard Release
    ['dashboardRelease'   ,scrollPercentage > 95],
  ])

  // Components Animation Sequence
  const animationSequence: AnimationSequence[] = [
    // Branches
    { 'id': 'right-branch-1',
      'animStartOn': 'rightBranch1',

      'initial': { opacity: 0 },
      'animations': [
        {
          animate: { opacity: 1 },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'center-branch-1',
      'animStartOn': 'enter',

      'initial': { opacity: 0 },
      'animations': [
        {
          animate: { opacity: 1 },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'left-branch-1',
      'animStartOn': 'leftBranch1',

      'initial': { opacity: 0 },
      'animations': [
        {
          animate: { opacity: 1 },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'right-branch-2',
      'animStartOn': 'rightBranch2',

      'initial': { opacity: 0 },
      'animations': [
        {
          animate: { opacity: 1 },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    
    
    // Tickets
    { 'id': 'floating-ticket-1',
      'animStartOn': 'floatingTicket1',

      'initial': { opacity: 0, display: 'none' },
      'animations': [
        {
          animate: { opacity: 1, display: 'block' },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'floating-ticket-2',
      'animStartOn': 'floatingTicket2',

      'initial': { opacity: 0, display: 'none' },
      'animations': [
        {
          animate: { opacity: 1, display: 'block' },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'right-branch-1-ticket',
      'animStartOn': 'rightBranch1Ticket',

      'initial': { opacity: 0, display: 'none' },
      'animations': [
        {
          animate: { opacity: 1, display: 'block' },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'left-branch-1-ticket',
      'animStartOn': 'leftBranch1Ticket',

      'initial': { opacity: 0, display: 'none' },
      'animations': [
        {
          animate: { opacity: 1, display: 'block' },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },
    { 'id': 'right-branch-2-ticket',
      'animStartOn': 'rightBranch2Ticket',

      'initial': { opacity: 0, display: 'none' },
      'animations': [
        {
          animate: { opacity: 1, display: 'block' },
          transition: { duration: 0.65, ease: 'easeInOut', delay: 0, },
        },
      ],
    },

    // Dashboard Release
    { 'id': 'dashboard-release',
      'animStartOn': 'dashboardRelease',

      'initial': { opacity: 0, top: '-125px', transform:'scale(0.75)' },
      'animations': [
        {
          animate: { opacity: 1, display: 'block', top: '-25px', transform: 'scale(1)' },
          transition: { duration: 0.75, ease: 'backInOut', delay: 0, },
        },
      ],
    },
  ];

  // Animation Sequence Hook
  useAnimationSequence(scope, animate, animationSequence, startAnimOn);

  /* Note for future self
    First array is % of scrollYProgress
    Second array is value const will be set to based on first array

    Paths value (second array) is based on percentage 0-100%
    Circle(X/Y) value (second array) is based on PX of svg
  */
  // Left Branch 1
  const leftBranch1_Path      = useTransform(scrollYProgress, [0.25, 0.95]        ,[0, 1]);
  const leftBranch1_CircleX   = useTransform(scrollYProgress, [0.25, 0.40, 0.42]  ,[66, 0, 2]);
  const leftBranch1_CircleY   = useTransform(scrollYProgress, [0.25, 0.40, 0.6]   ,[14, 130, 320]);

  // Center Branch 1
  const centerBranch1_Path    = useTransform(scrollYProgress, [0, 1]              ,[0, 1]);
  const centerBranch1_CircleY = useTransform(scrollYProgress, [0, 1]              ,[0, 877]);

  // Right Branch 1
  const rightBranch1_Path     = useTransform(scrollYProgress, [0.15, 0.40]        ,[0, 1]);
  const rightBranch1_CircleX  = useTransform(scrollYProgress, [0.15, 0.25, 1.00]  ,[12, 76, 76]);
  const rightBranch1_CircleY  = useTransform(scrollYProgress, [0.15, 0.25, 0.29]  ,[14, 84, 136]);


  // Right Branch 2
  const rightBranch2_Path     = useTransform(scrollYProgress, [0.32, 0.85]        ,[0, 1]);
  const rightBranch2_CircleX  = useTransform(scrollYProgress, [0.32, 0.46, 1.00]  ,[76, 140, 140]);
  const rightBranch2_CircleY  = useTransform(scrollYProgress, [0.32, 0.46, 0.55]  ,[0, 125, 230]);

  
  return(<>
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '0 auto', gap: 'clamp(45px, 10vh, 125px)', paddingBottom: 'calc(2.5vh + 1rem)' }}>
      <Box ref={scope} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '4000px', height: '300vh', gap: 'clamp(45px, 8vh, 125px)'}}>
        {/* Section Title */}
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

        {/* Branch & Ticket Structure */}
        <Box sx={{ position:'relative', display:'flex', height: '100%', transform:'translateX(14%)' }}>

          {/* Left Side Branches */}
          <Box sx={{ position: 'sticky', top: '10vh', display: 'grid', height: 'min-content', transform:'translateX(15px)'}}>
            {/* Floating Tickets */}
            <Box
              sx={{
                position: 'absolute',
                display:'grid',
                gap:'clamp(10px, 1.5vh, 24px)',
                width: 'max-content',
                left: 'clamp(18px, 1.5vw, 75px)',
                top: '50px',
                transform: 'translate(calc(-100% - 3.5vw), -50%)',
              }}
            >
              {/* Floating Ticket 1 */}
              <motion.div
                id          = 'floating-ticket-1'
                initial     = {{ opacity: 0, display: 'none' }}
                transition  = {{ duration: 0.75, ease: 'backInOut' }}
              >
                <TicketContainer
                  ticketNum = {1}
                  status    = {'completed'}
                  text      = {'Drag & Drop Package'}
                />
              </motion.div>

              {/* Floating Ticket 2 */}
              <motion.div
                id          = 'floating-ticket-2'
                initial     = {{ opacity: 0, display: 'none' }}
                transition  = {{ duration: 0.75, ease: 'backInOut' }}
              >
                <TicketContainer
                  ticketNum = {'2'}
                  status    = {'completed'}
                  text      = {'Charting Package'}
                />
              </motion.div>
            </Box>


            {/* Left Branch 1 Ticket */}
            <motion.div
              id          = 'left-branch-1-ticket'
              initial     = {{ opacity: 0, display: 'none' }}
              transition  = {{ duration: 0.75, ease: 'backInOut' }}
              style={{
                position: 'absolute',
                width: 'max-content',
                left: leftBranch1_CircleX,
                top: leftBranch1_CircleY,
                transform:'translate(calc(-100% - 3.5vw), -50%)',
                display:'none'
              }}
            >
              <TicketContainer
                ticketNum = {'4'}
                status    = {'completed'}
                text      = {'Build Drag & Drop Layout'}
              />
            </motion.div>

            {/* Left Branch 1 */}
            <motion.svg 
              id='left-branch-1'
              width="77" height="633" viewBox="0 0 77 633" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: 'initial' }}
              initial={{ opacity:0 }}
            >
              {/* Left Branch Path */}
              <motion.path
                d="M75 2.47437L5.01064 115.153C3.04282 118.321 2.00002 121.976 2.00002 125.706L2.00001 530.513C2.00001 534.969 3.48827 539.298 6.22862 542.812L74.9999 631"
                stroke="#00304B"
                strokeWidth="4" 
                strokeLinecap="round"
                style={{ pathLength: leftBranch1_Path }}
              />

              {/* Left Branch Circle */}
              <motion.circle
                cx={leftBranch1_CircleX}
                cy={leftBranch1_CircleY}
                r="10"
                fill="#F9F7F4"
                stroke="#00304B"
                strokeWidth="5"
              />
            </motion.svg>

            {/* Gross */}
            <span style={{height:'70px'}}/>
          </Box>
          

          {/* Main Branch */}
          <Box sx={{ position: 'sticky', top: '0vh', display: 'grid', flexDirection: 'column', height: 'min-content', alignItems:'center', zIndex:1 }}>
            <motion.svg 
              id='center-branch-1'
              width="30" height="877" viewBox="0 0 6 877" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ zIndex: '1', overflow: 'initial' }}
              initial={{ opacity: 0 }}
            >
              <motion.path
                d="M3 3L2.99996 874" 
                stroke="black" 
                strokeWidth="5" 
                strokeLinecap="round" 
                style={{ pathLength: centerBranch1_Path }}
              />
              <motion.circle
                cx="3"
                cy={centerBranch1_CircleY}
                r="10.5"
                stroke="black"
                strokeWidth="7"
                fill="#F9F7F4" 
              />
            </motion.svg>


            {/* Branch Circle */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            </svg>
          </Box>


          {/* Right Side Branches */}
          <Box sx={{ position: 'sticky', top: '8vh', display: 'grid', height:'min-content', transform:'translateX(-15px)' }}>

            {/* Right Branch 1 */}
            <motion.svg
              id='right-branch-1'
              width="77" height="256" viewBox="0 0 77 256" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ zIndex: '1', overflow: 'initial' }}
              initial={{ opacity:0 }}
            >
              {/* Right Branch Path */}
              <motion.path 
                d="M2.00024 1.88501L69.6349 74.4956C73.0831 78.1974 75.0003 83.0684 75.0003 88.1274L75.0003 172.422C75.0003 177.726 72.8931 182.813 69.1424 186.564L2.00001 253.706"
                stroke="#BF912E" 
                fill="transparent"
                strokeWidth="4" 
                strokeLinecap="round"
                style={{ pathLength: rightBranch1_Path }}
              />

              {/* Right Branch Circle */}
              <motion.circle 
                cx={rightBranch1_CircleX}
                cy={rightBranch1_CircleY} 
                r="10" 
                fill="#F9F7F4" 
                stroke="#BF912E" 
                strokeWidth="5" 
              />
            </motion.svg>
            
            {/* Right Branch 1 Ticket */}
            <motion.div
              id          = 'right-branch-1-ticket'
              initial     = {{ opacity: 0, display: 'none' }}
              transition  = {{ duration: 0.75, ease: 'backInOut' }}
              style={{
                position: 'absolute',
                width: 'max-content',
                left: rightBranch1_CircleX,
                top: rightBranch1_CircleY,
                transform: (!isMobile)
                  ? 'translate(calc(0% + 3.5vw), -50%)'
                  : 'translate(-50%, calc(-135% - 1.5vh))',
                zIndex:1
              }}
            >
              <TicketContainer
                ticketNum = {'3'}
                status    = {'completed'}
                text      = {'Fetch Data From Source'}
              />
            </motion.div>



            {/* Right Branch 2 */}
            <Box sx={{ position: 'relative', top: '-120px' }}>
            <motion.svg
              id='right-branch-2'
              width="142" height="457" viewBox="0 0 142 457" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{  overflow: 'initial' }}
              initial={{ opacity: 0 }}
            >
              {/* Right Branch Path */}
              <motion.path
                d="M74.2612 2L137.612 119.733C139.18 122.646 140 125.902 140 129.21L140 334.415C140 340.475 137.253 346.208 132.529 350.004L2.00002 454.909"
                stroke="#525415"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: rightBranch2_Path }}
              />

              {/* Right Branch Circle */}
              <motion.circle
                cx={rightBranch2_CircleX}
                cy={rightBranch2_CircleY}
                r="10"
                fill="#F9F7F4"
                stroke="#525415"
                strokeWidth="5"
              />
            </motion.svg>

            {/* Right Branch 2 Ticket */}
            <motion.div
              id          = 'right-branch-2-ticket'
              initial     = {{ opacity: 0, display: 'none' }}
              transition  = {{ duration: 0.75, ease: 'backInOut' }}
              style={{
                position: 'absolute',
                width: 'max-content',
                left: rightBranch2_CircleX,
                top: rightBranch2_CircleY,
                transform: (!isMobile) 
                  ? 'translate(calc(0% + 3.5vw), -50%)'
                  : 'translate(calc(-100% - 3.5vw), -50%)'
              }}
            >
              <TicketContainer
                ticketNum = {'5'}
                status    = {'completed'}
                text      = {'Implement Charts in Layout'}
              />
            </motion.div>
            </Box>
          </Box>

        </Box>



        {/* Temp component until dashboard is created */}
        <motion.div
          id='dashboard-release'
          initial={{ opacity: 0, top: '-125px', transform: 'scale(0.75)' }}
          style={{ position:'relative' }}
        >
          <div className='shadow'
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#242424',
              borderRadius: '12px',
              // height: '40px',
              // padding: '0 2.5rem',
              padding: '0.5rem 4.5rem',
              width: 'min-content'
            }}
          >
          <h4
            style={{
              margin: 0,
              padding: 0,
              color: 'white',
              fontWeight: 'normal',
              whiteSpace: 'nowrap',
              // fontSize: '25px',
              fontSize: '45px'
            }}
          >
            Release
          </h4>
          </div>
        </motion.div>

      </Box>
    </Box>
  </>)
};

export default DevelopmentVersionControl;

