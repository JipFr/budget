<template>
  <span class="money" :class="cents < 0 ? 'negative' : ''">{{ getValue }}</span>
</template>

<style scoped>
.negative {
  color: var(--negative);
}
span {
  white-space: nowrap;
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
  },
}
</script>
