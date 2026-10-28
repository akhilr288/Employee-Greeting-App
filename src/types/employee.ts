export interface Employee {
  id: number
  name: string
  email?: string
  designation: string
  department: string
  experience: number
  status: boolean | 'active' | 'inactive'
  skills?: string[]
}

export type EmployeePayload = Omit<Employee, 'id' | 'skills'> & {
  email: string
  status: 'active' | 'inactive'
}

export interface ApiEmployee {
  id: number
  name: string
  email: string
  username: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: { lat: string; lng: string }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export type EmployeeServiceResult =
  | ApiEmployee[]
  | { data: ApiEmployee[] | Employee[] }
