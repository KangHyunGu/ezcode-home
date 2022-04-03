<template>
  <v-card flat v-if="item">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>{{ item.wr_title }}</v-toolbar-title>
        <v-spacer />
        <v-btn :to="`/board/${table}`">목록</v-btn>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <ez-tiptap :editable="false" v-model="item.wr_content" />
    </v-card-text>
    <v-card-text>
      <v-card-actions>
        <v-btn
          v-if="isModify == 'MODIFY'"
          color="info"
          :to="`/board/${table}/${item.wr_id}?act=write`"
        >
          <v-icon left>mdi-pencil</v-icon>
          수정
        </v-btn>
        <v-btn
          v-if="access.reply"
          color="seconday"
          :to="`/board/${table}/${item.wr_id}?act=reply`"
        >
          <v-icon>mdi-subdirectory-arrow-right</v-icon>
          답글쓸기
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { LV } from "../../../../../util/level";
export default {
  name: "BasicRead",
  props: {
    config: Object,
    access: Object,
    id: [String, Number],
  },
  data() {
    return {
      item: null,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
    ...mapGetters("user", ["GRANT"]),
    table() {
      return this.config.bo_table;
    },
    isModify() {
      if (this.member) {
        // 게시물 작성자이거나 최고 관리자 이면
        if (this.member.mb_id == this.item.mb_id || this.GRANT >= LV.SUPER) {
          return "MODIFY";
        }
      } else if (this.item.mb_id == 0) {
        // 비회원일때
        return "NO_MEMBER";
      }
      return "";
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const data = await this.$axios.get(
        `/api/board/read/${this.table}/${this.id}`
      );
      this.setData(data);
    },
    setData(data) {
      this.item = data;
    },
  },
};
</script>

<style>
</style>