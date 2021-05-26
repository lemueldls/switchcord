<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="submit"
      >
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>SwitchCord</v-toolbar-title>
          </v-toolbar>

          <v-card-subtitle>
            Discord Rich Presence for Nintendo Switch Games
          </v-card-subtitle>

          <v-divider />

          <v-card-text>
            <v-autocomplete
              v-model="game"
              :disabled="loadingGames"
              :items="gamesList"
              label="Select a Game"
              item-text="name"
              item-value="pic"
              :rules="[v => !!v || 'A Game is required']"
              solo
              required
            >
              <template #item="{ item }">
                <v-list>
                  <!-- <v-list-item-avatar tile>
                    <v-img :alt="item.name" :src="item.pic" />
                  </v-list-item-avatar> -->

                  {{ item.name }}
                </v-list>
              </template>
            </v-autocomplete>

            <v-text-field v-model="description" label="Status Description" />

            <v-checkbox v-model="time" label="Show Time Elapsed" />
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" block type="submit">Submit</v-btn>

            <v-snackbar v-model="loadedPresence" color="success" text>
              <v-icon left>mdi-check</v-icon>

              Status Updated

              <template #action="{ attrs }">
                <v-btn text v-bind="attrs" @click="loadedPresence = false">
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

import { ipcRenderer } from "electron";

export default defineComponent({
  setup() {
    const form = ref<HTMLFormElement>(null!);
    const valid = ref(false);

    const game = ref<string>();
    const description = ref<string>();
    const time = ref(false);

    const loadingGames = ref(true);
    const loadedPresence = ref(false);

    const gamesList = ref([]);

    if (process.client)
      ipcRenderer.invoke("games").then(games => {
        gamesList.value = games;

        loadingGames.value = false;
      });

    const submit = async () => {
      if (form.value.validate()) {
        await ipcRenderer.invoke(
          "presence",
          game.value,
          description.value,
          time.value
        );

        loadedPresence.value = true;
      }
    };

    return {
      form,
      valid,
      loadingGames,
      loadedPresence,
      gamesList,

      game,
      description,
      time,

      submit,
    };
  },
});
</script>
