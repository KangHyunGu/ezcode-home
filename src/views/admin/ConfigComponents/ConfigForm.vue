<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-btn type="submit" block>저장</v-btn>
  </v-form>
</template>

<script>
export default {
  name: "ConfigForm",
  data() {
    return {
      valid: true,
      form: {
        test: "test",
      },
    };
  },
  methods: {
    async save() {
      this.$refs.form.validate();
      console.log(this.valid);
      await this.$nextTick();
      if (!this.valid) return;
      this.$emit("save", this.form);
    },
  },
};
</script>

<style>
</style>