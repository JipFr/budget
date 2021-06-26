<template>
  <div>
    <chart v-if="chartLoaded" :chartdata="chartData" />

    <portal to="right-side">
      <div class="legend">
        <card>
          <subtitle>Total balance per category...</subtitle>
          <div class="tag-list">
            <div
              v-for="category in enabledCategories"
              :key="category"
              class="can-click"
              @click="toggleCategory(category)"
            >
              <tag :tag="category" :cents="categoriesTotal[category] * 100">
                {{ category }}
              </tag>
            </div>
          </div>
          <div class="tag-list">
            <div
              v-for="category in disabledCategories"
              :key="category"
              class="can-click"
              @click="toggleCategory(category)"
            >
              <tag :tag="category" :cents="categoriesTotal[category] * 100">
                {{ category }}
              </tag>
            </div>
          </div>
        </card>
      </div>
    </portal>
  </div>
</template>

<style lang="scss" scoped>
.legend {
  padding: 40px 0;
}
.tag-list {
  margin-top: 10px;
}
.tag-list + .tag-list {
  margin-top: 30px;
}
</style>

<script>
import { Portal } from 'portal-vue'
import Chart from '~/components/base/util/Chart'
import Tag from '~/components/base/Tag'
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'

export default {
  components: {
    Chart,
    Card,
    Tag,
    Subtitle,
    Portal,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  fetch() {
    this.chartData = {
      labels: [],
      datasets: [],
    }

    // Generate set of all categories
    for (const payment of this.payments) {
      if (!payment.categories.includes('exclude'))
        this.allCategories.push(...payment.categories)
    }
    this.allCategories = [...new Set(this.allCategories)]

    // Count total
    this.categoriesTotal = {}
    for (const payment of this.payments) {
      if (!payment.categories.includes('exclude')) {
        for (const category of payment.categories) {
          if (!this.categoriesTotal[category])
            this.categoriesTotal[category] = 0
          this.categoriesTotal[category] += payment.cents / 100
        }
      }
    }

    // Update category list values
    this.allCategories = this.allCategories.sort(
      (a, b) =>
        Math.abs(this.categoriesTotal[b]) - Math.abs(this.categoriesTotal[a])
    )
    this.enabledCategories = this.allCategories.filter((v) => {
      return !this.disabledCategories.includes(v)
    })

    this.enabledCategories = this.enabledCategories.filter(
      (cat) => cat !== 'exclude'
    )
    this.disabledCategories = this.disabledCategories.sort(
      (a, b) => this.allCategories.indexOf(a) - this.allCategories.indexOf(b)
    )

    // Generate field for each month in each year that has a transaction
    let monthLabels = []
    for (const payment of this.payments) {
      const d = new Date(payment.date)
      const dateString = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, 0)}`
      if (!monthLabels.includes(dateString)) monthLabels.push(dateString)
    }
    monthLabels = monthLabels.sort()

    // Generate base "categories" object
    const baseCategories = {}
    for (const category of this.enabledCategories) {
      baseCategories[category] = {
        spent: 0,
        gained: 0,
        total: 0,
      }
    }

    // Populate array with month placeholder object
    const months = monthLabels.map((label) => {
      return {
        label,
        categories: JSON.parse(JSON.stringify(baseCategories)),
      }
    })

    months.forEach((monthData) => {
      // Go through each transaction to calculate each category's price
      for (const payment of this.payments) {
        const d = new Date(payment.date)
        const dateString = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, 0)}`

        if (dateString === monthData.label) {
          if (!payment.categories.includes('exclude')) {
            // Add to total count if it's not "excluded"
            const euros = payment.cents / 100
            for (const category of payment.categories) {
              if (this.enabledCategories.includes(category)) {
                monthData.categories[category].total += euros
                if (euros > 0) {
                  monthData.categories[category].gained += euros
                } else {
                  monthData.categories[category].spent += Math.abs(euros)
                }
              }
            }
          }
        }
      }
    })

    // Now generate chart data
    this.chartData.labels = months.map((month) => {
      // Make chart labels
      const str = new Date(`${month.label}-01`).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
      })
      return str.slice(0, 1).toUpperCase() + str.slice(1)
    })

    // Get all category colors
    const colors = this.$store.state.user.tagColors

    // Add in data
    this.chartData.datasets = this.enabledCategories.map((categoryName) => {
      // Color is an RBG value
      let color = colors[categoryName.toString().trim().toLowerCase()]

      // Convert color to transparent RGBA value
      const rgbValues = color.slice(4, -1)
      color = `rgba(${rgbValues}, 0.4)`
      return {
        label: categoryName,
        backgroundColor: color,
        data: months.map((monthData) =>
          Math.floor(monthData.categories[categoryName].total)
        ),
        borderColor: 'transparent',
        borderWidth: 0,
        pointHitRadius: 25,
      }
    })

    this.chartLoaded = true
  },
  data() {
    return {
      allCategories: [],
      perMonthCategories: {},
      disabledCategories: [],
      enabledCategories: [],
      chartData: {
        labels: [],
        datasets: [],
      },
      chartLoaded: false,
      categoriesTotal: {},
    }
  },
  fetchOnServer: false,
  methods: {
    toggleCategory(cat) {
      if (!this.disabledCategories.includes(cat)) {
        this.disabledCategories.push(cat)
      } else {
        this.disabledCategories = this.disabledCategories.filter(
          (v) => v !== cat
        )
      }
      this.$fetch()
    },
  },
}
</script>
