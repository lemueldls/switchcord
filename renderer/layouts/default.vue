<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({});
</script>

<style lang="scss">
html {
  overflow-y: auto;
}
</style>
