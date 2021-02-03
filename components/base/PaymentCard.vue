<template>
  <card class="no-padding">
    <div class="card-core card-sect">
      <subtitle>
        <span class="bold">{{ payment.description }}</span>
        <div
          v-if="payment.categories && payment.categories.length > 0"
          class="tags"
        >
          <tag v-for="tag in payment.categories || []" :key="tag" :tag="tag" />
        </div>
      </subtitle>
      <money :cents="payment.cents" />
    </div>
    <div class="card-actions card-sect dec-margin">
      <div class="action-wrapper">
        <button class="action-button" @click="doDelete">
          <trash-icon />
        </button>
      </div>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: nowrap;
  // align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  > * {
    width: 100%;
    min-width: 100%;
    scroll-snap-align: start;
  }
}
.action-wrapper {
  display: flex;
  flex-wrap: wrap;
  height: 100%;

  .action-button {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    width: 100%;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  svg {
    display: block;
  }

  > * + * {
    margin-left: 10px;
  }
}
.card-sect {
  padding: 15px;

  &.dec-margin {
    padding: 8px 15px;
  }
}
.bold {
  font-weight: bold;
}
.thin {
  color: var(--text-secondary);
}
.card-core {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tags {
  margin-top: 5px;
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'
import Tag from '~/components/base/Tag'

// Import icons
import TrashIcon from '~/assets/icons/trash.svg?inline'

export default {
  components: {
    Card,
    Subtitle,
    Money,
    Tag,
    TrashIcon,
  },
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
  methods: {
    doDelete() {
      if (confirm(`Delete transaction '${this.payment.description}'?`)) {
        this.$axios
          .post('/transactions/delete', {
            id: this.payment.id,
          })
          .then(({ data }) => {
            this.$nuxt.$emit('refetch')
          })
          .catch((err) => {
            alert(err)
          })
      }
    },
  },
}
</script>
