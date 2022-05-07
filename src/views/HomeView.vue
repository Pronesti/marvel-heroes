<template>
  <div class="home">
    <CharacterSearch @setCharacterId="setCharacterId" />
    <SelectedCharacter :selectedCharacter="selectedCharacter" />
  </div>
</template>

<script>
import SelectedCharacter from "@/components/SelectedCharacter.vue";
import CharacterSearch from "@/components/CharacterSearch.vue";


export default {
  name: "HomeView",
  components: {
    SelectedCharacter,
    CharacterSearch,
  },
  data() {
    return {
      charactersList: [],
      selectedCharacter: null,
      reversed: [],
    };
  },
  methods: {
    setCharacterId(id){
      this.selectedCharacter = id;
    },
  },
};
</script>
