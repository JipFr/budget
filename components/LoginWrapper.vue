<!-- eslint-disable no-unused-vars -->
<template>
  <div v-if="user || $fetchState.pending">
    <slot />
  </div>
  <div v-else>
    <app-header title="Log in" />
    <container class="limited-width">
      <h1>BudgetDuck</h1>
      <p>
        This would be a good place to put a fantastic tag line, or description.
        Who knows what I'll come up with.
      </p>
      <hr />
      <div class="logos">
        <button data-link="github" @click="login('github')">
          <github-logo />
        </button>
        <button data-link="discord" @click="login('discord')">
          <discord-logo />
        </button>
      </div>
    </container>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 500px;
  margin: 80px auto;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5em;
}

p {
  color: var(--text-secondary);
}

hr {
  margin: 30px 0;
  border-color: var(--border);
}

.logos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 10px;

  button {
    padding: 20px;
    border-radius: 6px;
    font-size: 1rem;
    border: 1px solid var(--border);
    background: var(--alt-content);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 0.8;
    }

    svg {
      width: 2rem;
      height: 2rem;
      display: block;
    }

    &[data-link='github'] {
      background: #24292f;
      color: white;
    }

    &[data-link='discord'] {
      background: #5865f2;
      color: white;
    }
  }
}
</style>

<script>
// Import components
import AppHeader from '~/components/layout/Header'
import Container from '~/components/layout/Container'

// Import logo SVGs (for login buttons)
import GithubLogo from '~/assets/logos/github.svg?inline'
import DiscordLogo from '~/assets/logos/discord.svg?inline'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    AppHeader,
    Container,
    GithubLogo,
    DiscordLogo,
  },
  fetch() {
    this.user = SupabaseClient.auth.user()
  },
  fetchOnServer: false,
  data() {
    return {
      user: null,
    }
  },
  mounted() {
    SupabaseClient.auth.onAuthStateChange(() => {
      this.user = SupabaseClient.auth.user()
      this.$nuxt.$emit('refetch')
      setTimeout(() => {
        // Oh well
        this.$nuxt.$emit('refetch')
      }, 500)
    })
  },
  methods: {
    async login(provider) {
      await SupabaseClient.auth.signIn({
        provider,
      })
    },
  },
}
</script>
