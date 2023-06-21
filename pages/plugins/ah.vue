<template>
  <div>
    <page-title>Connect your Albert Heijn account</page-title>

    <banner type="warning">
      <strong>Heads up!</strong> Advanced masters of computers only!
    </banner>

    <p>
      To connect your Albert Heijn account, check your (non-Safari) DevTools
      after trying to log in. The console will show a failed network request
      <!-- eslint-disable-next-line no-irregular-whitespace -->
      — copy that url and paste it in below.
    </p>

    <a
      href="https://login.ah.nl/secure/oauth/authorize?client_id=appie&redirect_uri=appie://login-exit&response_type=code"
      target="_blank"
    >
      Open Albert Heijn
    </a>

    <div class="input-wrapper">
      <app-input v-model="url" placeholder="appie://login-exit..." />
      <app-button class="secondary small" @click="sendCode()">
        Verify code
      </app-button>
    </div>

    <p v-if="data?.access_token">
      <strong>Successfully added</strong> new access token:
      {{ data?.access_token }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
p {
  margin: 30px 0;
}
a {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 11px;
  height: 80px;
  color: var(--anchor);

  &:hover {
    background: var(--content);
    text-decoration: none;
  }
}
.input-wrapper {
  display: flex;
  gap: 10px;
  margin: 20px 0;

  .app-input {
    width: 100%;
  }

  button {
    white-space: nowrap;
  }
}
</style>

<script>
// Import components
import PageTitle from '~/components/title/PageTitle'
import Banner from '~/components/base/Banner'
import AppInput from '~/components/base/inputs/Input'
import AppButton from '~/components/util/Button'

import { addAccessFromCode } from '~/krab-plugins/ah'

export default {
  components: {
    PageTitle,
    Banner,
    AppInput,
    AppButton,
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

      setTimeout(() => {
        this.$route.push('/settings')
      }, 2e3)
    },
  },
}
</script>
