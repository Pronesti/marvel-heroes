<template>
  <div id="selectedCharacter">
    <div class="block md:flex md:items-center md:gap-3" v-if="character">
      <div class="characterImage flex-1 flex justify-center items-center">
        <img class="w-72 max-w-[50%] md:w-auto" :src="getImage" :alt="character.name" />
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex-1">
          <div class="characterName p-3">
            <input type="text" class="text-2xl text-center rounded dark:text-slate-200 dark:bg-slate-500" :value="computedCharacter.name" @input="(e) => setStorageCharacter('name', e)" />
            <div class="p-2">
              <button class="text-slate-200 bg-slate-200 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-slate-600" :class="{'bg-red-600 dark:bg-red-800': isFavorited}" @click="toggleFavorite">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
              <button class="text-slate-200 bg-slate-200 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2 dark:bg-slate-600" :class="{'bg-yellow-300 dark:bg-yellow-600': isBlacklisted}" @click="toggleBlacklist">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
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
    <div class="flex justify-center items-center h-[60vh] md:h-[70vh] xl:h-[80vh]" v-else>
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
    isFavorited(){
      return this.$store.state.favorites.findIndex((listCharacter) => listCharacter.id == this.selectedCharacter) !== -1;
    },
    isBlacklisted(){
      return this.$store.state.blacklist.findIndex((listCharacter) => listCharacter.id == this.selectedCharacter) !== -1;
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
    },
    toggleFavorite(){
      this.$store.commit('toggleFavoriteCharacter', this.character);
    },
    toggleBlacklist(){
      this.$store.commit('toggleBlacklistCharacter', this.character);
    },
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
