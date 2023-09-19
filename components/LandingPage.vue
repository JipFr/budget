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
