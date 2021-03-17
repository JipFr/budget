<template>
  <label>
    <span v-if="label">{{ label }}</span>
    <div :class="prefix ? 'auto-fr' : ''">
      <span v-if="prefix" class="prefix">{{ prefix }}</span>
      <input
        :type="type"
        :min="min"
        :max="max"
        :value="value"
        :placeholder="placeholder"
        :class="doAltBg ? 'do-alt-bg' : ''"
        @input="setChange"
      />
    </div>
  </label>
</template>

<style lang="scss" scoped>
* {
  max-width: 100%;
  overflow: hidden;
}
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

  &.do-alt-bg {
    background: var(--body);
    border: 1px solid var(--border);
  }
}
span {
  color: var(--text-secondary);
}
.auto-fr {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
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
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    prefix: {
      type: String,
      required: false,
      default: '',
    },
    doAltBg: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    setChange(evt) {
      this.$emit('input', evt.currentTarget.value)
      this.$emit('change', evt)
    },
  },
}
</script>
