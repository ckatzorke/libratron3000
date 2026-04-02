<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import type { TooltipItem } from 'chart.js'
import type { Game } from '@/types/game'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps<{ games: Game[] }>()

const chartData = computed(() => {
  const counts = new Array(10).fill(0)
  let unrated = 0
  for (const g of props.games) {
    if (g.rating == null || g.rating === 0) {
      unrated++
    } else {
      const idx = Math.min(Math.max(Math.round(g.rating), 1), 10) - 1
      counts[idx]++
    }
  }

  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '—']
  const data = [...counts, unrated]

  // Color bars: low=red, mid=yellow, high=green, unrated=gray
  const backgroundColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
    '#4a4a6a'
  ]

  return {
    labels,
    datasets: [{
      label: 'Games',
      data,
      backgroundColor: backgroundColors,
      borderRadius: 4,
      borderSkipped: false
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items: TooltipItem<'bar'>[]) => {
          const label = items[0]?.label
          return label === '—' ? 'Unrated' : `Rating: ${label}`
        },
        label: (ctx: TooltipItem<'bar'>) => ` ${ctx.raw} game${(ctx.raw as number) !== 1 ? 's' : ''}`
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#9090a8' },
      grid: { color: 'rgba(255,255,255,0.05)' },
      title: {
        display: true,
        text: 'Rating (— = unrated)',
        color: '#9090a8',
        font: { size: 11 }
      }
    },
    y: {
      ticks: { color: '#9090a8', precision: 0 },
      grid: { color: 'rgba(255,255,255,0.08)' },
      beginAtZero: true
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
