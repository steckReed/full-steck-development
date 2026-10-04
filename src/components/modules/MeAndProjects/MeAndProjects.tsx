import { Box } from '@mui/material';
import HeroSection from '../HeroSection/HeroSection';
import ProjectHighlight from '../ProjectHighlight/ProjectHighlight';
import ProjectsAccordion from '../ProjectsAccordion/ProjectsAccordion';

const MeAndProjects = () => {
  return(<>
    <Box data-analytics-section='me_and_projects' sx={{ display: 'flex', minHeight:'100vh', flexWrap:'wrap', alignContent:'center', gap:'5.5vh', paddingBottom:'calc(4.5vh + 1rem)'}}>

      {/* Me */}
      <Box sx={{ width:'100%' }}>
        <HeroSection />
      </Box>

      {/* My Projects */}
      <ProjectHighlight />

      {/* More Projects */}
      <ProjectsAccordion />
    </Box>
  </>)
}

export default MeAndProjects;
