<template>
  <div class="home">
    <SelectedCharacter :selectedCharacter="selectedCharacter" />
    <button @click="getComic">test</button>
  </div>
</template>

<script>
import SelectedCharacter from "@/components/SelectedCharacter.vue";
import md5 from "md5";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    SelectedCharacter,
  },
  data() {
    return {
      charactersList: [],
      selectedCharacter: 1012717,
      reversed: [],
    };
  },
  methods: {
    getComic() {
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
          },
        })
        .then((response) => {
          this.reversed = response.data.data.results;
          this.charactersList = this.reversed.reverse();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
