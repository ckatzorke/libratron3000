<template>
  <div class="chart-container">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { TooltipItem } from 'chart.js'
import type { Game } from '@/types/game'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ games: Game[] }>()

const COLORS = [
  '#06b6d4', '#2E5266', '#22c55e', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6', '#a855f7'
]

const chartData = computed(() => {
  const counts: Record<string, number> = {}
  for (const g of props.games) {
    for (const genre of g.genres ?? []) {
      if (genre) counts[genre] = (counts[genre] ?? 0) + 1
    }
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, 9)
  const otherCount = sorted.slice(9).reduce((sum, [, c]) => sum + c, 0)
  if (otherCount > 0) top.push(['Other', otherCount])

  return {
    labels: top.map(([name]) => name),
    datasets: [{
      data: top.map(([, count]) => count),
      backgroundColor: COLORS.slice(0, top.length),
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
      labels: { color: '#475569', boxWidth: 14, padding: 10 }
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'pie'>) => {
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
