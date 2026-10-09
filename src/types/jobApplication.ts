export interface JobApplication {
  name: string
  email: string
  phone: string
  experience: number | ''
  expectedSalary: number | ''
  resume: File | null
  skills: string[]
}

export type JobApplicationErrors = Partial<Record<keyof JobApplication, string>>
