<template>
  <div>
    <page-title>Albert Heijn test page</page-title>
    <a
      href="https://login.ah.nl/secure/oauth/authorize?client_id=appie&redirect_uri=appie://login-exit&response_type=code"
      target="_blank"
    >
      https://login.ah.nl/secure/oauth/authorize?client_id=appie&redirect_uri=appie://login-exit&response_type=code
    </a>
    <p>Open your devtools when it fails to redirect and take the URL.</p>
    <input v-model="url" type="text" />
    <button @click="sendCode()">Verify code</button>
    <p>{{ data || 'No data' }}</p>
    <p>{{ data2 || 'No data' }}</p>

    <ah-view />
  </div>
</template>

<style lang="scss" scoped>
p {
  margin-bottom: 50px;
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import AhView, { ahFetch } from '~/components/base/util/AhView'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    PageTitle,
    AhView,
  },
  data() {
    return {
      url: '',
      data: null,
      data2: null,
    }
  },
  methods: {
    async sendCode() {
      const code = this.url.split('?code=').pop()

      const res = await ahFetch('/mobile-auth/v1/auth/token', {
        method: 'POST',
        body: {
          code,
        },
      })
      this.data = res

      // Now logged in
      if (res.error) return

      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        access_token: res.access_token,
        refresh_token: res.refresh_token,
        expires_in: res.expires_in,
        plugin: 'ah',
        updated_at: new Date().toISOString(),
      }

      // Insert access token
      const insert = await SupabaseClient.from('plugin_access_tokens').insert([
        submitObj,
      ])
      this.data2 = insert
    },
  },
}
</script>
