export interface Employee {
  id: number
  name: string
  email: string
  department: string
  designation: string
  experience: number
  status: 'active' | 'inactive'
}

export type EmployeePayload = Omit<Employee, 'id'>

export interface ApiEmployee {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export type ApiEmployeePayload = Omit<ApiEmployee, 'id'>
