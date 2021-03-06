<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>게시판 관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn label="게시판 추가" icon to="/adm/board/form">
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:item.bo_subject="{ item }">
        <v-btn
          :to="`/board/${item.bo_table}`"
          text
          class="ma-0 pa-0 justify-start"
        >
          {{ item.bo_subject }}
        </v-btn>
      </template>

      <template v-slot:item.cmd="{ item }">
        <v-btn icon :to="`/adm/board/form/${item.bo_table}`">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="isSuper"
          icon
          @click="removeBoard(item)"
          :loading="btnLoading"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import qs from "qs";
import { deepCopy } from "../../../../util/lib";
import TooltipBtn from "../../../components/etc/TooltipBtn.vue";
import { mapGetters } from "vuex";
export default {
  components: { TooltipBtn },
  name: "AdmBoardList",
  data() {
    return {
      headers: [
        { text: "ID", value: "bo_table", sortable: true },
        { text: "이름", value: "bo_subject", sortable: true },
        { text: "스킨", value: "bo_skin", sortable: true },
        { text: "목록", value: "bo_list_level", sortable: false },
        { text: "읽기", value: "bo_read_level", sortable: false },
        { text: "쓰기", value: "bo_write_level", sortable: false },
        { text: "덧글", value: "bo_comment_level", sortable: false },
        { text: "CMD", value: "cmd", sortable: false },
      ],
      items: [],
      options: {},
      totalItems: 0,
      loading: false,
      btnLoading: false,
    };
  },
  computed: {
    ...mapGetters("user", ["isSuper"]),
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  methods: {
    async getDataFromApi() {
      this.loading = true;
      const payload = deepCopy(this.options);
      const query = qs.stringify(payload);

      const data = await this.$axios.get(`/api/adm/board?${query}`);
      if (data) {
        this.items = data.items;
        this.totalItems = data.totalItems;
      }
      this.loading = false;
    },
  },
  async removeBoard(item) {
    const result = await this.$ezNotify.confirm(
      `[${item.bo_subject}] 게시판을 삭제 하시겠습니까?`,
      "게시판 삭제",
      { icon: "mdi-alert" }
    );
    if (!result) return;

    // TODO : 서버에 요청
    this.btnLoading = true;
    const data = await this.$axios.delete(`/api/adm/board/${item.bo_table}`);
    this.btnLoading = false;
    if (data) {
      this.$toast.info(
        `${item.bo_subject} 게시판 삭제되었습니다 (파일:${data.fileCnt}, 태그:${data.tagCnt}, 좋아요${data.goodCnt})`
      );
      this.getDataFromApi();
    }
  },
};
</script>

<style>
</style>