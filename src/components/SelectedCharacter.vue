<template>
  <div class="hello">
    <div class="block md:flex items-center" v-if="character">
      <div class="characterImage flex-1 flex justify-center items-center">
        <img class="w-72 md:w-full" :src="getImage" :alt="character.name" />
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex-1">
          <div class="characterName">
            <h2 class="text-2xl">{{ character.name }}</h2>
          </div>
          <div class="characterDescription">
            <p class="text-base p-2">{{ character.description }}</p>
          </div>
        </div>
        <div class="flex-1">
          <ul
            class="
              text-sm
              font-medium
              text-center text-gray-500
              border-b border-gray-200
              dark:text-gray-400 dark:border-gray-700
              flex
            "
          >
            <li
              class="
                w-full
                inline-block
                p-4
                rounded-t-lg
                border-b-2 border-transparent
                hover:text-gray-600 hover:border-gray-300
                dark:hover:text-gray-300
                capitalize
              "
              v-for="item in ['comics', 'series', 'stories', 'events']"
              :class="{
                'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500':
                  currentTab == item,
              }"
              :key="item"
              @click="currentTab = item"
            >
              {{ item }}
            </li>
          </ul>
          <item-list
            v-for="groupName in ['comics', 'series', 'stories', 'events']"
            :group="character[groupName]"
            :group-name="groupName"
            :key="groupName"
            v-show="currentTab == groupName"
            class="p-3"
          />
        </div>
      </div>
    </div>
    <div class="h-screen flex justify-center items-center" v-else>
      <loading-spinner v-if="loading" />
      <span v-else> Busca un personaje</span>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import axios from "axios";
import ItemList from "@/components/ItemList.vue";
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: "SelectedCharacter",
  components: {
    ItemList,
    LoadingSpinner,
  },
  props: {
    selectedCharacter: Number,
  },
  data() {
    return {
      loading: false,
      character: null,
      currentTab: "comics",
    };
  },
  mounted() {
    this.selectedCharacter && this.getCharacter();
  },
  computed: {
    getImage() {
      return this.character
        ? this.character.thumbnail.path +
            "." +
            this.character.thumbnail.extension
        : null;
    },
  },
  methods: {
    getCharacter() {
      this.loading = true;
      let ts = Math.floor(Date.now() / 1000);
      let hash = md5(
        ts +
          process.env.VUE_APP_PRIVATE_API_KEY +
          process.env.VUE_APP_PUBLIC_API_KEY
      );
      axios
        .get(
          `https://gateway.marvel.com/v1/public/characters/${this.selectedCharacter}`,
          {
            params: {
              ts,
              apikey: process.env.VUE_APP_PUBLIC_API_KEY,
              hash,
            },
          }
        )
        .then((response) => {
          this.character = response.data.data.results[0];
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
  },
  watch: {
    selectedCharacter: function () {
      this.getCharacter();
    },
  },
};
</script>

<style scoped>
</style>
