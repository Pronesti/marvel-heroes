import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    favorites: [],
    blacklist: [],
  },
  getters: {
  },
  mutations: {
    toggleFavoriteCharacter(state, character){
      let index = state.favorites.findIndex((listCharacter) => listCharacter.id == character.id)
      if(index == -1){
        state.favorites = [...state.favorites, { id: character.id, name: character.name, image: character.thumbnail.path + "." + character.thumbnail.extension }] 
      }else{
        let newFavorites = [...state.favorites];
        newFavorites.splice(index,1);
        state.favorites = newFavorites;
      }
    },
    toggleBlacklistCharacter(state, character){
      let index = state.blacklist.findIndex((listCharacter) => listCharacter.id == character.id)
      if( index == -1){
        state.blacklist = [...state.blacklist, { id: character.id, name: character.name, image: character.thumbnail.path + "." + character.thumbnail.extension }] 
      }else{
        let newBlacklist = [...state.blacklist];
        newBlacklist.splice(index,1);
        state.blacklist = newBlacklist;
      }
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
