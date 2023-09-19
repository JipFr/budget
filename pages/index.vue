<template>
  <div>
    <landing-page />
  </div>
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
  layout: 'nothing',
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
  watch: {
    user() {
      if (this.user) {
        this.$router.push({
          path: '/dashboard',
        })
      }
    },
  },
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
