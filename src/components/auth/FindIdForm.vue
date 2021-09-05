<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-text-field
      label="이름"
      v-model.trim="form.mb_name"
      :rules="rules.name()"
    />

    <v-text-field
      label="이메일"
      v-model.trim="form.mb_email"
      :rules="rules.email()"
    />

    <v-btn block color="primary" type="submit" :loading="isLoding">
      아이디 찾기
    </v-btn>
  </v-form>
</template>

<script>
import validateRules from "../../../util/validateRules";
export default {
  name: "FindIdform",
  props: {
    isLoding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      form: {
        mb_name: "kang",
        mb_email: "kang@test.com",
      },
    };
  },

  computed: {
    rules: () => validateRules,
  },
  methods: {
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      this.$emit("save", this.form);
    },
  },
};
</script>

<style>
</style>