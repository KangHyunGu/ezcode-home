<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn fab small label="설정 추가" @click="addConfig">
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
    </v-toolbar>

    <!-- 설정 다이얼로그 -->
    <ez-dialog
      label="설정 추가"
      ref="dialog"
      max-width="500"
      dark
      color="primary"
    >
      <config-form @save="test"></config-form>
    </ez-dialog>
    <!-- // 설정 다이얼로그 -->
  </v-container>
</template>

<script>
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import ConfigForm from "./ConfigComponents/ConfigForm.vue";
export default {
  components: { TooltipBtn, EzDialog, ConfigForm },
  name: "admConfig",
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    addConfig() {
      this.$refs.dialog.open();
    },
    test(form) {
      this.$refs.dialog.close();
    },
  },
};
</script>

<style>
</style>