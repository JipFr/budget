<template>
  <div v-if="user || $fetchState.pending">
    <slot />
  </div>
  <landing-page v-else :error="error" />
</template>

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
