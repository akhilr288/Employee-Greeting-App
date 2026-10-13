export interface Employee {
  id: number
  name: string
  email: string
  phone: string
  gender: 'male' | 'female' | 'other' | ''
  department: string
  designation: string
  skills: string[]
  experience: number
  joiningDate: string
  status: 'active' | 'inactive'
}
