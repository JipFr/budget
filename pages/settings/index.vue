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
</style>

<script>
import SupabaseClient from '~/util/supabase'

export default {
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
  },
}
</script>
