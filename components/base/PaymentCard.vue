<template>
  <card>
    <div class="card-core">
      <subtitle>
        <div class="title-core bold">
          <span>{{ payment.title }}</span>
          <div class="tag-dots">
            <div class="dot dot1"></div>
            <div class="dot dot2"></div>
            <div class="dot dot3"></div>
            <div class="dot dot4"></div>
          </div>
        </div>
        <div v-if="payment.tags && false" class="tags">
          <tag v-for="tag in payment.tags || []" :key="tag" :tag="tag" />
          <!-- {{ getTags }} -->
        </div>
      </subtitle>
      <money :cents="payment.cents" />
    </div>
  </card>
</template>

<style lang="scss" scoped>
.title-core {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  > * + * {
    margin-left: 10px;
  }
}

.tag-dots {
  display: flex;
  // padding: 3px 8px;
  // background: rgba(255, 255, 255, 0.1);
  // border-radius: 6px;

  .dot {
    width: 8px;
    height: 8px;
    background: hsl(187, 100%, 50%);
    border-radius: 50%;

    &.dot2 {
      background: hsl(230, 50%, 50%);
    }
    &.dot3 {
      background: hsl(10, 50%, 50%);
    }
    &.dot4 {
      background: hsl(100, 50%, 50%);
    }
  }

  > * + * {
    margin-left: 3px;
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

export default {
  components: {
    Card,
    Subtitle,
    Money,
    Tag,
  },
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getTags() {
      const str = (this.payment.tags || []).join(', ').toLowerCase()
      return str.slice(0, 1).toUpperCase() + str.slice(1)
    },
  },
}
</script>
