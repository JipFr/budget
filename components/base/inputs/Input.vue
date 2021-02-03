<template>
  <label>
    <span v-if="label">{{ label }}</span>
    <input
      :type="type"
      :min="min"
      :max="max"
      :value="value"
      @input="setChange"
    />
  </label>
</template>

<style lang="scss" scoped>
label {
  display: grid;
}
input {
  border: 0;
  padding: 8px;
  border-radius: 6px;
  background: var(--content);
  color: var(--text);
  display: block;
  width: 100%;
  font-size: 1rem;
  appearance: none;
}
span {
  color: var(--text-secondary);
}
</style>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    value: {
      type: [String, Date],
      required: true,
    },
    min: {
      type: String,
      required: false,
      default: undefined,
    },
    max: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  methods: {
    setChange(evt) {
      this.$emit('input', evt.currentTarget.value)
    },
  },
}
</script>
