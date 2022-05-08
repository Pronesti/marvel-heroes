<template>
  <div class="home flex flex-col justify-center">
    <div class="sticky top-0">
      <ErrorMessage :error="error" />
    </div>
    <div>
      <CharacterSearch @setCharacterId="setCharacterId" @error="setError"/>
    </div>
    <div>
      <SelectedCharacter :selectedCharacter="selectedCharacter" @error="setError"/>
    </div>
    <div>
      <CharacterList groupName="Favorites" :group="$store.state.favorites" @setCharacterId="setCharacterId"/>
      <CharacterList groupName="Blacklist" :group="$store.state.blacklist" @setCharacterId="setCharacterId"/>
    </div>
  </div>
</template>

<script>
import SelectedCharacter from "@/components/SelectedCharacter.vue";
import CharacterSearch from "@/components/CharacterSearch.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import CharacterList from "@/components/CharacterList.vue";


export default {
  name: "HomeView",
  components: {
    SelectedCharacter,
    CharacterSearch,
    ErrorMessage,
    CharacterList,
  },
  data() {
    return {
      charactersList: [],
      selectedCharacter: null,
      reversed: [],
      error: "",
    };
  },
  methods: {
    setCharacterId(id){
      this.selectedCharacter = id;
    },
    setError(error){
      this.error = error.response.data ? error.response.data.status : error.message;
    }
  },
};
</script>
