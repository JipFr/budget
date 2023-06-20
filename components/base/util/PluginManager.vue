<template>
  <div>
    <div v-for="plugin of plugins" :key="`plugin-${plugin.id}`">
      <subtitle>{{ plugin.displayName }}</subtitle>

      <div v-if="plugin.state?.loading || plugin.loading" class="secondary">
        <card class="loading-card">
          <loader />
        </card>
      </div>
      <div v-else class="cards">
        <card
          v-for="(account, i) of plugin.accountCards || []"
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
          (plugin.accountCards || []).length < (plugin.accountLimit || 10)
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
