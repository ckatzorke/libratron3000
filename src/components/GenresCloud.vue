<template>
  <div id="app">
    <v-wordcloud
      :data="genres"
      nameKey="name"
      valueKey="value"
      :color="myColors"
      :showTooltip="false"
      :wordClick="wordClickHandler"
      :font-size="[10,40]"
    ></v-wordcloud>
  </div>
</template>

<script>
import wordcloud from 'vue-wordcloud'

export default {
  components: {
    'v-wordcloud': wordcloud
  },
  props: ['genres'],
  methods: {
    wordClickHandler(name, value, vm) {
      // todo jump to filtered collection
      console.log('wordClickHandler', name, value, vm)
    }
  },
  data() {
    return {
      myColors: ['#FF9800', '#FB8C00', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FFF3E0']
    }
  }
}
</script>
