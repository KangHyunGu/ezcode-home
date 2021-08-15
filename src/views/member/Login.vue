<template>
	<div class="d-flex justify-center align-center" style="height:100%">
		<v-card max-width="400" width="100%" elevation="10">
			<v-toolbar>
				<v-toolbar-title>
					<site-title />
				</v-toolbar-title>
			</v-toolbar>
			<v-tabs v-model="tabs" background-color="primary" dark>
				<v-tab v-for="item in items" :key="item" style="flex:1">
					{{item}}
				</v-tab>
			</v-tabs>
			<v-card-text> 
				<v-tabs-items v-model="tabs">

					<v-tab-item>
						<sign-in-form @save="loginLocal" :isLoding="isLoding"/>
					</v-tab-item>
					<!-- <v-tab-item>{{tabs}} 로그인</v-tab-item> -->
					<v-tab-item>{{tabs}} 아이디</v-tab-item>
					<v-tab-item>{{tabs}} 비번</v-tab-item>
				</v-tabs-items>
			</v-card-text>

			<v-card-text>
				<v-btn to="/join" block>회원가입</v-btn>
			</v-card-text> 
		</v-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import SignInForm from '../../components/auth/SignInForm.vue'
import SiteTitle from '../../components/layout/SiteTitle.vue'
export default {
  components: { SiteTitle, SignInForm },
  name : "Login",
data() {
	  return {
		  tabs : 0,
		  items : ['로그인', '아이디찾기', '비밀번호 찾기'],
		  isLoding : false,
	  }
  },
  methods : {
	  ...mapActions('user', ['signInLocal']),
	  async loginLocal(form) {
		  const data = await this.signInLocal(form)
	  }
  }
}
</script>

<style>

</style>