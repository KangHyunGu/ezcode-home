<template>
  <div>
    <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
    <v-menu v-else offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs">
          <!-- <v-avatar color="accent" size="32">
					<v-icon>mdi-account</v-icon>
				</v-avatar> -->
          <display-avatar :member="member" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-switch
            label="Dark Theme"
            :input-value="darkMode"
            @change="setDarkMode($event)"
          ></v-switch>
        </v-card-text>
        <template>
          <!-- <v-card-actions>
					<v-btn to="/login" color="primary" block>로그인</v-btn>
				</v-card-actions>
				<v-card-actions>
					<v-btn to="/join" color="secondary" block>회원가입</v-btn>
				</v-card-actions> -->
          <member-menu v-if="member" @Open="openDialog" />
          <no-member-menu v-else />
        </template>
      </v-card>
    </v-menu>
    <v-dialog v-if="member" v-model="dialog" persistent max-width="500">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>회원정보수정</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="closeDialog">
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <user-update-form
            :member="member"
            :isLoding="isLoading"
            :cbCheckEmail="checkEmail"
            @OnSave="save"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DisplayAvatar from "./DisplayAvatar.vue";
import MemberMenu from "./MemberMenu.vue";
import NoMemberMenu from "./NoMemberMenu.vue";
import UserUpdateForm from "../auth/UserUpdateForm.vue";
export default {
  components: { DisplayAvatar, MemberMenu, NoMemberMenu, UserUpdateForm },
  name: "SiteUser",
  data() {
    return {
      isLoading: false,
      dialog: false,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
    darkMode() {
      return this.$vuetify.theme.dark;
    },
  },
  mounted() {
    this.getDarkMode();
  },
  methods: {
    ...mapActions("user", ["duplicateCheck", "checkPassword", "updateMember"]),
    setDarkMode(mode) {
      this.$vuetify.theme.dark = mode;
      localStorage.setItem("darkMode", mode ? "dark" : "light");
    },
    getDarkMode() {
      const mode = localStorage.getItem("darkMode") === "dark" ? true : false;
      this.$vuetify.theme.dark = mode;
    },
    async checkMember() {},
    async openDialog() {
      //임시
      this.dialog = true;

      //    if(!this.member.mb_provider){
      //     //소셜 로그인이 아닌 경우 password 체크
      //     const mb_password = await this.$ezNotify.prompt(
      //         '비밀번호를 입력하세요',
      //         '회원정보 수정',
      //     {icon : 'mdi-alert',  formType:'password'}
      //     );

      //     //페스워드가 입력이 되어 있다면...
      //     if(mb_password){
      //        this.dialog = await this.checkPassword({mb_password});
      //     }

      //    } else {
      //        //소셜 로그인일 경우 비밀번호 확인은 Skip
      //         this.dialog = true;
      //    }
    },

    closeDialog() {
      this.dialog = false;
    },

    async save(form) {
      this.isLoading = true;
      const data = await this.updateMember(form);
      this.isLoading = false;
      if (data) {
        this.closeDialog();
        this.$toast.info(
          `${this.$store.state.user.member.mb_name}님 회원정보수정이 완료되었습니다.`
        );
      }
    },

    async checkEmail(email) {
      const data = await this.duplicateCheck({
        field: "mb_email",
        value: email,
      });
      return data;
    },
  },
};
</script>

