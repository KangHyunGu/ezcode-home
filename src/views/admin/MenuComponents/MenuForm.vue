<template>
  <v-form
    @submit.prevent="save"
    v-if="form"
    v-model="valid"
    ref="form"
    lazy-validation
  >
    <v-btn
      plain
      href="https://materialdesignicons.com"
      target="_black"
      color="success"
      small
    >
      머터리얼 디자인 아이콘</v-btn
    >
    <v-text-field
      label="아이콘"
      v-model="form.icon"
      :prepend-icon="form.icon"
    />

    <v-text-field
      label="이름"
      v-model="form.title"
      :rules="[rules.require({ label: '이름' })]"
    />
    <v-text-field label="링크" v-model="form.to" />
    <input-level label="접근권한" v-model="form.grant" />
    <v-checkbox label="새창에서 열기" v-model="form.newTab" />
    <v-btn block type="submit" color="primary"> 저장 </v-btn>
  </v-form>
</template>

<script>
import InputLevel from "../../../components/InputForms/InputLevel.vue";
import validateRules from "../../../../util/validateRules";
import { deepCopy } from "../../../../util/lib";
export default {
  components: { InputLevel },
  name: "MenuForm",
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: null,
    };
  },
  computed: {
    rules: () => validateRules,
  },

  watch: {
    // item 정보가 수정 될 경우 init() 함수로 재 샛팅
    item() {
      this.init();
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      if (this.item) {
        this.form = deepCopy(this.item);
      } else {
        // 기본 값 삽입
        this.form = {
          grant: 0,
          icon: "mdi-",
          newTab: false,
          subItems: [],
          title: "",
          to: "",
        };
      }

      console.log("initFormData : ", this.form);
    },

    async save() {
      this.$refs.form.validate();
      // validate() 값 끝나기 전까지 기다린이후
      // 프레임에서 값을 가져온다.(this.valid)
      await this.$nextTick();
      if (!this.valid) return;
      this.$emit("save", this.form);
      this.init();
    },
  },
};
</script>

<style>
</style>