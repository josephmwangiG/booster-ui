<template lang="">
  <img
    v-if="src != null"
    :src="src"
    class="w-12 h-12 rounded-full inline-block mr-3"
    alt=""
  />
  <span v-if="!src" class="w-12 rounded-full inline-block mr-3"></span>

</template>
<script setup lang="ts">
defineProps({
  src: String,
});
</script>
<style lang=""></style>
