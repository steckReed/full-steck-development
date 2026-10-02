import { Box } from '@mui/material';
import HeroSection from '../HeroSection/HeroSection';
import ProjectsCarousel from '../ProjectsCarousel/ProjectsCarousel';

const MeAndProjects = () => {
  return(<>
    <Box sx={{ display: 'flex', minHeight:'100vh', flexWrap:'wrap', alignContent:'center', gap:'5.5vh', paddingBottom:'calc(4.5vh + 1rem)'}}>

      {/* Me */}
      <Box sx={{ width:'100%' }}>
        <HeroSection />
      </Box>
      
      {/* My Projects */}
      <ProjectsCarousel/>
    </Box>
  </>)
}

export default MeAndProjects;
