import { Box } from '@mui/material';
import ChipCarousel from '@/components/elements/ChipCarousel/ChipCarousel';
 
const MySkills = () => {
  const skillsData = [
    ['PHP', 'Next.js', 'React', 'Express', 'Vite', 'ASP.NET', 'Bootstrap', 'Tailwind', 'MUI', 'Framer Motion', 'React Query', 'Selenium', 'dnd kit', 'Websockets', 'Front-End Development', 'Back-End Development', 'Responsive Design', 'UI / UX', 'Wireframing'],
    
    ['Microsoft Azure', 'Azure Functions', 'Azure Logic Apps', 'Azure DevOps', 'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS', 'SCSS', 'Shell Script', 'MSSQL (T-SQL)', 'NoSQL', 'Docker', 'Git', 'GitHub', 'VSCode', 'Google Firebase'],
    
    ['Monday.com', 'Jira', 'Figma', 'Adobe XD', 'Excel/Sheets', 'PowerPoint/Slides', 'Word/Docs', 'Outlook', 'Teams']
  ];

  return (<>
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '0 auto', gap: 'clamp(45px, 10vh, 125px)', paddingBottom: 'calc(4.5vh + 1rem)' }}>

      <Box sx={{ position: 'sticky', top: '9vh', display: 'grid', gap: '35px', }}>
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

        <ChipCarousel
          rows        = {skillsData}
          directions  = {['left', 'right', 'left']}
          speeds      = {[11, 7, 9]}
          colors      = {['#00304B', '#A5501A', '#525415']}
        />

      </Box>
    </Box>
  </>)
}


export default MySkills;
