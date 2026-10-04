import { Box } from '@mui/material';
import { motion, MotionConfig, Variants } from 'motion/react';
import ChipCarousel from '@/components/elements/ChipCarousel/ChipCarousel';
import LegendContainer from '../LegendContainer/LegendContainer';
import { skillCategories } from '@/data/skills';

// Category card slides up, then its chips pop in one after another
const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: 'backInOut', delay: (i % 2) * 0.15, type: 'spring', bounce: 0, delayChildren: 0.35 + (i % 2) * 0.15, staggerChildren: 0.04 }
  })
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4, duration: 0.5 } }
};

const MySkills = () => {

  return (<>
    <Box data-analytics-section='skills' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '0 auto', gap: 'clamp(45px, 8vh, 90px)', paddingBottom: 'calc(4.5vh + 1rem)' }}>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '35px', width: '100%' }}>
        {/* Title */}
        <h1
          style={{
            position: 'relative',
            top: '-2px',
            textAlign: 'center',
            letterSpacing: '-2px',
            fontWeight: 'bold',
            fontSize: 'clamp(48px, 8vw, 60px)'
          }}
        >
          My Skills
        </h1>

        {/* Decorative marquee (static list below is the readable version), hidden on mobile */}
        {/* <Box aria-hidden='true' sx={{ '@media (max-width: 768px)': { display: 'none' } }}>
          <ChipCarousel
            rows        = {skillCategories.map((category) => category.skills)}
            directions  = {skillCategories.map((_, i) => (i % 2 === 0) ?('left') :('right'))}
            speeds      = {skillCategories.map((_, i) => [7, 5, 6, 4, 5][i % 5])}
            colors      = {skillCategories.map((category) => category.color)}
          />
        </Box> */}
      </Box>

      {/* Skills by Category */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '2.5rem',
          rowGap: '4rem',
          maxWidth: '1200px',
          padding: '0 1rem'
        }}
      >
        <MotionConfig reducedMotion='user'>
          {skillCategories.map((category, i) => (
            <motion.div
              key         = {category.title}
              custom      = {i}
              variants    = {categoryVariants}
              initial     = 'hidden'
              whileInView = 'visible'
              viewport    = {{ once: true, amount: 0.4 }}
            >
              <LegendContainer
                title={category.title}
                width='clamp(250px, 85vw, 520px)'
                paperColor={category.paperColor}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '0.5rem', justifyContent:'center' }}>
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={chipVariants}
                      style={{
                        backgroundColor: category.color,
                        color: 'white',
                        whiteSpace: 'nowrap',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        fontSize: '15px'
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </Box>
              </LegendContainer>
            </motion.div>
          ))}
        </MotionConfig>
      </Box>
    </Box>
  </>)
}


export default MySkills;
