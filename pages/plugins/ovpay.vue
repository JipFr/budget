<template>
  <div>
    <page-title>Connect your OVPay account</page-title>

    <banner type="warning">
      <strong>Heads up!</strong> Advanced masters of computers only!
    </banner>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <banner v-if="error" v-html="error" />

    <p>
      To connect your OVPay account, check your (non-WebKit) DevTools after
      trying to log in. The console will show a failed network request
      <!-- eslint-disable-next-line no-irregular-whitespace -->
      — copy that url and paste it in below.
    </p>

    <a
      href="https://ovpayidentityprod.b2clogin.com/tfp/ovpayidentityprod.onmicrosoft.com/B2C_1A_ovpay_signup_signin/oauth2/v2.0/authorize?scope=openid+offline_access+https%3A%2F%2Fovpayidentityprod.onmicrosoft.com%2Fovpay-api%2Fovpay.api.public+profile&response_type=code&client_id=bba0d876-2f34-4919-a9b9-88d37f559a1e&redirect_uri=msalbba0d876-2f34-4919-a9b9-88d37f559a1e%3A%2F%2Fauth"
      target="_blank"
    >
      Open OVPay
    </a>

    <div v-if="!data" class="input-wrapper">
      <app-input
        v-model="url"
        placeholder="msalbba0d876-2f34-4919-a9b9-88d37f559a1e://auth..."
      />
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

import { addAccessFromCode } from '~/krab-plugins/ovpay'

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
      error: '',
    }
  },
  methods: {
    async sendCode() {
      const url = new URL(this.url)
      const code = url.searchParams.get('code')

      const response = await addAccessFromCode(code)

      if (!response || response.error) {
        this.error = `
          <span>Something went wrong. This was likely not a valid code. Are you perhaps not a master of computers, hm?</span>
          <div style="margin-top: .5rem;">Error: ${response.error}</div>
          `
        return
      }

      this.data = response.res
      this.data2 = response.insert

      setTimeout(() => {
        location.href = '/settings/plugins/'
      }, 5e3)
    },
  },
}
</script>
