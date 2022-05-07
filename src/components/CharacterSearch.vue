<template>
  <div id="search" class="m-2">
    <div class="flex items-center justify-center">
      <div class="flex border-2 rounded">
        <input
          type="search"
          class="px-4 py-2 w-80"
          placeholder="Search..."
          v-model="searchTerm"
          @click="getCharacters(searchTerm)"
          @input="getCharacters(searchTerm)"
          @blur="waitAndHideResults()"
        />
        <button
          class="flex items-center justify-center px-4 border-l"
          @click="getCharacters(searchTerm)"
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
        <ul
          class="bg-white w-80"
          v-if="byNameList.length > 0 || byComicList.length > 0"
        >
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
          <template v-if="byComicList.length > 0">
            <hr />
            By Comic
            <hr />
            <li
              class="flex m-2"
              v-for="character in byComicList"
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
          </template>
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
      byComicList: [],
      showResults: false,
    };
  },
  computed: {},
  methods: {
    axiosGetRequest(url, extraParams = {}) {
      let ts = Math.floor(Date.now() / 1000);
      let hash = md5(
        ts +
          process.env.VUE_APP_PRIVATE_API_KEY +
          process.env.VUE_APP_PUBLIC_API_KEY
      );

      return axios.get("https://gateway.marvel.com/v1/public/" + url, {
        params: {
          ts,
          apikey: process.env.VUE_APP_PUBLIC_API_KEY,
          hash,
          ...extraParams,
        },
      });
    },
    getCharactersByName(searchTerm) {
      let extraParams = searchTerm ? { nameStartsWith: searchTerm } : {};

      this.axiosGetRequest("characters", extraParams)
        .then((response) => {
          this.byNameList = response.data.data.results.slice(0, 10);
          this.showResults = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getCharactersByComic(searchTerm) {
      if (searchTerm == "") return;
      this.axiosGetRequest("comics", { titleStartsWith: searchTerm })
        .then((response) => {
          let comics_id = response.data.data.results
            .slice(0, 10)
            .map((comic) => comic.id);
          if (comics_id.length > 0) {
            this.axiosGetRequest("characters", {
              comics: comics_id.join(","),
            }).then((response) => {
              this.byComicList = response.data.data.results.slice(0, 5);
            });
          }
          this.showResults = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getCharacters(searchTerm) {
      this.getCharactersByName(searchTerm);
      this.getCharactersByComic(searchTerm);
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
    waitAndHideResults() {
      setTimeout(() => (this.showResults = false), 200);
    },
  },
};
</script>

<style scoped>
</style>
