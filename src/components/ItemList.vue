<template>
  <div :id="groupName" class="itemList" v-if="group.items.length > 0">
    <ul class="overflow-y-auto h-52 md:h-[32rem]">
      <li v-for="(item, index) in group.items" :key="index + item.name">
        {{ item.name }}
      </li>
      <li v-if="group.returned < group.available">
        + {{ group.available - group.returned }} more
      </li>
    </ul>
  </div>
  <div class="itemList empty" v-else>
    No {{ groupName }} found.
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
