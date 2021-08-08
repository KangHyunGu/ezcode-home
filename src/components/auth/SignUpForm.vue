<template>
   <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <input-duplicate-check
			ref="id"
      v-model="form.mb_id"
      label="아이디"
      prepend-icon="mdi-account"
			counter="30"
			:rules="rules.id()"
			:cbCheck="cbCheckId"
    />

    <v-text-field
      label="이름"
      v-model="form.mb_name"
      prepend-icon="mdi-card-account-details-outline"
      :rules="rules.name()"
    />

    <input-password 
      label="비밀번호"
      v-model="form.mb_password"
      prepend-icon="mdi-lock"
      :rules="rules.password()"
    />

    <input-password 
      label="비밀번호확인"
      v-model="confirpw"
      prepend-icon="mdi-lock-check"
      :rules="[rules.matchValue(form.mb_password)]"
    />

    <input-duplicate-check
			ref="email"
      label="이메일"
      prepend-icon="mdi-email"
			v-model="form.mb_email"
			:rules="rules.email()"
			:cbCheck="cbCheckEmail"
    />

     <input-date v-model="form.mb_birth" 
      label="생년월일" 
      prepend-icon="mdi-calendar"
      :rules="rules.date({label:'생년월일'})"
     />

     <input-radio v-model="form.mb_gender" 
     :items="genderItems" 
     row 
     prepend-icon='mdi-gender-male-female'
     :rules="[rules.require({label : '성별'})]"
     />

    <input-phone v-model="form.mb_phone" 
    label="전화번호" 
    prepend-icon='mdi-phone' 
    :rules="rules.phone()"
    />

    <!-- required="false" 필수 입력 체크 skip -->
    <input-post 
    :zipcode.sync="form.mb_zip" 
    :addr1.sync="form.mb_addr1" 
    :addr2.sync="form.mb_addr2"
    />

    <v-btn type="submit" block color="primary" :loading="isLoading">회원가입</v-btn>
  </v-form>
</template>

<script>
import validateRules from "../../../util/validateRules";
import InputDuplicateCheck from "../InputForms/InputDuplicateCheck.vue";
import InputPassword from '../InputForms/InputPassword.vue';
import InputDate from '../InputForms/InputDate.vue';
import InputRadio from '../InputForms/InputRadio.vue';
import InputPhone from '../InputForms/inputPhone.vue';
import InputPost from '../InputForms/InputPost.vue';
export default {
  components: { InputDuplicateCheck, InputPassword,  InputDate, InputRadio, InputPhone, InputPost},
  name: "SignUpForm",
  props : {
    isLoading : {
			type: Boolean,
			default : false
		},
		cbCheckId : {
			type: Function,
			default : null,
		},
    cbCheckEmail : {
      type : Function,
      default : null
    }
	},
  data() {
    return {
      valid: true,
      form: {
        mb_id: "test1",
        mb_password: "test1234",
        mb_name: "test",
        mb_birth: "2021-08-08",
        mb_gender: "M",
        mb_email: "test@test.com",
        mb_phone: "010-1111-1111",
        mb_zip: "12345",
        mb_addr1: "서울 종로구 이화동 113",
        mb_addr2: "",
      },
      genderItems : [
        {label : '남자', value : 'M'},
        {label : '여자', value : 'F'}
      ],
      confirpw : "test1234",

      // form: {
      //   mb_id: "test1",
      //   mb_password: "test1234",
      //   mb_name: "test",
      //   mb_birth: "",
      //   mb_gender: "",
      //   mb_email: "test@test.com",
      //   mb_phone: "",
      //   mb_zip: "",
      //   mb_addr1: "",
      //   mb_addr2: "",
      // },
      // confirpw : "test1234",
    };
  },
  computed: {
    rules : () => validateRules
  },
  methods: {
    async save() {
      this.$refs.form.validate();
			await this.$nextTick();
			if(!this.valid) return;
      if(!this.$refs.id.validate()) return;
      if(!this.$refs.email.validate()) return;
      console.log( this.$emit('OnSave', this.form));
      this.$emit('OnSave', this.form);
    },
  },
};
</script>

<style>
</style>