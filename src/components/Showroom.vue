<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col v-for="item in collection" :key="item.id" cols="3" xs="2" sm="3" md="2" lg="2">
        <div class="thumbnailcontainer hidden-xs-only">
          <img
            :data-src="coverBig(item.cover)"
            class="lozad cover"
            height="182px"
            width="159px"
            :title="isSold(item) ? 'sold at ' + prettyDate(item.sellDate) : ''"
            @mouseover="showTitle(item.id)"
            @mouseout="hideTitle(item.id)"
            @click="showDetails(item.id)"
          />
          <div
            :id="item.id + '-title'"
            class="titlecaption hidden"
            :title="item.title"
            >
            {{ caption(item.title) }}
          </div>
        </div>
        <div class="thumbnailcontainer hidden-sm-and-up">
          <img
            :data-src="coverBig(item.cover)"
            class="lozad coverxs"
            height="91px"
            width="80px"
            :title="isSold(item) ? 'sold at ' + prettyDate(item.sellDate) : ''"
            @mouseover="showTitle(item.id)"
            @mouseout="hideTitle(item.id)"
            @click="showDetails(item.id)"
          />
          <div
            :id="item.id + '-title'"
            class="titlecaption hidden"
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
import lozad from 'lozad'
import { coverBig } from '@/service/igdb.js'
import { prettyDate } from '@/service/utils.js'

let observer = null

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
      // console.log('Showing ', id)
      // console.log('Classlist: ', document.getElementById(`${id}-title`).classList)
      document.getElementById(`${id}-title`).classList.remove('hidden')
    },
    showDetails(id) {
      this.$router.push(`/details/${id}`)
    },
    hideTitle(id) {
      // console.log('Hiding ', id)
      // console.log('Classlist: ', document.getElementById(`${id}-title`).classList)
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
  mounted() {
    observer = lozad()
    observer.observe()
  }
}
</script>
<style>
.thumbnailcontainer {
  position: relative;
  text-align: center;
  color: white;
}
img.cover {
  display: block;
  max-width: 159px;
  max-height: 182px;
  width: auto;
  height: auto;
}
img.coverxs {
  display: block;
  max-width: 80px;
  max-height: 91px;
  width: auto;
  height: auto;
}
.titlecaption {
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
