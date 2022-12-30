<template>
  <aside>
    <div class="content">
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
    </div>
    <div class="bottom padded">
      <div class="profile">
        <img
          class="profile-picture"
          :src="
            user?.user_metadata?.avatar_url ||
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
          "
          alt="Logged in user's profile picture"
        />
        <div class="text">
          <h3 :class="!user && 'skeleton-text'">
            {{ user?.user_metadata?.full_name || 'Yo Mama' }}
          </h3>
          <p :class="!user && 'skeleton-text'">
            <!-- eslint-disable-next-line no-irregular-whitespace -->
            {{ capitalise(user?.app_metadata?.provider || 'HelloWorld') }} — {{
              user?.email || 'yo@mama.org'
            }}
          </p>
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
  grid-template-rows: minmax(0, 1fr) auto;
  position: sticky;
  top: 0;

  > .content {
    display: grid;
    grid-template-rows: auto auto auto minmax(0, 1fr);
  }

  .logo {
    margin: 20px 0;
    color: var(--text-secondary);
  }

  .padded {
    padding: 24px 38px;

    &:not(.padded-right) {
      padding-right: 0px;
    }
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
    background: var(--border);
  }

  .text .skeleton-text {
    color: transparent;
    user-select: none;
    background: var(--border);
    display: inline-block;
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

    &:hover {
      background: var(--content-light);
    }

    &.nuxt-link-exact-active {
      background: var(--link-active);
      color: var(--text);
    }
  }
}

@media (max-width: 700px) {
  aside {
    width: 100%;
    max-width: 320px;
    position: fixed;
    z-index: 30;
    border-right: 0;
    transform: translateX(-100%);
    transition: transform 200ms;
    height: auto;
    max-height: 100vh;

    &[open] {
      transform: none;
    }

    .logo {
      padding-left: 90px !important;
    }

    > .content {
      max-height: 100%;
      overflow-y: auto;
      grid-template-rows: auto;

      .nav-container {
        overflow-y: initial;
      }
    }

    .padded {
      padding: 20px 30px;
    }
    .logo {
      margin-bottom: 0;
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
      user: null,
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
          title: 'Stock',
          links: [
            {
              title: 'Inventory',
              to: '/inventory',
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
  mounted() {
    SupabaseClient.auth.onAuthStateChange(() => {
      this.user = SupabaseClient.auth.user()
    })
    this.user = SupabaseClient.auth.user()
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
