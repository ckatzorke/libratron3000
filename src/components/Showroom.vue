<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col v-for="item in collection" :key="item.id" cols="12" xs="1" sm="4" md="3" lg="2">
        <div class="thumbnailcontainer">
          <img
            :src="coverBig(item.cover)"
            height="262px"
            width="185px"
            :title="isSold(item) ? 'sold at ' + prettyDate(item.sellDate) : ''"
            @mouseover="showTitle(item.id)"
            @mouseout="hideTitle(item.id)"
          />
          <div
            :id="item.id + '-title'"
            class="caption hidden"
            :title="item.title"
            >
            {{ caption(item.title) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { coverBig } from '@/service/igdb.js'
import { prettyDate } from '@/service/utils.js'

export default {
  components: {},
  data() {
    return {}
  },
  methods: {
    prettyDate(timestamp) {
      return prettyDate(timestamp)
    },
    coverBig(cover) {
      return coverBig(cover)
    },
    isSold(item) {
      if (item.sellDate) {
        return true
      }
      return false
    },
    caption(title) {
      if (title.length >= 28) {
        return title.substring(0, 24) + '...'
      }
      return title
    },
    showTitle(id) {
      console.log('Showing ', id)
      console.log('Classlist: ', document.getElementById(`${id}-title`).classList)
      document.getElementById(`${id}-title`).classList.remove('hidden')
    },
    hideTitle(id) {
      console.log('Hiding ', id)
      console.log('Classlist: ', document.getElementById(`${id}-title`).classList)
      document.getElementById(`${id}-title`).classList.add('hidden')
    }
  },
  computed: {
    displayCollection() {
      return this.$store.getters.getDisplayCollection
    },
    collection() {
      return this.$store.getters.getCollection
    }
  },
  created() {}
}
</script>
<style>
.thumbnailcontainer {
  position: relative;
  text-align: center;
  color: white;
}
.caption {
  position: absolute;
  bottom: 1px;
  left: 50%;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  color: #dbdad5;
  background-color: #302f2c;
  border: 1px solid black;
  border-radius: 3px;
  visibility: visible;
  white-space: nowrap;
  transform: translate(-50%);
}
.hidden {
  visibility: hidden;
}
</style>
