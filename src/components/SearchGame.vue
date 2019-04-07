<template>
  <v-dialog max-width="600px">
    <v-btn slot="activator" flat class="success">Add Game
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a new game</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3">
          <v-text-field label="title" ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {

}
</script>
