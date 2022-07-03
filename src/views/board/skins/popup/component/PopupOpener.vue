<template>
  <div>
    <popup-view
      v-for="(item, index) in items"
      table="popuoMng"
      :item="item"
      :key="item.wr_id"
      :idx="index"
      @onClose="closeItem"
    />
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import PopupView from "./PopupView.vue";
export default {
  components: { PopupView },
  name: "popupOpener",
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const cookieNames = VueCookies.keys();
      const ignores = cookieNames
        .filter((name) => name.startsWith("pop"))
        .map((name) => name.split("-")[1])
        .join(",");
      const data = await this.$axios.get(
        `/api/board/popup-list?ignores=${ignores}`
      );

      if (data) {
        this.items = data;
      }
    },
    closeItem(item) {
      const idx = this.items.indexOf(item);
      this.items.splice(idx, 1);
    },
  },
};
</script>

<style>
</style>