<template>
  <v-carousel>
    <v-carousel-item
      v-for="(item, i) in items"
      :key="item.wr_id"
      reverse-transition="fade-transition"
      transition="fade-transition"
    >
      <v-img :src="getImage(table, item, imgSize)" height="450"></v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import { getImage } from "../../../../../util/lib";
export default {
  name: "Latest",
  props: {
    table: { type: String, required: true },
    subject: { type: String, required: true },
    items: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      imgSize: {
        w: 800,
        h: 450,
      },
    };
  },
  computed: {
    getImage: () => getImage,
  },
  watch: {
    items() {
      console.log("this.items : ", this.items);
    },
  },
};
</script>

<style>
</style>