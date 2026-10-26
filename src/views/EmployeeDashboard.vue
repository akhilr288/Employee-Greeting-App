<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from 'vue'
import OverviewTab from '@/components/employee-tabs/OverviewTab.vue'
import ProjectsTab from '@/components/employee-tabs/ProjectsTab.vue'
import SkillsTab from '@/components/employee-tabs/SkillsTab.vue'
import TrainingTab from '@/components/employee-tabs/TrainingTab.vue'

const PerformanceTab = defineAsyncComponent({
  loader: () => import('@/components/employee-tabs/PerformanceTab.vue'),
  delay: 200,
  timeout: 10000,
})

const tabs = [
  { label: 'Overview', component: OverviewTab },
  { label: 'Projects', component: ProjectsTab },
  { label: 'Skills', component: SkillsTab },
  { label: 'Training', component: TrainingTab },
  { label: 'Performance', component: PerformanceTab },
] as const

const activeTab = ref('Overview')

const activeComponent = computed(() => {
  return tabs.find((tab) => tab.label === activeTab.value)!.component
})

const showHelp = ref(false)
</script>

<template>
  <main class="employee-dashboard">
    <header class="dashboard-header">
      <div>
        <h1>Employee Dashboard</h1>
        <p>View employee details and development progress.</p>
      </div>

      <button type="button" @click="showHelp = true">Dashboard Help</button>
    </header>

    <nav class="tab-list" aria-label="Employee dashboard tabs">
      <button
        v-for="tab in tabs"
        :key="tab.label"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.label"
        :class="{ active: activeTab === tab.label }"
        @click="activeTab = tab.label"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section class="tab-panel" role="tabpanel">
      <KeepAlive :max="5">
        <component :is="activeComponent" :key="activeTab" />
      </KeepAlive>
    </section>

    <Teleport to="body">
      <div v-if="showHelp" class="modal-backdrop">
        <section class="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
          <h2 id="help-title">Dashboard Help</h2>
          <p>
            Select a tab to view employee information. Your tab state is preserved while switching
            tabs.
          </p>
          <button type="button" @click="showHelp = false">Close</button>
        </section>
      </div>
    </Teleport>
  </main>
</template>
