<template>
  <span
    class="money"
    :class="classes"
    :data-symbol="settingsState.currency.symbol"
    @click="toggleBlur"
    >{{ getValue }}</span
  >
</template>

<style lang="scss" scoped>
.negative {
  color: var(--negative);
}
span {
  white-space: nowrap;
  cursor: pointer;

  &.blurred {
    color: transparent;
    background: var(--border);
  }
}
span:not(.raw-string)::before {
  content: attr(data-symbol);
  display: inline-block;
  margin-right: 0.3em;
}
</style>

<script>
import { state as settingsState } from '~/util/settings'

export default {
  props: {
    cents: {
      type: Number,
      required: true,
    },
    rawString: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      blurred: false,
      settingsState,
    }
  },
  computed: {
    getValue() {
      const formatter = new Intl.NumberFormat(
        settingsState.currency.countryCode ?? 'en-US',
        {
          style: 'currency',
          currency: settingsState.currency.code,
        }
      )

      const str = formatter.format(this.cents / 100).trim()

      return this.rawString
        ? str
        : str.replace(settingsState.currency.symbol, '').trim()
    },
    classes() {
      const classes = []

      if (this.cents < 0) classes.push('negative')
      if (this.blurred) classes.push('blurred')
      if (this.rawString) classes.push('raw-string')

      return classes
    },
  },
  methods: {
    toggleBlur() {
      this.blurred = !this.blurred
    },
  },
}
</script>
