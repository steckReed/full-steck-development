'use client'

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { ProjectsProps } from '@/types/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LaunchIcon from '@mui/icons-material/Launch';
import statusColors from '@/functions/statusColors';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface SliderExtended extends Slider {
  slickPlay   : () => void;
  slickPause  : () => void;
}

const ProjectsCarousel = () => {

  const tagChipMap: { [key: string]: { label: string; color: string } } = {
    'nextjs': {
      label: 'Next.js',
      color: '#00304B',
    },
    'ai': {
      label: 'AI',
      color: '#B4573A',
    },
    'vector search': {
      label: 'Vector Search',
      color: '#3A6B6B',
    },
    'dnd': {
      label: 'Drag & Drop',
      color: '#525415',
    },
    'vite': {
      label: 'Vite',
      color: '#4c4066ff',
    },
    'html': {
      label: 'HTML',
      color: '#A5501A',
    },
    'scss': {
      label: 'SCSS',
      color: '#7D4156',
    },
    'js': {
      label: 'JavaScript',
      color: '#BF912E',
    },
  };

  const myProjects: ProjectsProps[] = [
    { name: 'Star Wars Unlimited: Vector Search',
      desc: 'Semantic Card Search and Filtering',
      ribbon: '',
      status: 'New',
      url: 'https://swu-vector-db.web.app/',
      tags: ['nextjs', 'ai', 'vector search'],
      // github: '',
    },
    { name: 'Star Wars Unlimited: Sealed Simulator',
      desc: 'Simulate Sealed Events With a Drag and Drop Interface',
      ribbon: '',
      status: 'New',
      url: 'https://swu-sealed.web.app/',
      tags: ['nextjs', 'dnd'],
      // github: '',
    },
    { name: 'Funky Color Picker Game',
      desc: 'Random Color Guesser Game',
      ribbon: 'Front-end',
      url: 'https://funky-color-picker-game.web.app/',
      github: 'https://github.com/steckReed/funky-color-picker-game',
      tags: ['vite'],
    },
    { name:'Planets Wallpaper',
      desc:'Image Re-Creation',
      ribbon:'Front-end',
      url:'https://steckreed.github.io/ReCreations/Planets%20Wallpaper/',
      github:'https://github.com/steckReed/ReCreations/tree/Minimalistic/Planets%20Wallpaper',
      referenceLink:'https://steckreed.github.io/ReCreations/Planets%20Wallpaper/reference-img.html',
      tags: ['html', 'scss', 'js'],
    },
    { name: 'Adventure Niagara Falls',
      desc: 'Image Re-Creation of Niagara Falls Logo Found On Mug',
      ribbon: 'Front-end',
      url: 'https://steckreed.github.io/ReCreations/Adventure%20Niagara%20Falls/',
      github: 'https://github.com/steckReed/ReCreations/tree/Minimalistic/Adventure%20Niagara%20Falls',
      tags: ['html', 'scss', 'js'],
    },
    { name: 'Casette Tape',
      desc: 'Image Re-Creation of a Casette',
      ribbon: 'Front-end',
      url: 'https://steckreed.github.io/ReCreations/Cassette%20Tape/',
      github: 'https://steckreed.github.io/ReCreations/Cassette%20Tape/',
      tags: ['html', 'scss', 'js'],
    },
    { name: 'Abstract Boho',
      desc: 'Image Re-Creation',
      ribbon: 'Front-end',
      url: 'https://steckreed.github.io/ReCreations/Abstract%20Boho%201/',
      referenceLink: 'https://steckreed.github.io/ReCreations/Abstract%20Boho%201/reference-img.html',
      github: 'https://github.com/steckReed/ReCreations/tree/Minimalistic/Abstract%20Boho%201',
      tags: ['html', 'scss', 'js'],
    },
    { name: 'D&D Character Creator',
      desc: 'Assist in Creation of D&D Character Sheets',
      ribbon: 'Full-stack',
      status: 'In Development',
      url: 'https://dnd-character-builder-3eb70.web.app/characters/new',
      // github: 'https://github.com/steckReed/dnd-character-creator',
      tags: ['nextjs'],
    },
  ];

  let sliderRef = useRef<SliderExtended>(null);
  const projectAnimDelay = 2.15;

  useEffect(() => {
    // On init, pause carousel
    sliderRef.current?.slickPause();

    // Play carousel after timeout
    const timer = setTimeout(() => {
      sliderRef.current?.slickPlay();
    }, (projectAnimDelay + myProjects.length/6) * 1000);

    // Cleanup func if component unmounts early
    return () => clearTimeout(timer);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const carouselSettings = {
    arrows: false,
    dots: true,
    focusOnSelect: true,
    centerMode: true,
    infinite: true,
    speed: 375,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2.25,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1.75,
        }
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box
      /* Following solution is to prevent carousel from calculating width wrong
          due to parent being a flex box. 

          https://github.com/akiran/react-slick/issues/1320#issuecomment-427359800
      */ 
      sx={{ minHeight: '0px', minWidth: '0px', width:'100vw' }}
    >
      <Slider ref={sliderRef} {...carouselSettings}>
        {myProjects.map((project: ProjectsProps, i:number)=>{ return(
          <div
            key={i} 
            style={{userSelect: 'none'}}
          >
            <motion.div
              key={i} 
              initial     = {{ opacity: 0, bottom:'-100px' }}
              animate     = {{ opacity: 1, bottom:'0' }}
              exit        = {{ opacity: 0 }}
              transition  = {{ duration: 0.75, ease: 'backInOut', delay: projectAnimDelay + i/6, type: 'spring', bounce:0 }}
              style={{
                display: 'grid',
                gridTemplateRows: 'min-content auto',
                position: 'relative',
                height:'450px',
                width:'100%',
                backgroundColor: 'white',
                boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
                borderRadius: '14px',
                overflow: 'hidden'
              }}
            >
              {/* Project Details (Name, Desc, etc.) */}
              <Box sx={{ display:'grid', minHeight:'115px' }}>
                <div style={{ gridColumn: 1, gridRow: 1, margin:'auto 0', padding:'12px 24px' }}>
                  <h2>
                    {project.name} 
                    <Link href={project.url} target='_blank' style={{ textDecoration: 'none', color: 'black', paddingLeft:'4px' }}>
                      <LaunchIcon sx={{ fontSize: '18px' }} />
                    </Link>
                  </h2>
                  
                  <p>{project.desc}</p>
                  
                  {/* Tags */}
                  {project.tags && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                      {project.tags.map((tag, tagIndex) => {
                        const chipData = tagChipMap[tag];
                        return chipData ? (
                          <span
                            key={tagIndex}
                            style={{
                              backgroundColor: chipData.color,
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: 500,
                            }}
                          >
                            {chipData.label}
                          </span>
                        ) : null;
                      })}
                    </Box>
                  )}
                </div>
                
                {/* Project Status */}
                {project?.status && (
                  <motion.div
                    initial={{ opacity: 0, right: '-100%', top: '-100%' }}
                    animate={{ opacity: 1, right: '12%', top: '14%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'backInOut', delay: projectAnimDelay + 0.75, type: 'spring', bounce: 0 }}
                    style={{
                      gridColumn: 1,
                      gridRow: 1,
                      position: 'absolute',
                      right: '-100px', top: '-100px',
                      height: 'min-content',
                      width: '100%',
                      backgroundColor: statusColors.get(project.status),
                      color: 'white',
                      borderRadius: '0 0 6px 6px',
                      padding: '0.5rem',
                      whiteSpace: 'nowrap',
                      transform: 'rotate(45deg) translate(50%, -50%)',
                      transformOrigin: 'top right',
                      textAlign:'center'
                    }}
                  >
                    <p> {project.status} </p>
                  </motion.div>
                )}
              </Box>

              {/* Iframe & GitHub Link */}
              <Box sx={{ display:'grid', borderRadius: 4, overflow:'hidden' }}>

                {/* GitHub Link */}
                {(project.github) && 
                  <motion.div 
                    initial     = {{ opacity: 0, right:'-100px' }}
                    animate     = {{ opacity: 1, right:'0' }}
                    exit        = {{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'backInOut', delay:projectAnimDelay + 0.5, type: 'spring', bounce:0 }}
                    style = {{ 
                      gridColumn:1, 
                      gridRow:1, 
                      position:'absolute', 
                      bottom:15, 
                      backgroundColor:'white', 
                      borderRadius:'6px 0 0 6px',
                      padding:'0.5rem'
                    }}
                  >
                    <Link href={project.github} target='_blank' style={{ textDecoration:'none', color:'black' }}>GitHub Link 🎉</Link>
                  </motion.div>
                }
                

                {/* Site Iframe */}
                <iframe src={project.url} style={{ gridColumn: 1, gridRow: 1, height: '100%', width: '100%' }} frameBorder="0"></iframe>
              </Box>
            </motion.div>
          </div>
        )})}
      </Slider>
    </Box>
  );
};

export default ProjectsCarousel;
