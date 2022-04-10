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
      <ssr-renderar>
        <template>
          <ez-tiptap :editable="false" v-model="item.wr_content" />
        </template>
        <template v-slot:server>
          <div v-html="item.wr_content"></div>
        </template>
      </ssr-renderar>
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
import { mapGetters, mapMutations, mapState } from "vuex";
import { LV } from "../../../../../util/level";
import SsrRenderar from "../../../../components/util/SsrRenderar.vue";

export default {
  components: { SsrRenderar },
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
      initData: (state) => state.initData,
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
  syncData() {
    if (this.initData && this.initData.read) {
      return this.setData(this.initData.read);
    } else {
      return this.fetchData();
    }
  },
  methods: {
    ...mapMutations(["SET_INITDATA"]),
    async fetchData() {
      // SSR로 구동시 인증이 필요 할 경우
      const headers = {};
      if (this.$ssrContext) {
        headers.token = this.$ssrContext.token;
      }
      const data = await this.$axios.get(
        `/api/board/read/${this.table}/${this.id}`,
        { headers }
      );

      if (this.$ssrContext) {
        this.SET_INITDATA({ read: data });
      }
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