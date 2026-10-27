<script setup lang="ts">
import { computed, ref } from 'vue'
import vFocus from '@/directives/focus'

interface Task {
  id: number
  title: string
  completed: boolean
}

const taskInput = ref('')
const tasks = ref<Task[]>([
  { id: 1, title: 'Review Vue transitions', completed: false },
  { id: 2, title: 'Practice custom directives', completed: true },
  { id: 3, title: 'Build the task manager', completed: false },
])

let nextId = 4

const remainingCount = computed(() => tasks.value.filter((task) => !task.completed).length)

function addTask() {
  const title = taskInput.value.trim()

  if (!title) return

  tasks.value.push({
    id: nextId++,
    title,
    completed: false,
  })

  taskInput.value = ''
}

function deleteTask(id: number) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

function toggleTask(task: Task) {
  task.completed = !task.completed
}

function moveTask(index: number, direction: -1 | 1) {
  const targetIndex = index + direction

  if (targetIndex < 0 || targetIndex >= tasks.value.length) return

  const [task] = tasks.value.splice(index, 1)
  tasks.value.splice(targetIndex, 0, task)
}
</script>

<template>
  <main class="task-manager">
    <header class="task-header">
      <div>
        <h1>Task Manager</h1>
        <p>Organize your work with animated task updates.</p>
      </div>

      <span class="task-count"> {{ remainingCount }} remaining </span>
    </header>

    <form class="task-form" @submit.prevent="addTask">
      <label class="sr-only" for="new-task">New task</label>

      <input
        id="new-task"
        v-model="taskInput"
        v-focus
        type="text"
        placeholder="What needs to be done?"
        maxlength="200"
        required
      />

      <button type="submit">Add task</button>
    </form>

    <p v-if="tasks.length === 0" class="empty-state">No tasks yet. Add your first task above.</p>

    <TransitionGroup v-else name="task-list" tag="ul" class="task-list" aria-label="Tasks">
      <li
        v-for="(task, index) in tasks"
        :key="task.id"
        class="task-item"
        :class="{ completed: task.completed }"
      >
        <input
          :id="`task-${task.id}`"
          type="checkbox"
          :checked="task.completed"
          :aria-label="`Complete ${task.title}`"
          @change="toggleTask(task)"
        />

        <label :for="`task-${task.id}`" class="task-title">
          {{ task.title }}
        </label>

        <div class="task-actions">
          <button
            type="button"
            :disabled="index === 0"
            :aria-label="`Move ${task.title} up`"
            @click="moveTask(index, -1)"
          >
            ↑
          </button>

          <button
            type="button"
            :disabled="index === tasks.length - 1"
            :aria-label="`Move ${task.title} down`"
            @click="moveTask(index, 1)"
          >
            ↓
          </button>

          <button
            type="button"
            class="delete-button"
            :aria-label="`Delete ${task.title}`"
            @click="deleteTask(task.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </TransitionGroup>

    <Transition name="success">
      <p v-if="tasks.length > 0 && remainingCount === 0" class="success-message">
        All tasks completed. Great work!
      </p>
    </Transition>
  </main>
</template>
