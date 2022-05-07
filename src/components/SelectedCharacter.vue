<template>
  <div class="hello">
    <div v-if="character">
      <div class="characterImage">
        <img :src="getImage" :alt="character.name" />
      </div>
      <div class="characterName">
        {{ character.name }}
      </div>
      <div class="characterDescription">
        {{ character.description }}
      </div>
      <item-list
        v-for="groupName in ['comics', 'series', 'stories', 'events']"
        :group="character[groupName]"
        :group-name="groupName"
        :key="groupName"
      />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import md5 from "md5";
import axios from "axios";
import ItemList from "@/components/ItemList.vue";

export default {
  name: "SelectedCharacter",
  components: {
    ItemList,
  },
  props: {
    selectedCharacter: Number,
  },
  data() {
    return {
      character: null,
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
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
</style>
