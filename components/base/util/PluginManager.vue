<template>
  <div>
    <div v-for="plugin of plugins" :key="`plugin-${plugin.id}`">
      <div
        v-if="
          (!(plugin.state?.loading || plugin.loading) &&
            minimal &&
            (plugin.accountCards || []).filter((t) =>
              onlyErrors ? t.error : true
            ).length > 0) ||
          !minimal
        "
        class="subtitle-wrapper"
      >
        <component :is="plugin.icon" />
        <subtitle>
          {{ plugin.displayName }}
          <span v-if="plugin.description" class="secondary">
            <!-- eslint-disable-next-line no-irregular-whitespace -->
            — {{ plugin.description }}
          </span>
        </subtitle>
      </div>

      <div
        v-if="(plugin.state?.loading || plugin.loading) && !minimal"
        class="secondary"
      >
        <card class="loading-card">
          <loader />
        </card>
      </div>
      <div v-else class="cards">
        <card
          v-for="(account, i) of (plugin.accountCards || []).filter((t) =>
            onlyErrors ? t.error : true
          )"
          :key="`${plugin.id}-account-${i}`"
        >
          <div class="spread">
            <h4>{{ account.title }}</h4>
            <app-button
              class="dangerous"
              @click="() => removeAccount(plugin, account.id)"
            >
              Remove account
            </app-button>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="card-content" v-html="account.html" />
        </card>
      </div>
      <app-button
        v-if="
          !(plugin.state?.loading || plugin.loading) &&
          plugin.addAccount &&
          (plugin.accountCards || []).length < (plugin.accountLimit || 10) &&
          !minimal
        "
        class="secondary add-account"
        @click="addAccount(plugin)"
      >
        Add account
      </app-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secondary {
  color: var(--text-secondary);
}
.subtitle {
  margin-top: 2rem;
}
.button.add-account {
  margin-top: 1rem;
}

.cards {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.spread {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-card {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card button {
  font-size: 0.9rem;
  text-transform: initial;
  background: transparent;
  color: var(--negative);
  padding: 0;
  border: 0;
}

.subtitle-wrapper {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
  margin-top: 60px;
  margin-bottom: 10px;

  .subtitle {
    margin: 0;
  }
  svg {
    display: block;
  }
}

.card-content {
  margin-top: 1rem;

  ::v-deep(span) {
    color: var(--text-secondary);
  }

  ::v-deep(.mt) {
    margin-top: 1rem;
  }
}

a {
  color: var(--anchor);
}
</style>

<script>
// Import components
import Subtitle from '~/components/title/Subtitle'
import Card from '~/components/layout/Card'
import AppButton from '~/components/util/Button'
import Loader from '~/components/util/Loader'

import { plugins } from '~/krab-plugins/'

export default {
  components: {
    Subtitle,
    Card,
    AppButton,
    Loader,
  },
  props: {
    minimal: {
      type: Boolean,
      default: false,
    },
    onlyErrors: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      plugins,
    }
  },
  methods: {
    async addAccount(plugin) {
      await plugin.addAccount()
    },
    removeAccount(plugin, accountId) {
      plugin.removeAccount(accountId)
    },
  },
}
</script>
