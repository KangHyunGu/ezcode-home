<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <v-card max-width="400" width="100%" elevation="10">
      <v-toolbar>
        <v-toolbar-title>
          <site-title />
        </v-toolbar-title>
      </v-toolbar>
      <v-tabs v-model="tabs" background-color="primary" dark>
        <v-tab v-for="item in items" :key="item" style="flex: 1">
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <sign-in-form @save="loginLocal" :isLoding="isLoding" />
          </v-tab-item>
          <!-- <v-tab-item>{{tabs}} 로그인</v-tab-item> -->
          <v-tab-item>
            <find-id-form @save="findId" :isLoding="isLoding" />
          </v-tab-item>

          <v-tab-item>
            <find-pw-form @save="findPw" :isLoding="isLoding" />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-card-text>
        <v-btn to="/join" block>회원가입</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import FindIdForm from "../../components/auth/FindIdForm.vue";
import FindPwForm from "../../components/auth/FindPwForm.vue";
import SignInForm from "../../components/auth/SignInForm.vue";
import SiteTitle from "../../components/layout/SiteTitle.vue";
export default {
  components: { SiteTitle, SignInForm, FindIdForm, FindPwForm },
  name: "Login",
  data() {
    return {
      tabs: parseInt(this.$route.query.tab) || 0,
      items: ["로그인", "아이디찾기", "비밀번호 찾기"],
      isLoding: false,
    };
  },

  methods: {
    ...mapActions("user", ["signInLocal", "findIdLocal", "findPwLocal"]),
    async loginLocal(form) {
      this.isLoading = true;
      const data = await this.signInLocal(form);
      //console.log('login data', data);
      if (data) {
        this.$router.push("/");
        this.$toast.info(
          `${this.$store.state.user.member.mb_name}님 환영합니다.`
        );
      }
      this.isLoading = false;
    },

    async findId(form) {
      const data = await this.findIdLocal(form);

      if (data && data.mb_id) {
        await this.$ezNotify.alert(
          `<span style="font-size:1.5em">회원아이디 : [<b> ${data.mb_id} </b>] 입니다`,
          "FindId"
        );
        this.tabs = 0;
      }
    },

    async findPw(form) {
      const data = await this.findPwLocal(form);
      if (data && data.mb_name) {
        await this.$toast.info(
          `${data.mb_name}님 ${form.mb_email}로 이메일을 발송하였습니다.`
        );
      }
    },
  },
};
</script>

<style>
</style>