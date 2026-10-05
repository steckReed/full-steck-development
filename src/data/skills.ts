export interface SkillCategory {
  title       : string;
  color       : string;
  paperColor  : string;
  skills      : string[];
}

export const skillCategories: SkillCategory[] = [
  { title: 'Front-end',
    color: 'var(--color-navy)',
    paperColor: 'paper-navy',
    skills: ['Next.js', 'React', 'Vite', 'MUI', 'Tailwind', 'Bootstrap', 'Framer Motion', 'TanStack Query', 'dnd kit', 'Responsive Design'],
  },
  { title: 'Back-end',
    color: 'var(--color-rust)',
    paperColor: 'paper-rust',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Kysely', 'Zod', 'ASP.NET', 'Websockets', 'MSSQL (T-SQL)', 'NoSQL'],
  },
  { title: 'Cloud & Infra',
    color: 'var(--color-grape)',
    paperColor: 'paper-grape',
    skills: ['AWS Lambda', 'AWS Aurora', 'DynamoDB', 'AWS Cognito', 'AWS S3', 'SST (IaC)', 'Microsoft Azure', 'Azure Functions', 'Azure Logic Apps', 'Google Firebase', 'Docker'],
  },
  { title: 'Languages',
    color: 'var(--color-plum)',
    paperColor: 'paper-plum',
    skills: ['TypeScript', 'JavaScript', 'Python', 'PHP', 'HTML', 'CSS', 'SCSS', 'Shell Script'],
  },
  { title: 'Tools & Design',
    color: 'var(--color-olive)',
    paperColor: 'paper-olive',
    skills: ['Git', 'GitHub', 'Azure DevOps', 'VSCode', 'Selenium', 'Jira', 'Monday.com', 'Figma', 'Adobe XD', 'UI / UX', 'Wireframing'],
  },
];
