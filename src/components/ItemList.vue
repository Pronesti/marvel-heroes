<template>
  <div :id="groupName" class="itemList" v-if="group.items.length > 0">
    <ul class="overflow-y-auto h-52 md:h-[32rem]">
      <li v-for="(item, index) in group.items" :key="index + item.name" class="dark:text-slate-200">
        {{ item.name }}
      </li>
      <li v-if="group.returned < group.available" class="dark:text-slate-200">
        + {{ group.available - group.returned }} more
      </li>
    </ul>
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
  name: "ItemList",
  props: {
    group: Object,
    groupName: String,
  },
};
</script>

<style scoped>
</style>
