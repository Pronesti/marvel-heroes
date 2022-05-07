<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button @click="getComic">test</button>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import md5 from "md5";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  data() {
    return {
      characters: [],
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
          this.characters = this.reversed.reverse();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
