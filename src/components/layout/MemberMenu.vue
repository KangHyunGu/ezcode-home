<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('Open')" block>회원정보수정</v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn color="secondary" block @click="logout">로그아웃</v-btn>
    </v-card-actions>

   
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
 
  name: "MemberMenu",
  data() { 
  return {
    dialog : false,
    isLoading : false,
    }
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
  },
  methods: {
    ...mapActions("user", ["signOut", 'duplicateCheck']),
    async logout() {
      const mb_name = await this.signOut();
      if (mb_name) {
        this.$toast.info(`${mb_name}님 로그아웃 하였습니다.`);
        if (this.$route.name != "Home") {
          this.$router.push("/");
        }
      }
    },
  },
};
</script>

<style>
</style>