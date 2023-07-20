<template>
  <div class="settings-page">
    <page-title>Settings</page-title>

    <div v-if="!settingsState.loaded">Loading...</div>
    <div v-else class="settings">
      <div class="setting">
        <div>
          <h3>Month starting date</h3>
          <p>
            The month starting date is used to calculate the month's budget. For
            example, if you set the month starting date to the 15th, the budget
            for the month of January will be calculated from January 15th to
            February 14th.
          </p>
          <p>Reload the page for changes to take effect.</p>
        </div>
        <aside>
          <div class="days-grid">
            <div class="fake-day day"></div>
            <div class="fake-day day"></div>
            <div class="fake-day day"></div>
            <button
              v-for="(_, i) of Array(28).fill(0)"
              :key="i"
              class="day"
              :class="settingsState.startDate === i + 1 && 'selected-date'"
              @click="() => setStartDate(i + 1)"
            >
              <label>{{ Number(i) + 1 }}</label>
            </button>
          </div>
        </aside>
      </div>
      <div class="setting">
        <div>
          <h3>Symbol</h3>
          <p>
            Currency (symbol) shown in the app. This is only a cosmetic change,
            you can use any currency in the list format you want. Transactions
            do not keep track of the currency they're in, so changing this will
            change it everywhere.
          </p>
        </div>
        <aside>
          <div class="currencies-grid">
            <card
              v-for="currency of currenciesArray"
              :key="`currency-${currency.code}`"
              :class="
                settingsState.currency.code === currency.code && 'highlight'
              "
              @click="() => setCurrency(currency.code)"
            >
              <h4>{{ currency.symbol }}</h4>
              <p>{{ currency.nameFull }}</p>
            </card>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  max-width: 900px;
}
.setting {
  padding: 40px 0;
  border-bottom: 1px solid var(--border);
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 260px;
  gap: 100px;

  h3 {
    font-size: 1.5rem;
  }

  p {
    margin-top: 1rem;
    color: var(--text-secondary);
  }
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 3px;

  .day {
    aspect-ratio: 1/1;
    width: 100%;
    background: var(--content-light);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    color: inherit;
    border: 0;
    font-size: 1rem;
    padding: 0;
  }

  .day:not(.fake-day) {
    cursor: pointer;

    > * {
      pointer-events: none;
    }
  }

  .day.selected-date {
    background: var(--content);
    font-weight: bold;
    border: 2px solid var(--theme);
  }

  .fake-day {
    opacity: 0.5;
    border: 0;
  }
}

.currencies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  text-align: center;

  .card {
    cursor: pointer;
  }

  .card:not(.highlight) {
    background: var(--content-light);
  }

  h4 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
}

@media (prefers-color-scheme: light) {
  .days-grid .day {
    background: var(--content);
  }
}

@media (max-width: 1000px) {
  .setting {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import Card from '~/components/layout/Card'

// Import settings util
import {
  loadSettings,
  setSetting,
  state as settingsState,
  currenciesArray,
} from '~/util/settings'

export default {
  components: {
    PageTitle,
    Card,
  },
  data() {
    return {
      settingsState,
      currenciesArray,
    }
  },
  async fetch() {
    await loadSettings()
  },
  head: {
    bodyAttrs: {
      'no-right': true,
    },
  },
  methods: {
    async setStartDate(date) {
      await setSetting('startDate', date)
    },
    async setCurrency(currencyCode) {
      await setSetting('currency', currencyCode)
    },
  },
}
</script>
