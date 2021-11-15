<template>
  <span class="money" :class="classes" @click="toggleBlur">{{ getValue }}</span>
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
  content: '€';
  display: inline-block;
  margin-right: 0.3em;
}
</style>

<script>
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
    }
  },
  computed: {
    getValue() {
      const formatter = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
      })

      const str = formatter.format(this.cents / 100).trim()

      return this.rawString ? str : str.replace(/€/g, '').trim()
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
