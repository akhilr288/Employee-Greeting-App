export interface Employee {
  id: number
  name: string
  email: string
  username: string
  address: string
  phone: string
  website: string
  company: string[]
}
export type EmployeePayload = Omit<Employee, 'id'>

export interface EmployeeAddress {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: {
    lat: string
    lng: string
  }
}

export interface EmployeeCompany {
  name: string
  catchPhrase: string
  bs: string
}

export interface ApiEmployee {
  id: number
  name: string
  email: string
  username: string
  address: EmployeeAddress
  phone: string
  website: string
  company: EmployeeCompany
}
export type ApiEmployeePayload = Omit<ApiEmployee, 'id'>
