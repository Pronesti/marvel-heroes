<template>
  <div id="search" class="m-2">
    <div class="flex items-center justify-center">
      <div class="flex border-2 rounded">
        <input
          type="search"
          class="px-4 py-2 w-80"
          placeholder="Search..."
          v-model="searchTerm"
          @click="getCharacterByName(searchTerm)"
          @input="getCharacterByName(searchTerm)"
          @blur="waitAndHideResults()"
        />
        <button
          class="flex items-center justify-center px-4 border-l"
          @click="getCharacterByName(searchTerm)"
        >
          <svg
            class="w-6 h-6 text-gray-600"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div id="results" class="absolute w-full" v-show="showResults">
      <div class="flex items-center justify-center">
        <ul class="bg-white w-80" v-if="byNameList.length > 0">
          <li
            class="flex m-2"
            v-for="character in byNameList"
            :key="character.name"
            @click="setCharacterId(character.id)"
          >
            <img
              class="w-8 h-8 mx-2"
              :src="getThumbnail(character)"
              :alt="character.name"
            />
            <span>{{ character.name }}</span>
          </li>
        </ul>
        <span class="bg-white w-80 border-2" v-else>No results found</span>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import axios from "axios";

export default {
  name: "CharacterSearch",
  props: {},
  data() {
    return {
      searchTerm: "",
      byNameList: [],
      showResults: false,
    };
  },
  computed: {},
  methods: {
    getCharacterByName(searchTerm) {
      let ts = Math.floor(Date.now() / 1000);
      let hash = md5(
        ts +
          process.env.VUE_APP_PRIVATE_API_KEY +
          process.env.VUE_APP_PUBLIC_API_KEY
      );

      let params = searchTerm
        ? {
            ts,
            apikey: process.env.VUE_APP_PUBLIC_API_KEY,
            hash,
            nameStartsWith: searchTerm,
          }
        : {
            ts,
            apikey: process.env.VUE_APP_PUBLIC_API_KEY,
            hash,
          };

      axios
        .get("https://gateway.marvel.com/v1/public/characters", {
          params,
        })
        .then((response) => {
          this.byNameList = response.data.data.results.slice(0, 10);
          this.showResults = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getThumbnail(character) {
      return character
        ? character.thumbnail.path + "." + character.thumbnail.extension
        : null;
    },
    setCharacterId(id) {
      this.showResults = false;
      this.$emit("setCharacterId", id);
    },
    waitAndHideResults(){
      setTimeout(() => this.showResults = false, 200);
    }
  },
};
</script>

<style scoped>
</style>
