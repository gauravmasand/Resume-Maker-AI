import { ResumeData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const initialResumeData: ResumeData = {
  name: 'Alex Chen',
  email: 'alex.chen@email.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'linkedin.com/in/alex-chen-dev',
  github: 'github.com/alexchen-dev',
  portfolio: 'alexchen.dev',
  summary: 'Results-driven Software Development Engineer with 2 years of experience in designing, developing, and deploying scalable web applications. Proficient in TypeScript, React, and Node.js, with a proven track record of optimizing application performance by over 25% and leading small project teams to successful delivery. Seeking to leverage expertise in cloud-native technologies and distributed systems to contribute to a MAANG-level organization.',
  experience: [
    {
      id: uuidv4(),
      role: 'Software Development Engineer',
      company: 'Innovatech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jun 2022',
      endDate: 'Present',
      description: [
        'Engineered a multi-tenant SaaS platform using React and Node.js, reducing API response times by 300ms (a 40% improvement) through performance profiling and query optimization.',
        'Architected and implemented a CI/CD pipeline with GitHub Actions and AWS, decreasing deployment time by 75% and improving developer productivity.',
        'Spearheaded the integration of a third-party payment gateway, processing over $500K in transactions within the first quarter post-launch.',
      ],
    },
     {
      id: uuidv4(),
      role: 'Software Engineer Intern',
      company: 'Data Dynamics',
      location: 'Palo Alto, CA',
      startDate: 'May 2021',
      endDate: 'Aug 2021',
      description: [
        'Developed and tested new features for a data visualization dashboard using D3.js, resulting in a 15% increase in user engagement.',
        'Collaborated with a senior engineer to migrate legacy code from vanilla JavaScript to React, improving code maintainability and reducing the bug rate by 20%.',
      ],
    },
  ],
  education: [
    {
      id: uuidv4(),
      degree: 'Bachelor of Engineering in Computer Science',
      university: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: 'Aug 2018',
      endDate: 'May 2022',
      gpa: '3.8/4.0',
    },
  ],
  projects: [
    {
      id: uuidv4(),
      name: 'Real-Time Collaborative Code Editor',
      technologies: 'React, TypeScript, WebSockets, Node.js, Monaco Editor',
      description: [
        'Built a web-based code editor that allows multiple users to edit and run code simultaneously, supporting 5+ programming languages.',
        'Implemented Operational Transformation algorithms to ensure conflict-free, real-time synchronization of text edits for a seamless user experience.',
      ],
    },
  ],
  skills: {
    languages: 'TypeScript, JavaScript, Python, SQL',
    frameworks: 'React, Node.js, Express.js, Tailwind CSS',
    developerTools: 'Git, GitHub Actions, Docker, AWS (EC2, S3, Lambda), Jira',
    libraries: 'Redux, D3.js, Jest, React Testing Library',
  },
};
