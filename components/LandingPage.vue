<template>
  <div>
    <container class="limited-width">
      <landing-navbar />
      <banner v-if="error">{{ error }}</banner>
      <landing-hero />
    </container>

    <landing-faq />

    <features />

    <meal-planning />

    <landing-about-me />

    <ready-to-try />
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
import LandingNavbar from '~/components/landing/Navbar'
import LandingHero from '~/components/landing/Hero'
import LandingFaq from '~/components/landing/Faq'
import Features from '~/components/landing/Features'
import MealPlanning from '~/components/landing/MealPlanning'
import LandingAboutMe from '~/components/landing/AboutMe'
import ReadyToTry from '~/components/landing/ReadyToTry'

import Container from '~/components/layout/Container'
import Banner from '~/components/base/Banner'

// Import Supabase
import SupabaseClient from '~/util/supabase'
import { getRedirectUrl } from '~/util/redirectUrl'

export default {
  components: {
    LandingNavbar,
    LandingHero,
    LandingFaq,
    Features,
    MealPlanning,
    LandingAboutMe,
    Container,
    Banner,
    ReadyToTry,
  },
  props: {
    error: {
      type: String,
      default: undefined,
    },
  },
  fetchOnServer: false,
  methods: {
    async login(provider) {
      await SupabaseClient.auth.signIn(
        {
          provider,
        },
        {
          redirectTo: getRedirectUrl(),
        }
      )
    },
  },
}
</script>
