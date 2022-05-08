<template>
  <div :id="groupName" class="characterList m-1" v-if="group.length > 0">
      <div class="p-1 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300">
        <h3 class="block">{{ groupName }}</h3>
        <div class="flex justify-center">
          <div v-for="(character, index) in group" :key="character.id" class="m-1 md:flex" :class="{'hidden': index > 9}" @click="setCharacterId(character.id)"> 
            <img :src="character.image" :alt="character.name" :title="character.name" class="w-8 h-8 rounded"/>
          </div>
        </div>
      </div>
  </div>
  <div class="itemList"  v-else>
    <div class="h-52 md:h-[32rem]">
      <div class="p-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
        No {{ groupName }} found.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CharacterList",
  props: {
    group: Array,
    groupName: String,
  },
  methods:{
    setCharacterId(id) {
      this.$emit("setCharacterId", id);
    },
  }
};
</script>

<style scoped>
</style>
