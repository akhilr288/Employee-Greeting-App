import { z } from 'zod'

export const jobApplicationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .pipe(z.email('Enter a valid email address.')),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .regex(/^\+?[0-9\s()-]{10,20}$/, 'Enter a valid phone number.')
    .refine(
      (value) => value.replace(/\D/g, '').length >= 10,
      'Phone number must contain at least 10 digits.',
    ),

  experience: z.number('Experience is required.').finite().min(1, 'Minimum experience is 1 year.'),

  expectedSalary: z
    .number('Expected salary is required.')
    .finite()
    .positive('Expected salary must be positive.'),

  resume: z
    .file('Please upload your resume.')
    .refine((file) => file.type === 'application/pdf', 'Resume must be a PDF.')
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Resume must be 5 MB or smaller.'),

  skills: z.array(z.string()).min(2, 'Select at least 2 skills.'),
})

export type JobApplicationData = z.infer<typeof jobApplicationSchema>
