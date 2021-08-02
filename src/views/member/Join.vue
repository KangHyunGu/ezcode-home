<template>
	<div class="d-flex justify-center align-center" style="height:100%">
		<v-card max-width="400" width="100%" elevation="10">
		<v-toolbar>
			<v-toolbar-title>회원가입</v-toolbar-title>
		</v-toolbar>
		<v-card-text> 
					<!-- SignupForm.vue 에서 props 받아 중복 처리 -->
					<sing-up-form :cbCheckId="checkId" :cbCheckEmail="checkEmail"/>
				</v-card-text>
		</v-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import SingUpForm from "../../components/auth/SignUpForm.vue";
export default {
	components: { SingUpForm },
	name: "Join",
	methods : {
		...mapActions('user', ['duplicateCheck']),

		//ID 중복 검사
		async checkId(id) {
			console.log('id : ' + id); 
			const data = await this.duplicateCheck({field: 'mb_id', value: id});
			return data;
		},

		//이메일 중복 검사
		async checkEmail(email) {
			console.log('email : ' + email); 
			const data = await this.duplicateCheck({field: 'mb_email', value: email});
			return data;
		}
	}
}
</script>

<style>
</style>