<template>
  <div class="two-cols from-until-picker">
    <app-input v-model="from" type="date" label="From" :max="until" />
    <app-input v-model="until" type="date" label="Until" :min="from" />
  </div>
</template>

<style lang="scss" scoped>
.two-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}
</style>

<script>
import { mapMutations } from 'vuex'
import AppInput from '~/components/base/inputs/Input'

export default {
  components: {
    AppInput,
  },
  data() {
    const store = this.$store.state.user
    return {
      from: store.from,
      until: store.until,
    }
  },
  watch: {
    from() {
      this.setFrom(this.from)
    },
    until() {
      this.setUntil(this.until)
    },
  },
  methods: {
    ...mapMutations({
      setFrom: 'user/setFrom',
      setUntil: 'user/setUntil',
    }),
  },
}
</script>
