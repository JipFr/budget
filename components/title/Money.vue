<template>
  <span>{{ getValue }}</span>
</template>

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

      return formatter.format(this.cents / 100)
    },
  },
}
</script>
