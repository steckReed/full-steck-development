'use client'
import { Box } from '@mui/material';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DevelopmentVersionControl from '@/components/modules/DevelopmentVersionControl/DevelopmentVersionControl';
import IdeasToWebApps from '@/components/modules/IdeasToWebApps/IdeasToWebApps';
import MeAndProjects from '@/components/modules/MeAndProjects/MeAndProjects';
import AboutMe from '@/components/modules/AboutMe/AboutMe';
import MySkills from '@/components/modules/MySkills/MySkills';

export default function Home() {
  const [items, setItems] = useState(Array.from({ length: 1 })); // Start with 1 set of components

  const loadMore = () => {
    setItems(prevItems => [...prevItems, {}]); // Each empty object represents a repetition of the components
  };


  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={true}
      useWindow={true}
    >
      {items.map((_, index) => (        
        <Box key={index} sx={{ display:'flex', flexDirection:'column', gap:'5.5vh' }}>
          {/* Me & My Projects */}
          <MeAndProjects />

          {/* My Skills */}
          <MySkills/>

          {/* Ideas to Web Apps (Vertical Carousel) */}
          <IdeasToWebApps />

          {/* Development & Version Control */}
          <DevelopmentVersionControl />

          {/* About Me */}
          <AboutMe />
        </Box>
      ))}
    </InfiniteScroll>
  );
}
