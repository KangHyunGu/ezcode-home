<template>
  <div v-if="member">CommentForm</div>
  <div v-else>
    로그인후 댓글을 작성 할 수 있습니다.
    <v-btn :to="`/login?next=${$route.fullPath}`">로그인</v-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";
import validateRules from "../../../../../../util/validateRules";
export default {
  name: "CommentForm",
  props: {
    table: { type: String, required: true },
    wr_reply: { type: Number, required: true }, //게시물 번호
    parent: { type: Number, default: 0 },
  },
  data() {
    return {
      valid: true,
      form: null,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
    rules: () => validateRules,
  },
};
</script>

<style>
</style>