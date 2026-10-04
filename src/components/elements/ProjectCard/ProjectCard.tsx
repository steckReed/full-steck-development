'use client'

import { useState } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import LaunchIcon from '@mui/icons-material/Launch';
import { ProjectsProps } from '@/types/types';
import TagChips from '../TagChips/TagChips';

interface Props{
  project     : ProjectsProps;
  paperColor  ?: string;
}

const ProjectCard = ({
  project,
  paperColor = 'paper-navy'
}: Props) => {
  const [imageFailed, setImageFailed] = useState(false);

  return(
    <Box className={`paper ${paperColor}`} style={{ width:'100%', height:'100%' }}>
      <Box
        sx={{
          display:'grid',
          gridTemplateRows:'min-content auto',
          height:'100%',
          backgroundColor:'var(--color-cream)',
          border:'4px solid #242424',
          borderRadius:'12px',
          overflow:'hidden'
        }}
      >
        {/* Screenshot */}
        <Link href={project.url} target='_blank' rel='noopener noreferrer' tabIndex={-1} data-analytics={`${project.name} (screenshot)`}>
          <Box
            sx={{
              position:'relative',
              display:'grid',
              placeItems:'center',
              aspectRatio:'16 / 10',
              backgroundColor:'var(--color-stone)',
              borderBottom:'4px solid #242424'
            }}
          >
            {(project.image && !imageFailed) ? (
              <Image
                src={project.image}
                alt={`Screenshot of ${project.name}`}
                fill
                sizes='(max-width: 768px) 100vw, 400px'
                draggable='false'
                style={{ objectFit:'cover' }}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <p style={{ padding:'1rem', textAlign:'center', fontWeight:600, color:'#242424' }}>{project.name}</p>
            )}
          </Box>
        </Link>

        {/* Project Details (Name, Desc, etc.) */}
        <Box sx={{ display:'flex', flexDirection:'column', gap:'4px', padding:'12px 16px 16px' }}>
          <h3>
            <Link href={project.url} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none', color: 'inherit' }}>
              {project.name}
              <LaunchIcon sx={{ fontSize: '16px', paddingLeft: '4px' }} />
            </Link>
          </h3>

          <p>{project.desc}</p>

          {/* Tags */}
          {project.tags && <TagChips tags={project.tags} />}

          {/* GitHub & Reference Links */}
          {(project.github || project.referenceLink) && (
            <Box sx={{ display:'flex', gap:'16px', marginTop:'auto', paddingTop:'12px' }}>
              {project.github && (
                <Link href={project.github} target='_blank' rel='noopener noreferrer' style={{ color:'#242424' }}>GitHub</Link>
              )}
              {project.referenceLink && (
                <Link href={project.referenceLink} target='_blank' rel='noopener noreferrer' style={{ color:'#242424' }}>Reference Image</Link>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
};

export default ProjectCard;
