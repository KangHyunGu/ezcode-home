<template>
  <component :is="curSkin" :item="item" />
</template>

<script>
import SKINS from "./skins";
import upperFirst from "lodash/upperFirst";

import { mapActions, mapState, mapMutations } from "vuex";
import ContentsError from "./ContentsError.vue";
export default {
  components: { ...SKINS, ContentsError },
  name: "ContentsRenderer",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      item: (state) => state.board.read,
    }),
    curSkin() {
      if (this.item) {
        const prefix = upperFirst(this.item.wr_2);
        return `${prefix}Contents`;
      } else {
        return "ContentsError";
      }
    },
    wr_1() {
      return this.$route.params.wr_1;
    },
  },
  watch: {
    wr_1() {
      this.fetchData();
    },
  },
  serverPrefetch() {
    // Server
    return this.fetchData();
  },
  mounted() {
    // Client
    if (!this.item) {
      this.fetchData();
    }
  },
  destroyed() {
    this.SET_READ(null);
  },
  methods: {
    ...mapMutations("board", ["SET_READ"]),
    ...mapActions("board", ["getContentsRead"]),
    async fetchData() {
      const headers = {};
      if (this.$ssrContext) {
        headers.token = this.$ssrContext.token;
      }
      await this.getContentsRead({
        wr_1: this.wr_1,
        headers,
      });
    },
  },
};
</script>

<style>
</style>