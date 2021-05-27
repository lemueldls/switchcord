<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="submit"
      >
        <v-card elevation="12">
          <v-toolbar flat>
            <v-list-item-avatar tile>
              <img src="~/static/icon.png" />
            </v-list-item-avatar>
            <v-toolbar-title>Switchcord</v-toolbar-title>
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
              item-value="img"
              prepend-icon="mdi-nintendo-switch"
              :rules="gameRules"
              required
            >
              <template #item="{ item }">
                <v-list-item-avatar tile>
                  <v-img
                    :alt="item.name"
                    :src="`https://cdn.discordapp.com/app-assets/846855871064834059/${item.id}.png`"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>

            <v-text-field
              v-model="description"
              label="Status Description"
              prepend-icon="mdi-text"
            />

            <v-row>
              <v-col>
                <v-checkbox
                  v-model="time"
                  label="Show Time Elapsed"
                  append-icon="mdi-timer-outline"
                />
              </v-col>

              <v-col>
                <v-select
                  v-model="status"
                  :color="status.color"
                  :items="statuses"
                  item-text="name"
                  label="Online Status"
                  :prepend-icon="status.icon"
                  return-object
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn color="primary" block type="submit">
                  <v-icon left>mdi-pencil</v-icon>
                  Update
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="error" block @click="clear">
                  <v-icon left>mdi-delete</v-icon>
                  Clear
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>

      <v-snackbar v-model="showToast" color="success" timeout="2000" text>
        <v-icon left>mdi-check</v-icon>

        {{ toastMessage }}

        <template #action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showToast = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

import { ipcRenderer } from "electron";

import type { GameData } from "../../main/game";

export default defineComponent({
  setup() {
    const form = ref<HTMLFormElement>(null!);
    const valid = ref(false);

    const game = ref("");
    const description = ref("");
    const time = ref(false);

    const statuses = [
      { name: "None", color: "secondary", icon: "mdi-moon-new", id: "" },
      { name: "Online", color: "success", icon: "mdi-moon-full", id: "online" },
      {
        name: "Away",
        color: "warning",
        icon: "mdi-weather-night",
        id: "away",
      },
    ];
    const status = ref(statuses[0]);

    const loadingGames = ref(true);

    const gamesList = ref<GameData[]>([]);

    const toastMessage = ref("");
    const showToast = ref(false);

    if (process.client)
      ipcRenderer.invoke("games").then(games => {
        gamesList.value = games;

        loadingGames.value = false;
      });

    const toast = (message: string) => {
      toastMessage.value = message;

      showToast.value = true;
    };

    const submit = async () => {
      if (form.value.validate()) {
        ipcRenderer.send(
          "presence",
          game.value,
          description.value,
          time.value,
          status.value.id
        );

        toast("Status Updated");
      }
    };

    return {
      form,
      valid,
      loadingGames,
      gamesList,

      game,
      description,
      time,
      status,
      statuses,

      gameRules: [(v: string) => !!v || "A Game is required"],

      submit,
      clear() {
        ipcRenderer.send("clear");

        toast("Clearing Status");
      },

      toastMessage,
      showToast,
    };
  },
});
</script>
