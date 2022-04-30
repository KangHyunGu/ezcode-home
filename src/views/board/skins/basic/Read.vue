<template>
  <v-container fluid>
    <v-card flat v-if="item">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>{{ item.wr_title }}</v-toolbar-title>
          <v-spacer />
          <v-subheader class="text-no-wrap">
            <v-icon class="mx-2" small>mdi-account</v-icon>
            {{ item.wr_name }}
            <v-icon class="mx-2" small>mdi-clock-outline</v-icon>
            <i><display-time :time="item.wr_createat" /></i>
            <v-icon class="mx-2" small>mdi-eye</v-icon>
            {{ item.wr_view }}
          </v-subheader>
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
        <tag-view :tags="item.wrTags" />
      </v-card-text>

      <v-card-text>
        <display-good
          :table="table"
          :item="item"
          class="d-flex justify-center"
          :btnProps="{ tile: true, small: true}"
          :icon="{
            good: 'mdi-thumb-up',
            bad: 'mdi-thumb-down',
          }"
        /> 
      </v-card-text>

      <v-card-text>
        <file-download :table="table" :item="item" :access="access" />
      </v-card-text>

      <v-card-actions>
        <v-col cols="4" class="text-no-wrap">
         <!-- 수정 -->
         <board-button
          v-if="isModify == 'MODIFY'"
          color="info"
          :to="`/board/${table}/${item.wr_id}?act=write`"
          label="수정"
          icon="mdi-pencil"
        />
          <!-- TODO: 비회원 계시물 수정 버튼 -->
          <!-- // 수정 -->

          <!-- 삭제 -->
          <board-button
            v-if="isModify == 'MODIFY'"
            color="error"
            class="ml-2"
            @click="deleteItem"
            label="삭제"
            icon="mdi-delete"
            :loading="deleteLoading"
        />
          <!-- TODO: 비회원 계시물 삭제 버튼 -->
          <!-- // 삭제 -->
        </v-col>          

      <v-col cols="4" class="text-right text-no-wrap">
          <board-button
            v-if="access.reply"
            color="secondary"
            :to="`/board/${table}/${item.wr_id}?act=reply`"
            label="답글쓰기"
            icon="mdi-subdirectory-arrow-right"
          />

          <board-button
            v-if="access.write"
            color="primary"
            class="ml-2"
            :to="`/board/${table}?act=write`"
            label="글쓰기"
            icon="mdi-pencil"
          />
        </v-col>


        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { LV } from "../../../../../util/level";
import SsrRenderar from "../../../../components/util/SsrRenderar.vue";
import DisplayTime from "./component/DisplayTime.vue";
import TagView from "./component/TagView.vue";
import FileDownload from "./component/FileDownload.vue";
import BoardButton from "./component/boardButton.vue";
import DisplayGood from "./component/DisplayGood.vue";

export default {
  components: {
    SsrRenderar,
    DisplayTime,
    TagView,
    FileDownload,
    BoardButton,
    DisplayGood,
  },
  name: "BasicRead",
  props: {
    config: Object,
    access: Object,
    id: [String, Number],
  },
  data() {
    return {
      deleteLoading: false,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
      item: (state) => state.board.read,
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
  watch: {
    id() {
      this.fetchData();
    },
  },
  serverPrefetch() {
    return this.fetchData();
  },
  mounted() {
    if (!this.item) {
      this.fetchData();
    }

    console.log(this.$vuetify);
  },
  destroyed() {
    this.SET_READ(null);
  },

  methods: {
    ...mapMutations("board", ["SET_READ"]),
    ...mapActions("board", ["getBoardRead"]),
    async fetchData() {
      console.log("FETCH : ", this.id);
      // SSR로 구동시 인증이 필요 할 경우
      const headers = {};
      if (this.$ssrContext) {
        headers.token = this.$ssrContext.token;
      }
      await this.getBoardRead({
        table: this.table,
        id: this.id,
        headers,
      });
    },
    async deleteItem(token) {
      this.delelteLoading = true;
      const result = await this.$ezNotify.confirm(
        "게시물을 삭제 하시겠습니까?",
        "게시물 삭제",
        { icon: "mdi-alert" }
      );
      if (result) {
        const data = await this.$axios.delete(
          `/api/board/${this.table}/${this.item.wr_id}?token=${token}`
        );
      }
      this.delelteLoading = false;
    },
  },
};
</script>

<style>
</style>