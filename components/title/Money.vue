<template>
  <span>{{ getValue }}</span>
</template>

<style scoped>
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
