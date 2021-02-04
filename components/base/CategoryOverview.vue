<template>
  <div>
    <div class="category-list">
      <card v-for="category in entries" :key="category[0]">
        <div class="card-title spread">
          <tag :tag="category[0]" />
        </div>
        <div
          class="progress-bar"
          :style="`--width: ${category[1].spentPercentage}%; --tag-color: ${
            colors[category[0]]
          }`"
        >
          <div class="progress-inner"></div>
        </div>
        <div class="cat-info">
          <div class="category-information">
            <p>Gained:</p>
            <money :cents="category[1].gained" />
          </div>
          <div class="category-information">
            <p>Spent:</p>
            <money
              :cents="category[1].spent === 0 ? 0 : category[1].spent * -1"
            />
          </div>
          <div class="category-information">
            <p>Ratio:</p>
            <span>{{ Math.round(category[1].spentPercentage) }}%</span>
          </div>
          <div class="category-information">
            <p>Total:</p>
            <money :cents="category[1].gained - category[1].spent" />
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card + .card {
  margin-top: 6px;
}
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
  margin-top: 10px;

  .category-information {
    display: grid;
    grid-template-columns: 70px 1fr;
  }
}
.progress-bar {
  width: 100%;
  border-radius: 4px;
  height: 6px;
  background: var(--body);
  margin-top: 10px;
  overflow: hidden;

  .progress-inner {
    width: var(--width, 50%);
    height: 100%;
    background: var(--tag-color, var(--theme));
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Tag from '~/components/base/Tag'
import Money from '~/components/title/Money'

export default {
  components: {
    Card,
    Tag,
    Money,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  data() {
    // Map all payments into an object that shows how much money each category has spent
    const spendings = {}

    for (const payment of this.payments) {
      // If there are no categories, add 'other' so it gets added to that
      if (payment.categories.length === 0) {
        payment.categories.push('other')
      }

      for (let tag of payment.categories) {
        tag = tag.toLowerCase().trim()
        if (tag === 'exclude') continue

        // Ensure spendings has a field for it
        if (!spendings[tag]) {
          spendings[tag] = {
            gained: 0,
            spent: 0,
          }
        }

        if (payment.cents > 0) {
          spendings[tag].gained += payment.cents
        } else {
          spendings[tag].spent += payment.cents * -1
        }
      }
    }

    // Make an array of the entries
    let entries = Object.entries(spendings)

    // Find largest "spent" field in categories, then compare the rest to it
    for (const entry of entries) {
      // Get percentage of "gained"
      const total = entry[1].gained + entry[1].spent
      entry[1].spentPercentage = (entry[1].gained / total) * 100
      entry[1].total = total
    }

    entries = entries.sort(
      (a, b) => b[1].total - a[1].total // Sort by amount of spending and gained combined; large to small
    )

    // Get each tag's color, as assigned in `user.js`
    const colors = this.$store.state.user.tagColors

    return {
      spendings,
      entries,
      colors,
    }
  },
}
</script>
