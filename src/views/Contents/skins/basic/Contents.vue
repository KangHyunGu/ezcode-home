<template>
  <v-container>
    <!-- <h4>{{ item.wr_title }}</h4> -->
    <ssr-renderer>
      <template>
        <ez-tiptap :editable="false" v-model="item.wr_content" />
      </template>
      <template v-slot:server>
        <div v-html="item.wr_content"></div>
      </template>
    </ssr-renderer>
  </v-container>
</template>

<script>
import SsrRenderer from "../../../../components/util/SsrRenderer.vue";
export default {
  components: { SsrRenderer },
  name: "Contents",
  props: {
    item: { type: Object, required: true },
  },
};
</script>

<style>
</style>