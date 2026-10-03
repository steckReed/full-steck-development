'use client'

import { Box } from '@mui/material';
import { motion } from 'motion/react';
import Link from 'next/link';
import LaunchIcon from '@mui/icons-material/Launch';
import { myProjects } from '@/data/projects';
import useIsMobile from '@/functions/useIsMobile';
import LegendContainer from '../LegendContainer/LegendContainer';
import TagChips from '@/components/elements/TagChips/TagChips';

interface Props{
  animDelay?: number;
}

const ProjectHighlight = ({ animDelay = 2.15 }: Props) => {
  const isMobile = useIsMobile();
  const project = myProjects.find((project) => project.highlight);

  if (!project) return null;

  return(
    <motion.div
      initial     = {{ opacity: 0, bottom:'-100px' }}
      animate     = {{ opacity: 1, bottom:'0' }}
      exit        = {{ opacity: 0 }}
      transition  = {{ duration: 0.75, ease: 'backInOut', delay: animDelay, type: 'spring', bounce:0 }}
      style       = {{ position:'relative', width:'100%' }}
    >
      <LegendContainer title='Project Highlight' width='clamp(250px, 92vw, 1100px)'>
        <Box
          sx={{
            display:'grid',
            gridTemplateColumns: isMobile ?('1fr') :('3fr 2fr'),
            gap:'1.5rem',
            paddingTop:'0.5rem'
          }}
        >
          {/* Site Iframe */}
          <Box sx={{ height: isMobile ?('360px') :('450px'), border:'4px solid #242424', borderRadius:'12px', overflow:'hidden', backgroundColor:'white' }}>
            <iframe src={project.url} title={project.name} style={{ height: '100%', width: '100%' }} frameBorder='0'></iframe>
          </Box>

          {/* Project Details (Name, Summary, Features, etc.) */}
          <Box sx={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <h2>
              <Link href={project.url} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none', color: 'inherit' }}>
                {project.name}
                <LaunchIcon sx={{ fontSize: '18px', paddingLeft: '4px' }} />
              </Link>
            </h2>

            {project.summary && <p>{project.summary}</p>}

            {/* Key Features */}
            {project.features && (
              <ul style={{ display:'grid', gap:'6px', paddingLeft:'1.25rem' }}>
                {project.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}

            {/* Tags */}
            {project.tags && <TagChips tags={project.tags} />}

            {/* GitHub Link */}
            {project.github && (
              <Link href={project.github} target='_blank' rel='noopener noreferrer' style={{ color:'#242424' }}>GitHub Link 🎉</Link>
            )}
          </Box>
        </Box>
      </LegendContainer>
    </motion.div>
  )
}

export default ProjectHighlight;
