<template>
  <div v-if="fieldType == 'String'">
    <v-text-field
      label="Value"
      :value="value"
      :readonly="readonly"
      @input="onInput"
      :hide-details="readonly"
    />
  </div>
  <div v-else-if="fieldType == 'Number'">
    <v-text-field
      label="Value"
      type="number"
      :value="value"
      :readonly="readonly"
      @input="onInput"
      :hide-details="readonly"
    />
  </div>
  <div v-else-if="fieldType == 'Json'">
    <template v-if="readonly">
      <v-btn @click="jsonView"> JSON 보기</v-btn>
      <ez-dialog ref="dialog" label="JSON 값 보기" width="600">
        <pre class="mt-4">{{ stringify() }}</pre>
      </ez-dialog>
    </template>

    <v-textarea
      v-else
      label="Value"
      :value="value"
      :readonly="readonly"
      @input="onInput"
    ></v-textarea>
  </div>
  <div v-else-if="fieldType == 'Secret'">
    <input-password
      label="Secret Value"
      :value="value"
      :readonly="readonly"
      @input="onInput"
      :hide-details="readonly"
    />
  </div>
  <div v-else>
    <div>타입을 먼저 선택해 주세요.</div>
  </div>
</template>

<script>
import InputPassword from "../../../components/InputForms/InputPassword.vue";
import jsonStringify from "json-stable-stringify";
import EzDialog from "../../../components/etc/EzDialog.vue";
export default {
  components: { InputPassword, EzDialog },
  name: "TypeValue",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: {
      type: String,
    },
    fieldType: {
      type: String,
      default: "String",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
    stringify() {
      const obj = JSON.parse(this.value);
      return jsonStringify(obj, { space: "  " });
    },
    jsonView() {
      this.$refs.dialog.open();
    },
  },
};
</script>

<style>
</style> 