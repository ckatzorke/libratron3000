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
import { Timestamp } from 'firebase/firestore'
import type { Game } from '@/types/game'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const props = defineProps<{
  games: Game[]
  selectedYear: string | number
}>()

const chartData = computed(() => {
  if (props.selectedYear !== 'all') {
    // Monthly breakdown for the selected year
    const year = Number(props.selectedYear)
    const counts = new Array(12).fill(0)
    for (const g of props.games) {
      if (!g.buydate) continue
      const d = (g.buydate as Timestamp).toDate()
      if (d.getFullYear() === year) counts[d.getMonth()]++
    }
    return {
      labels: MONTHS,
      datasets: [{
        label: `Games added in ${year}`,
        data: counts,
        backgroundColor: '#7C6FCD',
        borderRadius: 4,
        borderSkipped: false
      }]
    }
  } else {
    // Yearly totals across all years
    const counts: Record<number, number> = {}
    for (const g of props.games) {
      if (!g.buydate) continue
      const year = (g.buydate as Timestamp).toDate().getFullYear()
      counts[year] = (counts[year] ?? 0) + 1
    }
    const years = Object.keys(counts).map(Number).sort()
    return {
      labels: years.map(String),
      datasets: [{
        label: 'Games added',
        data: years.map(y => counts[y]),
        backgroundColor: '#7C6FCD',
        borderRadius: 4,
        borderSkipped: false
      }]
    }
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'>) => ` ${ctx.raw} game${(ctx.raw as number) !== 1 ? 's' : ''}`
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#9090a8' },
      grid: { color: 'rgba(255,255,255,0.05)' }
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
