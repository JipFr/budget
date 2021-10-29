<template>
  <div class="login-wrapper">
    <card>
      <!-- Errors -->
      <banner v-if="error">⚠️ {{ error }}</banner>

      <!-- Formulier met inputs en knop -->
      <form @submit="submit">
        <app-input
          v-model="username"
          label="Gebruikersnaam"
          type="text"
          placeholder="j.doe"
          do-alt-bg
          required
        />
        <app-input
          v-model="password"
          label="Wachtwoord"
          type="password"
          do-alt-bg
          placeholder="•••••••••••"
          required
        />

        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
    </card>
  </div>
</template>

<style lang="scss" scoped>
.login-wrapper {
  width: 90%;
  max-width: 300px;
}
.banner {
  margin-bottom: 20px;
}
form {
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 20px;
}
button {
  font-size: 1rem;
  background: var(--theme);
  color: white;
  border: 0;
  padding: 8px 32px;
  border-radius: 6px;
}
</style>

<script>
// Import components
import Banner from '~/components/base/Banner'
import Card from '~/components/layout/Card'
import AppInput from '~/components/base/inputs/Input'

export default {
  layout: 'auth',
  components: {
    Banner,
    AppInput,
    Card,
  },
  data() {
    return {
      error: '',
      username: 'jip',
      password: '',
    }
  },
  methods: {
    submit(evt) {
      evt.preventDefault()
    },
  },
}
</script>
