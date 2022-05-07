<template>
  <div class="home">
    <ErrorMessage :error="error" />
    <CharacterSearch @setCharacterId="setCharacterId" @error="setError"/>
    <SelectedCharacter :selectedCharacter="selectedCharacter" @error="setError"/>
  </div>
</template>

<script>
import SelectedCharacter from "@/components/SelectedCharacter.vue";
import CharacterSearch from "@/components/CharacterSearch.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";


export default {
  name: "HomeView",
  components: {
    SelectedCharacter,
    CharacterSearch,
    ErrorMessage,
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
