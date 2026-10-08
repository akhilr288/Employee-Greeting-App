export interface Employee {
  name: string
  email: string
  phone: string
  gender: 'male' | 'female' | 'other' | ''
  department: string
  designation: string
  skills: string[]
  experience: number
  joiningDate: string
}
