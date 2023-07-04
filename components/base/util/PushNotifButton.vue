<template>
  <div>
    <button
      :class="permission !== 'default' ? 'hidden' : ''"
      @click="subscribeToPush"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
button {
  margin-bottom: 50px;
}
.hidden {
  display: none;
}
</style>

<script>
// Import Supabase
import SupabaseClient from '~/util/supabase'

// Stuff
import { host } from '~/util/setPushNotifs'

export default {
  fetch() {
    this.user = SupabaseClient.auth.user()
    this.permission = Notification.permission
  },
  fetchOnServer: false,
  data() {
    return {
      user: SupabaseClient.auth.user(),
      permission: 'default',
      host,
      buttonLabel: 'Want push notifications?',
      buttonLabelInitial: 'Want push notifications?',
    }
  },
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
        } else {
          alert(Notification.permission)
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
