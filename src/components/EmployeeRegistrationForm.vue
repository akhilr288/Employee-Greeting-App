<script setup lang="ts">
import { reactive } from 'vue'
import type { Employee } from '../types/employee'
import { departmentOptions, designationOptions, availableSkills } from '../constants/employeeData'

const form = reactive<Employee>({
  name: '',
  email: '',
  phone: '',
  gender: '',
  department: '',
  designation: '',
  skills: [],
  experience: 0,
  joiningDate: '',
})

function handleSubmit() {
  console.log('Employee registration:', {
    ...form,
    skills: [...form.skills],
  })

  resetForm()
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.gender = ''
  form.department = ''
  form.designation = ''
  form.skills = []
  form.experience = 0
  form.joiningDate = ''
}
</script>

<template>
  <form class="employee-form" @submit.prevent="handleSubmit">
    <h2>Employee Registration</h2>

    <div class="form-group">
      <label for="name">Name</label>

      <input id="name" v-model.trim="form.name" type="text" placeholder="Enter employee name" />
    </div>

    <div class="form-group">
      <label for="email">Email</label>

      <input id="email" v-model.trim="form.email" type="email" placeholder="employee@example.com" />
    </div>

    <div class="form-group">
      <label for="phone">Phone</label>

      <input id="phone" v-model.trim="form.phone" type="tel" placeholder="Enter phone number" />
    </div>

    <fieldset class="form-group">
      <legend>Gender</legend>

      <label>
        <input v-model="form.gender" type="radio" value="male" />
        Male
      </label>

      <label>
        <input v-model="form.gender" type="radio" value="female" />
        Female
      </label>

      <label>
        <input v-model="form.gender" type="radio" value="other" />
        Other
      </label>
    </fieldset>

    <div class="form-group">
      <label for="department"> Department </label>

      <select id="department" v-model="form.department">
        <option value="">Select department</option>

        <option
          v-for="department in departmentOptions"
          :key="department.value"
          :value="department.value"
        >
          {{ department.label }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="designation"> Designation </label>

      <select id="designation" v-model="form.designation">
        <option value="">Select designation</option>

        <option
          v-for="designation in designationOptions"
          :key="designation.value"
          :value="designation.value"
        >
          {{ designation.label }}
        </option>
      </select>
    </div>

    <fieldset class="form-group">
      <legend>Skills</legend>

      <label v-for="skill in availableSkills" :key="skill" class="checkbox-item">
        <input v-model="form.skills" type="checkbox" :value="skill" />

        {{ skill }}
      </label>
    </fieldset>

    <div class="form-group">
      <label for="experience"> Experience (Years) </label>

      <input id="experience" v-model.number="form.experience" type="number" min="0" max="50" />
    </div>

    <div class="form-group">
      <label for="joining-date"> Joining Date </label>

      <input id="joining-date" v-model="form.joiningDate" type="date" />
    </div>

    <div class="form-actions">
      <button type="button" @click="resetForm">Reset</button>

      <button type="submit">Register Employee</button>
    </div>
  </form>
</template>

<style scoped>
.employee-form {
  max-width: 760px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%);
  border: 1px solid #dbeafe;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(37, 99, 235, 0.08);
  display: grid;
  gap: 1.25rem;
}

.employee-form h2 {
  margin: 0;
  font-size: clamp(1.75rem, 2vw, 2.2rem);
  color: #0f172a;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label,
legend {
  font-weight: 600;
  color: #1f2937;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background-color: #ffffff;
  color: #0f172a;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

fieldset.form-group {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 1rem 1rem 0.75rem;
  background: rgba(255, 255, 255, 0.4);
}

fieldset.form-group legend {
  padding: 0 0.5rem;
}

fieldset.form-group label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.65rem;
  color: #374151;
  font-weight: 500;
}

fieldset.form-group label:last-child {
  margin-bottom: 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 500;
}

.checkbox-item input {
  width: auto;
  accent-color: #2563eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

button {
  border: none;
  border-radius: 12px;
  padding: 0.9rem 1.4rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button[type='button'] {
  background: #e2e8f0;
  color: #0f172a;
}

button[type='submit'] {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
}

@media (max-width: 640px) {
  .employee-form {
    margin: 1rem;
    padding: 1.25rem;
  }

  .form-actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
