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
import AhView from '~/components/base/util/AhView'
import { addAccessFromCode } from '~/krab-plugins/ah'

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

      const { res, insert } = await addAccessFromCode(code)

      this.data = res
      this.data2 = insert
    },
  },
}
</script>
