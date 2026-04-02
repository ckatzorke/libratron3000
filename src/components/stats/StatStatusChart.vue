<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { TooltipItem } from 'chart.js'
import type { Game } from '@/types/game'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ games: Game[] }>()

const chartData = computed(() => {
  const hundredPct = props.games.filter(g => g.hundredpercent).length
  const completed = props.games.filter(g => g.completed && !g.hundredpercent).length
  const notCompleted = props.games.length - completed - hundredPct

  return {
    labels: ['Not Completed', 'Completed', '100% Complete'],
    datasets: [{
      data: [notCompleted, completed, hundredPct],
      backgroundColor: ['#4a4a6a', '#22c55e', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#c0c0d0', boxWidth: 14, padding: 16 }
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'doughnut'>) => {
          const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0)
          const val = ctx.raw as number
          const pct = total > 0 ? Math.round((val / total) * 100) : 0
          return ` ${ctx.label}: ${val} (${pct}%)`
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 280px;
}
</style>
