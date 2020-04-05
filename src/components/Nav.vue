<template>
  <b-navbar type="is-light">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }"
        >Gantt Viewer for Github Project</b-navbar-item
      >
    </template>
    <template slot="start">
      <b-navbar-item tag="div">
        <small>for:</small>
        <b-autocomplete
          :data="repoNavData"
          placeholder="Type to search a repository"
          :loading="repoNavIsLoading > 0"
          field="display"
          @typing="searchRepos"
          :disabled="!userInfo"
          size="is-small"
          style="width: 300px; margin-left: 5px;"
          :value="
            $route.params.repo
              ? `${$route.params.org}/${$route.params.repo}`
              : ''
          "
          @select="handleRepoChange"
        >
          >
          <template slot-scope="props">
            <div>
              <small>{{ props.option.display }}</small>
            </div>
            <div>
              <small>
                <b-icon size="is-small" icon="star" />
                {{ props.option.stargazers.totalCount }}
                <b-icon size="is-small" icon="source-branch" />
                {{ props.option.forkCount }}
              </small>
            </div>
          </template>
        </b-autocomplete>
      </b-navbar-item>
      <b-navbar-dropdown label="Panels">
        <b-navbar-item
          tag="router-link"
          :to="{ name: 'view_local_panel', params: { id: panel.id } }"
          v-for="panel of panels"
          :key="panel.id"
          >{{ panel.name }}</b-navbar-item
        >
        <b-navbar-item tag="router-link" :to="{ name: 'manage_local_panels' }"
          >Manage Panels</b-navbar-item
        >
      </b-navbar-dropdown>
    </template>
    <template slot="end">
      <b-navbar-dropdown v-if="userInfo && userInfo.login">
        <template slot="label">
          <img
            :src="userInfo.avatarUrl"
            style="margin-right: 5px"
          />
          {{ userInfo.login }}
        </template>
        <b-navbar-item @click="logout()">Reset Access Token</b-navbar-item
        >
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';

export default {
  name: 'Nav',
  computed: mapState('localPanel', ['panels']),
  data() {
    return {
      repoNavData: [],
      repoNavSelected: null,
      repoNavIsLoading: 0,
      repoNavDataTimestamp: 0,
    };
  },
  props: ['repo', 'userInfo'],
  methods: {
    logout: async function() {
      chrome.storage.sync.set({
        'accessToken': ''
      })
      window.accessToken = ''
      window.location.reload(false)
    },
    handleRepoChange: function(option) {
      if (!option) {
        return;
      }
      this.$router.push({
        name: 'view',
        params: {
          org: option.owner.login,
          repo: option.name,
        },
      });
    },
    searchRepos: throttle(async function(name) {
      if (!this.$props.userInfo) {
        return;
      }
      if (!name.length) {
        this.repoNavDataTimestamp = Date.now();
        this.repoNavData = [];
        return;
      }
      this.repoNavIsLoading++;
      try {
        const ts = Date.now();
        const query = await this.$octoClient.request(
          `
          query repos($name: String!) {
            search(query: $name, type: REPOSITORY, first: 10) {
              nodes {
                ... on Repository {
                  id
                  name
                  url
                  owner {
                    login
                  }
                  forkCount
                  stargazers {
                    totalCount
                  }
                }
              }
            }
          }
        `,
          {
            name,
          }
        );
        if (
          query &&
          query.search &&
          query.search.nodes &&
          ts > this.repoNavDataTimestamp
        ) {
          this.repoNavDataTimestamp = ts;
          this.repoNavData = [];
          query.search.nodes.forEach(node => {
            this.repoNavData.push({
              ...node,
              display: `${node.owner.login}/${node.name}`,
            });
          });
        }
      } catch (e) {
        console.error(e);
        this.$buefy.toast.open({
          duration: 3000,
          message: `Search repository failed`,
          position: 'is-bottom',
          type: 'is-danger',
          queue: false,
        });
      }
      this.repoNavIsLoading--;
    }, 500),
  },
};
</script>
