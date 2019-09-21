<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col v-for="item in collection" :key="item.id" cols="2" xs="6" sm="6" md="4" lg="3">
        <div class="thumbnailcontainer">
          <img
            :src="coverBig(item.cover)"
            height="374px"
            width="264px"
            :title="isSold(item) ? 'sold at ' + prettyDate(item.sellDate) : ''"
          />
          <div class="caption" :title="item.title">{{ caption(item.title) }}</div>
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
      if (title.length >= 32) {
        return title.substring(0, 28) + '...'
      }
      return title
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
  transform: translate(-50%);
}
</style>
