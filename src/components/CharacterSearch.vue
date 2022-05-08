<template>
  <div id="search" class="m-2">
    <div class="flex items-center justify-center">
      <div class="flex border-2 rounded dark:border-slate-500">
        <input
          type="search"
          class="px-4 py-2 w-full md:w-80 dark:bg-slate-500 dark:text-white"
          placeholder="Search..."
          v-model="searchTerm"
          @click="getCharacters(searchTerm)"
          @input="getCharacters(searchTerm)"
          @blur="waitAndHideResults()"
        />
        <button
          class="flex items-center justify-center px-4 border-l dark:bg-slate-600 dark:border-slate-500"
          @click="getCharacters(searchTerm)"
        >
          <svg
            class="w-6 h-6 text-gray-600 dark:text-white "
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
          class="bg-white w-80  dark:bg-slate-500 dark:text-slate-200"
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
          <template v-if="charactersByComic.length > 0">
            <span class="font-semibold">By Comic</span>
            <hr />
            <li
              class="m-2"
              v-for="character in charactersByComic"
              :key="'comic-' + character.name"
              @click="setCharacterId(character.id)"
            >
              <div>{{ character.name }}</div><div class="text-sm text-gray-400 dark:text-slate-400">{{character.title}} </div>
            </li>
          </template>
          <template v-if="charactersBySeries.length > 0">
            <span class="font-semibold">By series</span>
            <hr />
            <li
              class=" m-2"
              v-for="character in charactersBySeries"
              :key="'series-' + character.name"
              @click="setCharacterId(character.id)"
            >
              <div>{{ character.name }}</div><div class="text-sm text-gray-400 dark:text-slate-400">{{character.title}} </div>
            </li>
          </template>
        </ul>
        <span class="bg-white w-80 dark:bg-slate-500 dark:text-slate-200" v-else>No results found</span>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import axios from "axios";
import { debounce } from "lodash";

export default {
  name: "CharacterSearch",
  props: {},
  data() {
    return {
      searchTerm: "",
      byNameList: [],
      byComicList: [],
      bySeriesList: [],
      showResults: false,
    };
  },
  computed: {
    charactersByComic(){
      let characters = this.byComicList.map((comic) => comic.characters.items.map((character) => { 
        return {
          id: parseInt(character.resourceURI.split('/').at(-1)),
          name: character.name,
          title: comic.title
          };
        })).flat();

        return [...new Map(characters.map(item => [item['id'], item])).values()].slice(0,5).filter((character) => !this.$store.state.blacklist.map((character) => character.id).includes(character.id));
    },
      charactersBySeries(){
      let characters = this.bySeriesList.map((series) => series.characters.items.map((character) => { 
        return {
          id: parseInt(character.resourceURI.split('/').at(-1)),
          name: character.name,
          title: series.title
          };
        })).flat();

        return [...new Map(characters.map(item => [item['id'], item])).values()].slice(0,5).filter((character) => !this.$store.state.blacklist.map((character) => character.id).includes(character.id));
    }
  },
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
      let extraParams = searchTerm ? { nameStartsWith: searchTerm, limit: 5 } : { limit: 5 };

      this.axiosGetRequest("characters", extraParams)
        .then((response) => {
          this.byNameList = response.data.data.results.filter((character) => !this.$store.state.blacklist.map((character) => character.id).includes(character.id));
          this.showResults = true;
        })
        .catch((e) => {
          this.setError(e);
        });
    },
    getCharactersByComic(searchTerm) {
      if (searchTerm == "") return;
      this.axiosGetRequest("comics", { titleStartsWith: searchTerm })
        .then((response) => {
          this.byComicList = response.data.data.results.filter((comic) => comic.characters.available > 0);
          this.showResults = true;
        })
        .catch((e) => {
          this.setError(e);
        });
    },
    getCharactersBySeries(searchTerm) {
      if (searchTerm == "") return;
      this.axiosGetRequest("series", { titleStartsWith: searchTerm })
        .then((response) => {
          this.bySeriesList = response.data.data.results.filter((series) => series.characters.available > 0);
          this.showResults = true;
        })
        .catch((e) => {
          this.setError(e);
        });
    },
    getCharacters: debounce(function(){
      this.getCharactersByName(this.searchTerm);
      this.getCharactersByComic(this.searchTerm);
      this.getCharactersBySeries(this.searchTerm);
    }, 1000, { 'maxWait': 1000}),
    getThumbnail(character) {
      return character
        ? character.thumbnail.path + "." + character.thumbnail.extension
        : null;
    },
    getCharacterId(character){
      return character.resourceURI.split('/').at(-1);
    },
    setCharacterId(id) {
      this.showResults = false;
      this.$emit("setCharacterId", id);
    },
    setError(err){
      this.$emit('error', err);
    },
    waitAndHideResults() {
      setTimeout(() => (this.showResults = false), 200);
    },
  },
};
</script>

<style scoped>
</style>
