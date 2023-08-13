<template>
  <card class="notif-wrapper" :class="permission !== 'default' ? 'hidden' : ''">
    <p>Want push notifications?</p>

    <p class="secondary">
      Krab can send you push notifications for recurring transactions. When it's
      that time of the month again, you won't be caught by surprise!
    </p>

    <div class="button-wrapper">
      <app-button class="secondary medium" @click="subscribeToPush">
        {{ buttonLabel }}
      </app-button>
    </div>
  </card>
</template>

<style lang="scss" scoped>
.notif-wrapper {
  margin-bottom: 50px;

  p.secondary {
    margin: 15px 0;
    color: var(--text-secondary);
  }

  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}

.hidden {
  display: none;
}
</style>

<script>
// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import components
import AppButton from '~/components/util/Button'
import Card from '~/components/layout/Card'

// Utils
import { host } from '~/util/setPushNotifs'

export default {
  components: {
    AppButton,
    Card,
  },
  data() {
    return {
      user: SupabaseClient.auth.user(),
      permission: 'default',
      host,
      buttonLabel: 'Enter your preference',
      buttonLabelInitial: 'Enter your preference',
    }
  },
  fetch() {
    this.user = SupabaseClient.auth.user()
    this.permission = Notification.permission
  },
  fetchOnServer: false,
  methods: {
    async subscribeToPush() {
      if (window.Notification) {
        if (Notification.permission !== 'granted') {
          await new Promise((resolve) => {
            this.buttonLabel = 'Please hold!...'
            Notification.requestPermission(resolve).catch((err) => {
              alert(err)
              resolve(err)
            })
          })
        }
        if (Notification.permission === 'granted') {
          this.doSubscribe()
        }
        this.permission = Notification.permission
        this.buttonLabel = this.buttonLabelInitial
      }
    },
    doSubscribe() {
      this.getSubscriptionObject().then((obj) => {
        this.subscribe(obj).then((res) => {
          if (!res.ok) {
            res.json().then((d) => alert(d.message))
          }
        })
      })
    },

    // Generate subscription object
    async getSubscriptionObject() {
      // Get public vapid key
      const publicVapidKeyRes = await fetch(
        this.host + '/get-public-vapid-key'
      ).then((res) => res.json())
      const publicVapidKey = publicVapidKeyRes.data

      // Create worker
      const worker = (await navigator.serviceWorker.getRegistrations())[0]
      return await worker.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey),
        })
        .catch(function (err) {
          alert(err)
        })
    },

    // Send subscription to server
    subscribe(subscription) {
      const topic = `krab-${this.user.id}`

      return fetch(this.host + '/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          subscription,
          topic,
        }),
        headers: {
          'content-type': 'application/json',
        },
      })
    },

    // Decoder base64 to uint8
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    },
  },
}
</script>
