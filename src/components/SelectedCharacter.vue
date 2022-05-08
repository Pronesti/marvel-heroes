<template>
  <div id="selectedCharacter">
    <div class="block md:flex md:items-center md:gap-3" v-if="character">
      <div class="characterImage flex-1 flex justify-center items-center">
        <img class="w-72 md:w-auto" :src="getImage" :alt="character.name" />
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex-1">
          <div class="characterName p-3">
            <input type="text" class="text-2xl text-center rounded dark:text-slate-200 dark:bg-slate-500" :value="computedCharacter.name" @input="(e) => setStorageCharacter('name', e)" />
          </div>
          <div class="characterDescription min-h-[6rem] p-4 pr-8">
            <textarea class="w-full h-24 md:h-32 m-4 text-base p-2 rounded dark:text-slate-200 dark:bg-slate-500" :value="computedCharacter.description" @input="(e) => setStorageCharacter('description', e)" />
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
                cursor-pointer
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
    <div class="h-full flex justify-center items-center" v-else>
      <loading-spinner v-if="loading" />
      <span class="flex p-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert" v-else> Search character by name, comic title or series title.</span>
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
      storageCharacter: null,
      character: null,
      currentTab: "comics",
    };
  },
  mounted() {
    this.selectedCharacter && this.fetchCharacter();
  },
  computed: {
    getImage() {
      return this.character
        ? this.character.thumbnail.path +
            "." +
            this.character.thumbnail.extension
        : null;
    },
    computedCharacter(){ 
        return {
          ...this.character, 
          ...this.storageCharacter
          } 
        },
  },
  methods: {
    fetchCharacter() {
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
          let storagedCharacter = this.getCharacterFromStorage(this.selectedCharacter)
          if(storagedCharacter){
            this.storageCharacter = storagedCharacter;
          }else{
            this.saveCharacterToStorage(response.data.data.results[0]);
            this.storageCharacter = this.getCharacterFromStorage(this.selectedCharacter)
          }
          this.loading = false;
        })
        .catch((e) => {
          this.setError(e);
          this.loading = false;
        });
    },
    setError(err){
      this.$emit('error', err);
    },
    getCharacterFromStorage(id = null){
      let character = localStorage.getItem(id)
      return !character ? {} : JSON.parse(character);
    },
    saveCharacterToStorage(character){
      localStorage.setItem(character.id, JSON.stringify(character));
    },
    setStorageCharacter(property, event){
      this.storageCharacter = {...this.storageCharacter, [property]: event.target.value};
      this.saveCharacterToStorage(this.storageCharacter);
    }
  },
  watch: {
    selectedCharacter: function () {
      this.fetchCharacter();
    },
  },
};
</script>

<style scoped>
</style>
