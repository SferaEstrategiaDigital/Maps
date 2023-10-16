<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import OpenStreetMap from "./Components/Mapa/OpenStreetMap.vue";

const contentHeight = ref(0);

provide("contentHeight", contentHeight);

const updateContentHeight = () => {
  const screenHeight = window.innerHeight;
  contentHeight.value = screenHeight;
};
onMounted(() => {
  updateContentHeight();
  window.addEventListener("resize", updateContentHeight);
});

</script>

<template>
  <OpenStreetMap />
</template>
