<template>
  <div class="two-cols from-until-picker">
    <app-input v-model="from" type="date" label="From" :max="until" />
    <app-input v-model="until" type="date" label="Until" :min="from" />
    <dropdown>
      <dropdown-item :icon="RefreshIcon" @click="resetDates">
        Reset
      </dropdown-item>
      <dropdown-item :icon="PlusCircleIcon" @click="setAllTime">
        All time
      </dropdown-item>
      <dropdown-item :icon="ChevronRightIcon" @click="setEndOfTime">
        End of time
      </dropdown-item>
    </dropdown>
  </div>
</template>

<style lang="scss" scoped>
.two-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr) auto;
  align-items: flex-end;
  grid-gap: 10px;
}
</style>

<script>
import { mapMutations } from 'vuex'
import { getDefaultDates } from '~/util/dates'

// Import components
import AppInput from '~/components/base/inputs/Input'
import Dropdown from '~/components/base/util/Dropdown'
import DropdownItem from '~/components/base/util/DropdownItem'

// Import icons
import RefreshIcon from '~/assets/icons/refresh.svg?inline'
import PlusCircleIcon from '~/assets/icons/plus-circle.svg?inline'
import ChevronRightIcon from '~/assets/icons/chevron-right.svg?inline'

export default {
  components: {
    AppInput,
    Dropdown,
    DropdownItem,
  },
  data() {
    const store = this.$store.state.user
    return {
      from: store.from,
      until: store.until,
      RefreshIcon,
      PlusCircleIcon,
      ChevronRightIcon,
    }
  },
  computed: {
    stateFrom() {
      return this.$store.state.user.from
    },
    stateUntil() {
      return this.$store.state.user.until
    },
  },
  watch: {
    from() {
      this.setFrom(this.from)
    },
    until() {
      this.setUntil(this.until)
    },
    stateFrom(newFrom) {
      this.from = newFrom
    },
    stateUntil(newUntil) {
      this.until = newUntil
    },
  },
  methods: {
    ...mapMutations({
      setFrom: 'user/setFrom',
      setUntil: 'user/setUntil',
    }),
    resetDates() {
      // TODO: this lmao
      const { from, until } = getDefaultDates()

      this.setUntil(until.toISOString().split('T')[0])
      this.setFrom(from.toISOString().split('T')[0])
    },
    setAllTime() {
      this.setFrom(new Date('1 jan 2000 00:00').toISOString().split('T')[0])
      this.setUntil(new Date('1 jan 3000 00:00').toISOString().split('T')[0])
    },
    setEndOfTime() {
      this.resetDates()
      this.setUntil(new Date('1 jan 3000 00:00').toISOString().split('T')[0])
    },
  },
}
</script>
