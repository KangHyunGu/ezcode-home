<template>
  <v-card-text>
    <commnet-form
      :wr_reply="id"
      :table="table"
      :parent="0"
      @onUpdate="updateItem"
    />
    <v-list>
      <commnet-item
        v-for="(item, i) in items"
        :key="item.wr_id"
        :item="item"
        :idx="i"
        :table="table"
        :access="access"
        @onInComment="inComment"
        @onUpdate="updateItem"
        @onRemove="removeItem"
      />
      <v-list-item v-if="loading">
        <v-list-item-content>
          <v-progress-circular :value="20" indeterminate />
        </v-list-item-content>
      </v-list-item>
      <div v-else v-intersect="onIntersect"></div>
    </v-list>
  </v-card-text>
</template>

<script>
import CommnetForm from "./CommentForm.vue";
import CommnetItem from "./CommentItem.vue";
export default {
  components: { CommnetForm, CommnetItem },
  name: "CommentList",
  props: {
    table: { type: String, required: true },
    id: { type: Number, require: true },
    access: { type: Object, required: true },
  },
  data() {
    return {
      items: [],
      loading: false,
      totalItems: 0,
      options: {
        itemsPerPage: 5,
        limitStart: 0,
        sortBy: ["wr_grp", "wr_order"],
        sortDesc: [false, true],
        stf: ["wr_reply"],
        stc: ["eq"],
        stx: [this.id],
      },
    };
  },
  mounted() {
    console.log(this.access);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const data = await this.$axios.get(`/api/board/list/${this.table}`, {
        params: this.options,
      });

      if (data) {
        this.setData(data);
      }
      setTimeout(() => {
        this.loading = false;
      });
    },
    setData(data) {
      this.items = [...this.items, ...data.items];
      this.totalItems = data.totalItems;
      this.options.limitStart += this.options.itemsPerPage; // 다음 페이지 가지고 올 위치
    },
    updateItem(item) {
      const find = this.items.find((p) => p.wr_id == item.wr_id);
      if (find) {
        // 수정
        const idx = this.items.indexOf(find);
        this.items.splice(idx, 1, item);
      } else {
        // 신규
        this.items.unshift(item);
        this.totalItems++;
        this.options.limitStart++;
      }
    },
    inComment(parent, item) {
      //코멘트 답글 추가
      //console.log("inComment", parent, item);
      const find = this.items.find((item) => item.wr_id == parent.wr_id);
      if (find) {
        const idx = this.items.indexOf(find);
        this.items.splice(idx + 1, 0, item);
        this.totalItems++;
        this.options.limitStart++; // 다음 페이지 가지고 올 인덱스
      }
    },
    onIntersect(entries, observer) {
      if (this.items.length < this.totalItems) {
        console.log(this.totalItems);
        if (entries[0].isIntersecting) {
          this.fetchData();
        }
      }
    },
    removeItem(item, cnt) {
      const idx = this.items.indexOf(item);
      if (idx >= 0) {
        this.items.splice(idx, cnt);
        this.totalItems -= cnt;
        this.options.limitStart -= cnt;
      }
    },
  },
};
</script>

<style>
</style>