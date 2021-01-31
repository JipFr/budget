<template>
  <div>
    <Nuxt />
  </div>
</template>

<script>
// Import Capacitor
import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core'
const { StatusBar } = Plugins

export default {
  beforeCreate() {
    if (Capacitor.platform === 'ios') {
      StatusBar.setStyle({
        style: StatusBarStyle.Dark,
      })
    }
  },
}
</script>
