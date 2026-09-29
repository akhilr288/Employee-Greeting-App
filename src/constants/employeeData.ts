import type { Employee } from '../types/employee'

export const departments = ['All', 'Engineering', 'Design', 'QA']

export const employees: Employee[] = [
  {
    id: 1,
    name: 'Akhil R',
    designation: 'Software Engineer',
    department: 'Engineering',
    experience: 12,
    skills: ['Vue.js', 'React', 'Angular', 'TypeScript', 'Laravel', 'Tailwind CSS'],
    status: true,
  },
  {
    id: 2,
    name: 'Abhilash',
    designation: 'UI/UX Designer',
    department: 'Design',
    experience: 10,
    status: true,
    skills: ['Figma', 'Adobe XD', 'Illustrator'],
  },
  {
    id: 3,
    name: 'Nithin S',
    designation: 'Backend Developer',
    department: 'Engineering',
    experience: 7,
    status: false,
    skills: ['Laravel', 'MySQL', 'Redis'],
  },
  {
    id: 4,
    name: 'Asha',
    designation: 'QA Engineer',
    department: 'QA',
    experience: 2,
    status: true,
    skills: ['Cypress', 'Vitest', 'Playwright'],
  },
]
