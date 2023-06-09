<!-- eslint-disable no-unused-vars -->
<template>
  <div v-if="user || $fetchState.pending">
    <slot />
  </div>
  <div v-else>
    <container class="limited-width">
      <landing-navbar />
      <banner v-if="error">{{ error }}</banner>
      <landing-hero />
    </container>

    <landing-faq />

    <meal-planning />

    <landing-about-me />
  </div>
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

<script>
// Import components
import LandingNavbar from '~/components/landing/Navbar'
import LandingHero from '~/components/landing/Hero'
import LandingFaq from '~/components/landing/Faq'
import MealPlanning from '~/components/landing/MealPlanning'
import LandingAboutMe from '~/components/landing/AboutMe'

import Container from '~/components/layout/Container'
import Banner from '~/components/base/Banner'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    LandingNavbar,
    LandingHero,
    LandingFaq,
    MealPlanning,
    LandingAboutMe,
    Container,
    Banner,
  },
  fetch() {
    this.user = SupabaseClient.auth.user()
  },
  fetchOnServer: false,
  data() {
    return {
      user: null,
      error: '',
    }
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
  methods: {
    async login(provider) {
      await SupabaseClient.auth.signIn(
        {
          provider,
        },
        {
          redirectTo:
            process.env.NODE_ENV === 'production'
              ? 'https://dev--jip-budget.netlify.app/'
              : process.env.REDIRECT_URL,
        }
      )
    },
  },
}
</script>
