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
::-webkit-scrollbar {
  width: 1em;
}
::-webkit-scrollbar-track {
  background: #121212;
}
::-webkit-scrollbar-thumb {
  background: #212121;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #1e1e1e;
}

html {
  overflow-y: auto;
}
</style>
