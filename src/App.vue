<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" :width="drawerWidth">
      <site-navi @close="toggleDrawer" />
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark hide-on-scroll>
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <!-- title -->
      <site-title />
      <v-spacer></v-spacer>
      <site-user />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <site-footer />
    <!-- set progressbar -->
    <vue-progress-bar></vue-progress-bar>
  </v-app>
</template>

<script>
import SiteFooter from "./components/layout/SiteFooter.vue";
import SiteTitle from "./components/layout/SiteTitle.vue";
import SiteNavi from "./components/layout/SiteNavi.vue";
import SiteUser from "./components/layout/SiteUser.vue";
import { mapMutations } from "vuex";

export default {
  components: { SiteTitle, SiteFooter, SiteNavi, SiteUser },
  name: "App",

  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    drawerWidth() {
      return this.$vuetify.breakpoint.xs ? "100%" : "360";
    },
  },
  socket() {
    return {
      "config:update": (data) => {
        this.SET_CONFIG(data);
      },
      "config:remove": (key) => {
        this.SET_CONFIG({ key, value: null });
      },
    };
  },

  mounted() {
    // 한 서버에 접속한 모든 client Sync
    // this.$socket.on("config:update", (data) => {
    //   try {
    //     data.value = JSON.parse(data.value);
    //   } catch (e) {}
    //   this.SET_CONFIG(data);
    // });
    // this.$socket.on("config:remove", (key) => {
    //   console.log(key);
    //   this.SET_CONFIG({ key, value: null });
    // });
  },

  destroyed() {
    // this.$socket.off("config:update");
    // this.$socket.off("config:remove");
  },
  methods: {
    ...mapMutations(["SET_CONFIG"]),
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>
