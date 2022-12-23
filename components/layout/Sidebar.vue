<template>
  <aside>
    <logo class="padded" />
    <slot />
    <div class="nav-container padded">
      <nav v-for="(section, i) of sections" :key="`section-${i}`">
        <p class="section-title">{{ section.title }}</p>
        <nuxt-link v-for="link of section.links" :key="link.to" :to="link.to">
          <arrow-right-icon />
          {{ link.title }}
        </nuxt-link>
      </nav>
    </div>
    <div class="bottom padded">
      <div v-if="user" class="profile">
        <img
          class="profile-picture"
          :src="user.user_metadata.avatar_url"
          alt="Logged in user's profile picture"
        />
        <div class="text">
          <h3>{{ user.user_metadata.full_name }}</h3>
          <!-- eslint-disable-next-line no-irregular-whitespace -->
          <p>{{ capitalise(user.app_metadata.provider) }} — {{ user.email }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
aside {
  width: 100%;
  height: 100vh;
  background: var(--content);
  border-right: 1px solid var(--border);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  position: sticky;
  top: 0;

  .logo {
    margin: 20px 0;
    color: var(--text-secondary);
  }

  .padded {
    padding: 24px 38px;
    padding-right: 0px;
  }
}

.bottom {
  background: var(--content-darker);
}

.profile {
  display: flex;
  gap: 14px;
  align-items: center;

  .profile-picture {
    width: 43px;
    height: 43px;
    border-radius: 4px;
  }

  .text {
    h3 {
      font-size: 1rem;
      font-weight: bold;
    }
    p {
      font-size: 0.75rem;
      font-weight: 500;
      margin-top: 5px;
      color: var(--text-secondary);
    }
  }
}

.nav-container {
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  border-top: 1px solid var(--border);
  padding-top: 40px;

  .section-title {
    margin: 20px 0;
  }

  a {
    width: 90%;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-secondary);
    text-decoration: none;
    padding: 9px 18px;
    margin: 8px 0;
    margin-left: -18px;
    border-radius: 7px;

    &.nuxt-link-exact-active {
      background: var(--link-active);
      color: var(--text);
    }
  }
}
</style>

<script>
// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import components
import Logo from '~/components/base/util/Logo'

// Import icons
import ArrowRightIcon from '~/assets/icons/arrow-right.svg?inline'

export default {
  components: {
    Logo,
    ArrowRightIcon,
  },
  data() {
    return {
      sections: [
        {
          title: 'Finances',
          links: [
            {
              title: 'Payments',
              to: '/',
            },
            {
              title: 'Price differences',
              to: '/differences',
            },
            {
              title: 'Categories',
              to: '/categories',
            },
            {
              title: 'Recurring',
              to: '/recurring',
            },
          ],
        },
        {
          title: 'Analysis',
          links: [
            {
              title: 'Prices',
              to: '/prices',
            },
            {
              title: 'Food',
              to: '/food',
            },
            {
              title: 'Overview',
              to: '/overview',
            },
          ],
        },
        {
          title: 'About',
          links: [
            {
              title: 'Profile',
              to: '/about/',
            },
            {
              title: 'FAQ',
              to: '/about/faq',
            },
          ],
        },
      ],
    }
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
