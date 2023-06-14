<template>
  <div>
    <div class="profile">
      <img
        class="profile-picture"
        :src="user.user_metadata.avatar_url"
        alt="Logged in user's profile picture"
      />
      <div class="profile-info">
        <h2 class="profile-name">{{ user.user_metadata.full_name }}</h2>
        <p class="profile-email">
          {{ user.email }}
          <span class="secondary">
            <!-- eslint-disable-next-line no-irregular-whitespace -->
            — signed in through
            {{ capitalise(user.app_metadata.provider) }}</span
          >
        </p>
      </div>
    </div>

    <app-button class="secondary" @click="logout">Log out</app-button>
  </div>
</template>

<style lang="scss" scoped>
.profile {
  .profile-email {
    margin-top: 10px;
  }

  .secondary {
    color: var(--text-secondary);
  }

  .profile-picture {
    display: block;
    width: 5rem;
    height: 5rem;
    border-radius: 4px;
    margin-bottom: 10px;
    border: 1px solid var(--border);
  }
}

.button {
  margin-top: 2rem;
  margin-bottom: 4rem;
}
</style>

<script>
import AppButton from '~/components/util/Button'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    AppButton,
  },
  computed: {
    user() {
      return SupabaseClient.auth.user()
    },
  },
  methods: {
    capitalise(str) {
      str = str.toString()
      return str.slice(0, 1).toUpperCase() + str.slice(1)
    },
    async logout() {
      await SupabaseClient.auth.signOut()
    },
  },
}
</script>
