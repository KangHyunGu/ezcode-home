<template>
  <v-card>
    <v-card-title>
      {{ subject }}
      <v-spacer />
      <v-btn :to="`/board/${table}`">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <div v-for="item in items" :key="item.wr_id">
        <v-divider />
        <v-list-item :to="`/board/${table}/${item.wr_id}`">
          <v-chip
            v-if="item.wr_category"
            outlined
            small
            color="primary"
            class="mr-4"
            label
          >
            {{ item.wr_category }}
          </v-chip>
          <v-list-item-content class="flex-nowrap">
            <div class="text-truncate" style="width: 60%">
              {{ item.wr_title }}
            </div>
          </v-list-item-content>
          <v-list-item-action-text>
            <v-chip small label color="transparent" class="ml-2">
              <v-icon x-small left>mdi-message</v-icon>
              {{ item.replys }}
            </v-chip>
            <display-time :time="item.wr_createat" />
          </v-list-item-action-text>
        </v-list-item>
      </div>
    </v-list>
  </v-card>
</template>

<script>
import DisplayTime from "../../../layout/DisplayTime.vue";
import { getImage } from "../../../../../util/lib";
export default {
  components: { DisplayTime },
  name: "Latest",
  props: {
    table: { type: String, required: true },
    subject: { type: String, required: true },
    items: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  computed: {
    getImage: () => getImage,
  },
};
</script>

<style>
</style>