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
span::before {
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

      return formatter
        .format(this.cents / 100)
        .replace(/€/g, '')
        .trim()
    },
    classes() {
      const classes = []

      if (this.cents < 0) classes.push('negative')
      if (this.blurred) classes.push('blurred')

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
