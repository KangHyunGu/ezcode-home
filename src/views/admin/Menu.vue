<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>메뉴 관리</v-toolbar-title>
      <v-spacer />
      <tooltip-btn
        label="새 메뉴 추가"
        icon
        small
        fab
        color="secodary"
        @click="addMenu"
      >
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
      <tooltip-btn label="저장" icon small fab color="primary">
        <v-icon>mdi-content-save-outline</v-icon>
      </tooltip-btn>
      <tooltip-btn label="초기화" icon small fab color="error">
        <v-icon>mdi-refresh</v-icon>
      </tooltip-btn>
    </v-toolbar>
    <nested-drag-menu :items="items" class="mt-4" />
    <ez-dialog ref="dialog" width="500" label="메뉴" persistent>
      <menu-form :item="curItem" class="mt-4" />
    </ez-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { deepCopy } from "../../../util/lib";
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import MenuForm from "./MenuComponents/MenuForm.vue";
import NestedDragMenu from "./MenuComponents/NestedDragMenu.vue";
export default {
  components: { TooltipBtn, NestedDragMenu, EzDialog, MenuForm },
  name: "AdmMenu",
  data() {
    return {
      items: [],
      curItem: null,
    };
  },
  computed: {
    ...mapState({
      menu: (state) => state.config.menu,
    }),
  },

  //SSR 할 경우 동작하면 안되기 때문어 mounted로
  mounted() {
    this.init();
  },

  methods: {
    init() {
      const items = deepCopy(this.menu);
      // 하위 메뉴 show 할지의 여부
      for (const item of items) {
        this.$set(item, "show", false);
        //item.show = false;
      }

      this.items = items;
    },

    addMenu() {
      this.curItem = null;
      this.$refs.dialog.open();
    },
  },
};
</script>

<style>
</style>