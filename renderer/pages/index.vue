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
              <template #selection="{ item }">
                <v-list-item-avatar tile>
                  <v-img
                    :alt="item.name"
                    :src="`https://cdn.discordapp.com/app-assets/846855871064834059/${item.id}.png?size=40`"
                  />
                </v-list-item-avatar>

                {{ item.name }}
              </template>

              <template #item="{ item }">
                <v-list-item-avatar tile>
                  <v-img
                    :alt="item.name"
                    :src="`https://cdn.discordapp.com/app-assets/846855871064834059/${item.id}.png?size=40`"
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
              label="Set a Status Description"
              prepend-icon="mdi-text"
              :rules="descriptionRules"
              validate-on-blur
            />

            <v-row>
              <v-col>
                <v-checkbox
                  v-model="time"
                  label="Show Time Elapsed"
                  :append-icon="`mdi-timer${time ? '' : '-off'}-outline`"
                />
              </v-col>

              <v-col>
                <v-select
                  v-model="status"
                  :color="status.color"
                  :items="statuses"
                  item-text="name"
                  label="Display an Online Status"
                  :prepend-inner-icon="status.icon"
                  return-object
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn color="primary" block type="submit">
                  <v-icon left>mdi-content-save</v-icon>
                  Save Status
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="error" block @click="clear">
                  <v-icon left>mdi-backspace</v-icon>
                  Clear Status
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>

      <v-snackbar
        v-model="showToast"
        color="success"
        timeout="2000"
        top
        right
        text
      >
        <v-icon left>mdi-check-bold</v-icon>

        {{ toastMessage }}

        <template #action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showToast = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@nuxtjs/composition-api";

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

    onMounted(async () => {
      gamesList.value = await ipcRenderer.invoke("games");

      game.value = localStorage.getItem("game") || "";
      description.value = localStorage.getItem("description") || "";
      time.value = !!JSON.parse(localStorage.getItem("time")!);
      status.value = statuses.find(
        ({ name }) => name === (localStorage.getItem("status") || "None")
      )!;

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
          status.value.name
        );

        localStorage.setItem("game", game.value);
        localStorage.setItem("description", description.value);
        localStorage.setItem("time", time.value.toString());
        localStorage.setItem("status", status.value.name);

        toast("Status Saved");
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

      gameRules: [(game: string) => !!game || "A game is required"],
      descriptionRules: [
        ({ length }: string) =>
          length !== 1 || "Must be at least 2 characters long",
      ],

      submit,
      clear() {
        ipcRenderer.send("clear");

        toast("Cleared Status");
      },

      toastMessage,
      showToast,
    };
  },
});
</script>
