'use client'

import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import { motion } from 'motion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { myProjects } from '@/data/projects';
import ProjectCard from '@/components/elements/ProjectCard/ProjectCard';

interface Props{
  animDelay?: number;
}

// Paper backdrop colors cycled through by card index
const paperColors = ['paper-plum', 'paper-navy', 'paper-rust', 'paper-olive', 'paper-grape', 'paper-mustard'];

const ProjectsAccordion = ({ animDelay = 2.5 }: Props) => {
  const otherProjects = myProjects.filter((project) => !project.highlight);

  return(
    <motion.div
      initial     = {{ opacity: 0, bottom:'-100px' }}
      animate     = {{ opacity: 1, bottom:'0' }}
      exit        = {{ opacity: 0 }}
      transition  = {{ duration: 0.75, ease: 'backInOut', delay: animDelay, type: 'spring', bounce:0 }}
      style       = {{ position:'relative', width:'clamp(250px, 92vw, 1100px)', margin:'0 auto' }}
    >
      <Accordion
        disableGutters
        elevation={0}
        TransitionProps={{ unmountOnExit: true }}
        sx={{
          backgroundColor:'var(--color-cream)',
          border:'4px solid #242424',
          borderRadius:'12px !important',
          overflow:'hidden',
          '&:before': { display:'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color:'#242424' }} />}>
          <h3 style={{ fontWeight:'normal' }}>
            More Projects ({otherProjects.length})
          </h3>
        </AccordionSummary>

        <AccordionDetails>
          {/* Projects Grid */}
          <Box
            sx={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
              gap:'2rem',
              padding:'0.5rem 1rem 2rem 0.5rem'
            }}
          >
            {otherProjects.map((project, i) => (
              <ProjectCard
                key={project.name}
                project={project}
                paperColor={paperColors[i % paperColors.length]}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </motion.div>
  )
}

export default ProjectsAccordion;
