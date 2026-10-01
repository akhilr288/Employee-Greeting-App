<script setup lang="ts">
interface EmployeeSalary {
  id: number
  name: string
  designation: string
  basicSalary: number
  hra: number
  da: number
  bonus: number
  tax: number
  grossSalary: number
  taxAmount: number
  netSalary: number
}
defineProps<{
  employee: EmployeeSalary
}>()
</script>

<template>
  <article class="employee-card">
    <div class="employee-header">
      <div>
        <h3>{{ employee.name }}</h3>

        <p>
          {{ employee.designation }}
        </p>
      </div>

      <strong class="net-salary"> ₹{{ employee.netSalary.toLocaleString() }} </strong>
    </div>

    <div class="salary-breakdown">
      <div>
        <span>Basic</span>
        <strong> ₹{{ employee.basicSalary.toLocaleString() }} </strong>
      </div>

      <div>
        <span>HRA</span>
        <strong> ₹{{ employee.hra.toLocaleString() }} </strong>
      </div>

      <div>
        <span>DA</span>
        <strong> ₹{{ employee.da.toLocaleString() }} </strong>
      </div>

      <div>
        <span>Bonus</span>
        <strong> ₹{{ employee.bonus.toLocaleString() }} </strong>
      </div>

      <div>
        <span>Gross Salary</span>
        <strong> ₹{{ employee.grossSalary.toLocaleString() }} </strong>
      </div>

      <div>
        <span>Tax ({{ employee.tax }}%)</span>
        <strong class="tax"> - ₹{{ employee.taxAmount.toLocaleString() }} </strong>
      </div>
    </div>
  </article>
</template>
