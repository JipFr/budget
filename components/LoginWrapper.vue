<!-- eslint-disable no-unused-vars -->
<template>
  <div v-if="user || $fetchState.pending">
    <slot />
  </div>
  <landing-page v-else :error="error" />
</template>

<style lang="scss" scoped>
.container.login {
  max-width: 500px;
  margin: 80px auto;
  margin-bottom: 20px;
}

h1 {
  font-size: 1.5rem;
}

h2 {
  color: var(--text-secondary);
}

p {
  color: var(--text-secondary);
  margin: 1rem 0;
  margin-bottom: 30px;
}

hr {
  margin: 30px 0;
  border-color: var(--border);
}

.banner {
  margin-bottom: 30px;
}
</style>

<style lang="scss">
:root {
  --blob-color: var(--border);
  --image-border: var(--content);
}

@media (prefers-color-scheme: dark) {
  :root {
    --blob-color: #393647;
  }
}
</style>

<script>
// Import components
import LandingPage from '~/components/LandingPage'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    LandingPage,
  },
  data() {
    return {
      user: null,
      error: '',
    }
  },
  fetch() {
    this.user = SupabaseClient.auth.user()
  },
  fetchOnServer: false,
  mounted() {
    SupabaseClient.auth.onAuthStateChange(() => {
      this.user = SupabaseClient.auth.user()
      this.$nuxt.$emit('refetch-really')
      setTimeout(() => {
        // Oh well
        this.$nuxt.$emit('refetch-really')
      }, 500)
    })

    // Parse query parameters
    const query = this.$route.query
    if (query.error_description) {
      this.error = query.error_description
    }
  },
}
</script>
