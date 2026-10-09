<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { JobApplication, JobApplicationErrors } from '../types/jobApplication'

const form = reactive<JobApplication>({
  name: '',
  email: '',
  phone: '',
  experience: '',
  expectedSalary: '',
  resume: null,
  skills: [],
})

const errors = ref<JobApplicationErrors>({})

function validateForm(): boolean {
  const newErrors: JobApplicationErrors = {}

  if (!form.name.trim()) {
    newErrors.name = 'Name is required.'
  }

  if (!form.email.trim()) {
    newErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    newErrors.email = 'Enter a valid email address.'
  }

  if (!form.phone.trim()) {
    newErrors.phone = 'Phone number is required.'
  }

  if (form.experience === '' || !Number.isFinite(form.experience) || form.experience < 1) {
    newErrors.experience = 'Minimum experience is 1 year.'
  }

  if (
    form.expectedSalary === '' ||
    !Number.isFinite(form.expectedSalary) ||
    form.expectedSalary <= 0
  ) {
    newErrors.expectedSalary = 'Expected salary must be positive.'
  }

  if (!form.resume) {
    newErrors.resume = 'Please upload your resume.'
  }

  if (form.skills.length < 2) {
    newErrors.skills = 'Select at least 2 skills.'
  }

  errors.value = newErrors

  return Object.keys(newErrors).length === 0
}

function handleSubmit() {
  if (!validateForm()) return

  console.log('Valid application:', { ...form })
  alert('Application is valid!')
}

const availableSkills = [
  'Vue',
  'React',
  'Angular',
  'TypeScript',
  'JavaScript',
  'Laravel',
  'PHP',
  'MySQL',
  'Docker',
]

function handleResumeChange(event: Event) {
  const input = event.target as HTMLInputElement
  form.resume = input.files?.[0] ?? null
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <div class="form-field">
      <label for="name">Full name</label>
      <input
        id="name"
        v-model.trim="form.name"
        type="text"
        autocomplete="name"
        :aria-invalid="!!errors.name"
        aria-describedby="name-error"
      />
      <p v-if="errors.name" id="name-error" class="error">
        {{ errors.name }}
      </p>
    </div>

    <div class="form-field">
      <label for="email">Email</label>
      <input
        id="email"
        v-model.trim="form.email"
        type="email"
        autocomplete="email"
        :aria-invalid="!!errors.email"
        aria-describedby="email-error"
      />
      <p v-if="errors.email" id="email-error" class="error">
        {{ errors.email }}
      </p>
    </div>

    <div class="form-field">
      <label for="phone">Phone number</label>
      <input
        id="phone"
        v-model.trim="form.phone"
        type="tel"
        autocomplete="tel"
        :aria-invalid="!!errors.phone"
        aria-describedby="phone-error"
      />
      <p v-if="errors.phone" id="phone-error" class="error">
        {{ errors.phone }}
      </p>
    </div>

    <div class="form-field">
      <label for="experience">Experience (years)</label>
      <input
        id="experience"
        v-model.number="form.experience"
        type="number"
        min="1"
        step="0.5"
        :aria-invalid="!!errors.experience"
        aria-describedby="experience-error"
      />
      <p v-if="errors.experience" id="experience-error" class="error">
        {{ errors.experience }}
      </p>
    </div>

    <div class="form-field">
      <label for="salary">Expected annual salary (INR)</label>
      <input
        id="salary"
        v-model.number="form.expectedSalary"
        type="number"
        min="0.01"
        step="any"
        :aria-invalid="!!errors.expectedSalary"
        aria-describedby="salary-error"
      />
      <p v-if="errors.expectedSalary" id="salary-error" class="error">
        {{ errors.expectedSalary }}
      </p>
    </div>

    <div class="form-field">
      <label for="resume">Resume (PDF)</label>
      <input
        id="resume"
        type="file"
        accept=".pdf,application/pdf"
        :aria-invalid="!!errors.resume"
        aria-describedby="resume-error"
        @change="handleResumeChange"
      />
      <p v-if="errors.resume" id="resume-error" class="error">
        {{ errors.resume }}
      </p>
    </div>

    <fieldset class="form-field">
      <legend>Skills (select at least 2)</legend>

      <label v-for="skill in availableSkills" :key="skill">
        <input v-model="form.skills" type="checkbox" :value="skill" />
        {{ skill }}
      </label>

      <p v-if="errors.skills" class="error">
        {{ errors.skills }}
      </p>
    </fieldset>

    <button type="submit">Submit application</button>
  </form>
</template>
