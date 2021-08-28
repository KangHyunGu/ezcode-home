<template>
    <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
	<v-menu v-else offset-y>
		<template v-slot:activator="{on, attrs}">
			<v-btn icon v-on="on" v-bind="attrs">
				<!-- <v-avatar color="accent" size="32">
					<v-icon>mdi-account</v-icon>
				</v-avatar> -->
                <display-avatar :member="member"/>
			</v-btn>
		</template>
		<v-card>
			<v-card-text>
				<v-switch label="Dark Theme" :input-value="darkMode" @change="setDarkMode($event)"></v-switch>
			</v-card-text>
			<template>
				<!-- <v-card-actions>
					<v-btn to="/login" color="primary" block>로그인</v-btn>
				</v-card-actions>
				<v-card-actions>
					<v-btn to="/join" color="secondary" block>회원가입</v-btn>
				</v-card-actions> -->
                <member-menu v-if="member" :member="member"/>
				<no-member-menu v-else />
			</template>
		</v-card>

	</v-menu>
</template>

<script>
import { mapState } from 'vuex';
import DisplayAvatar from './DisplayAvatar.vue';
import MemberMenu from './MemberMenu.vue';
import NoMemberMenu from './NoMemberMenu.vue';
export default {
    components : {DisplayAvatar, MemberMenu, NoMemberMenu},
    name : "SiteUser",
    data() {
        return {
            isLoading : false
        }
    },
    computed : {
       ...mapState({
			member : state => state.user.member,
		}),
        darkMode() {
            return this.$vuetify.theme.dark;
        }
    },
    mounted() {
        this.getDarkMode();
    },
    methods : {
        setDarkMode(mode) {
            this.$vuetify.theme.dark = mode;
            localStorage.setItem('darkMode', mode ? 'dark' : 'light');
        },
        getDarkMode() {
            const mode = localStorage.getItem('darkMode') === 'dark' ? true : false;
            this.$vuetify.theme.dark = mode;
        }
    }
}
</script>

