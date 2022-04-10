<template>
  <div v-if="isClient">
    <slot name="default"></slot>
  </div>
  <div v-else class="d-none">
    <!-- 서버 : 화면에 보이지 않게 대신 내용은 존재 -->
    <slot name="server"></slot>
  </div>
</template>

<script>
export default {
  name: "SsrRenderar",
  data() {
    return {
      isClient: false,
    };
  },

  mounted() {
    this.isClient = true;
  },
};
</script>

<style>
</style>