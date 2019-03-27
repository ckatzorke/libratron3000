<template>
  <v-toolbar app flat class="transparent">
    <v-list class="pa-0">
      <v-list-tile avatar>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>{{ menuFlyoutDirection }}</v-icon>
        </v-btn>

        <v-list-tile-content>
          <v-list-tile-title>Choose your fate</v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>
    </v-list>
  </v-toolbar>
</template>
<script>
</script>
