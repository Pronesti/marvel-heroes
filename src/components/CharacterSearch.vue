<template>
  <div id="search" class="Search">
    <input
      type="text"
      v-model="searchTerm"
      @change="getCharacterByName(searchTerm)"
    />
    <ul>
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
      axios
        .get("https://gateway.marvel.com/v1/public/characters", {
          params: {
            ts,
            apikey: process.env.VUE_APP_PUBLIC_API_KEY,
            hash,
            nameStartsWith: searchTerm,
          },
        })
        .then((response) => {
          this.byNameList = response.data.data.results;
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
    setCharacterId(id){
      this.$emit('setCharacterId', id);
    }
  },
};
</script>

<style scoped>
</style>
