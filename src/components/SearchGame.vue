<template>
  <v-dialog >
    <v-btn slot="activator" flat class="success" right>
      <v-icon left flat>search</v-icon>
      Search
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>IGDB Search</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3">
          <v-text-field prepend-icon="search" label="title" ></v-text-field>
          <v-btn>search</v-btn>
        </v-form>
        <v-layout wrap row>
          <v-list>
            <v-list-tile v-for="result in results" :key="result.id">
              <v-list-tile-title>
                {{ result.name }}
              </v-list-tile-title>
              <v-list-tile-content>
                  {{ result.summary}}
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      results: [
        {
          'name': 'Test'
        },
        {
          'name': 'Test2'
        }
      ]
    }
  },
  methods: {
    search() {

    }
  }
}
</script>
