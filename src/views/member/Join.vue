<template>
	<div class="d-flex justify-center align-center" style="height:100%">
		<v-card max-width="400" width="100%" elevation="10">
		<v-toolbar>
			<v-toolbar-title>회원가입</v-toolbar-title>
		</v-toolbar>
		<v-card-text> 
					<!-- SignupForm.vue 에서 props 받아 중복 처리 -->
					<sing-up-form :cbCheckId="checkId" :cbCheckEmail="checkEmail"
					@OnSave="save"
					:isLoading="isLoading"/>
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
	title: '회원가입',
	data(){
		return {
		isLoading: false
		}
	},
	methods : {
		...mapActions('user', ['duplicateCheck', 'createMember']),

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
		},

		async save(form){
			this.isLoading = true
			const data = await this.createMember(form);
			this.isLoading = false
			if(data) {
				const mb_name = form.get('mb_name')
				this.$toast.info(`${mb_name}님 회원가입 하셨습니다.`);
				this.$router.push('/login')
			}
		}
	}
}
</script>

<style>
</style>