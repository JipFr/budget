<!-- eslint-disable no-unused-vars -->
<template>
  <div v-if="user || $fetchState.pending">
    <slot />
  </div>
  <div v-else>
    <app-header title="Log in" />
    <container>
      <button @click="login('github')">Log in with GitHub</button>
      <button @click="login('discord')">Log in with Discord</button>
    </container>
  </div>
</template>

<script>
// Import components
import AppHeader from '~/components/layout/Header'
import Container from '~/components/layout/Container'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    AppHeader,
    Container,
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
