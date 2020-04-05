<template>
  <div class="popup-index-wrapper">
    <b-loading :is-full-page="true" :active="isLoading" :can-cancel="false" />
    <div class="search-container">
      <div class="search-input-container">
        <input autofocus autocorrect="off" ref="search" spellcheck="false" autocapitalize="off" autocomplete="off" type="text" placeholder="Type to search repo in GitHub" v-model="searchKey" @input="searchRepos" />
      </div>
    </div>
    <div class="body-container">
      <div class="search-result-container" v-if="searchKey">
        <div class="loading" v-if="repoNavIsLoading !== 0"></div>
        <ul v-if="repoNavIsLoading === 0">
          <li class="menu-item search-item"
              v-for="result in searchResult"
              :key="result.id"
              @click="createAndJumpToPanel(result.display)">
              <div class="search-item-name"><small>{{ result.display }}</small></div>    
              <div class="search-item-icon">
                <small>
                  <b-icon size="is-small" icon="star" />
                  {{ result.stargazers.totalCount }}
                  <b-icon size="is-small" icon="source-branch" />
                  {{ result.forkCount }}
                </small>
              </div>
          </li>
        </ul>
      </div>
      <div v-if="!searchKey">
        <ul class="panel-list">
          <li v-for="history in historyList" :key="history.id">
            <a class="menu-item" :style="{ backgroundImage: 'url(' + require('../assets/favorites.png') + ')' }" @click="jump2Panel(history.id)">
              {{ history.name }}
            </a>
            <!--
              <div class="remove" @click="deletePanel({id: history.id})"></div>
            -->
          </li>
        </ul>
        <ul>
          <li v-if="currentGithubRepo">
            <a class="menu-item split-border" :style="{ backgroundImage: 'url(' + require('../assets/dice.svg') + ')' }" @click="createAndJumpToPanel(currentGithubRepo)">
              <strong>Guess:</strong> {{ currentGithubRepo }}
            </a>
          </li>
          <li v-if="issueNumber">
            <a class="menu-item" @click="$router.push('/set-time')">
              <strong>Set Issue Duration</strong>
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a class="menu-item split-border" :style="{ backgroundImage: 'url(' + require('../assets/panles.png') + ')' }" @click="jump2ManagePanels()">
              <strong>Manage Panels</strong>
            </a>
          </li>
          <li>
            <a class="menu-item" :style="{ backgroundImage: 'url(' + require('../assets/security.png') + ')' }" @click="resetAccessToken()">
              <strong>Reset Access Token</strong>
            </a>
          </li>
          <li>
            <a class="menu-item" @click="jump2UserGuide()" :style="{ backgroundImage: 'url(' + require('../assets/signpost.svg') + ')' }">
              <strong>User Guide</strong>
            </a>
          </li>
          <li v-if="userInfo">
            <div class="menu-item plain-item split-border" :style="{ backgroundImage: `url(${userInfo.avatarUrl})` }">{{ userInfo.login }}</div>
          </li>
          <li>
            <div class="menu-item plain-item split-border" style="text-align:right; padding: 0 22px;">
              <table style="width:100%">
                <tr>
                  <td>
                    <social-sharing url="https://wwww.pingcap.com"
                                    title="Gantt Viewer for Github Project"
                                    description="Gantt Viewer for Github Project, Powered by PingCAP/TiDB, MySQL at Scale"
                                    quote="Gantt Viewer for Github Project"
                                    hashtags="Github Project,PingCAP,TiDB,MySQL,Scale"
                                    twitter-user="pingcap"
                                    inline-template>
                      <div id="social-sharing-wrapper">
                        <network network="twitter">
                          <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'twitter' }"/>
                        </network>
                        &nbsp;&nbsp;&nbsp;
                        <network network="facebook">
                          <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook' }"/>
                        </network>
                        &nbsp;&nbsp;&nbsp;
                        <network network="reddit">
                          <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'reddit' }"/>
                        </network>
                      </div>
                    </social-sharing>
                  </td>
                  <td style="text-align:right">
                    <a href="https://www.pingcap.com" target="_blank">
                      <img :src="require('../assets/pingcap.png')" style="height:1em;filter:invert(100%);" />
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
'use strict'

import Vue from "vue"

import { mapGetters, mapMutations } from 'vuex'
import throttle from 'lodash/throttle'
import { v4 as uuidv4 } from 'uuid'

const SocialSharing = require("vue-social-sharing")
Vue.use(SocialSharing)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faReddit, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faFacebook)
library.add(faTwitter)
library.add(faReddit)
Vue.component('font-awesome-icon', FontAwesomeIcon)


export default {
  data () {
    return {
      isLoading: false,
      searchKey: '',
      searchResult: [],
      repoNavIsLoading: 0,
      repoNavDataTimestamp: 0,
      userInfo: {},
      currentGithubRepo: null,
      repoName: null,
      repoOwner: null,
      issueNumber: null
    }
  },
  mounted () {
    if (!window.accessToken) {
      this.$router.push('start')
    }

    this.userInfo = window.userInfo
    this.$refs.search.focus()

    chrome.tabs.getSelected(null, tab =>{
      chrome.extension.sendMessage({
        msg: "getProject",
        tab: tab.id
      }, resp => {
        this.currentGithubRepo = resp.repoFullName
        window.repoName = this.repoName = resp.repoName
        window.repoOwner = this.repoOwner = resp.repoOwner
        window.issueNumber = this.issueNumber = resp.issueNumber
      })
    })
    // this.currentGithubRepo = 'sykp241095/gantt-viewer-for-github-project'
    // this.repoName = 'gantt-viewer-for-github-project'
    // this.repoOwner = 'sykp241095'
    // this.issueNumber = '12'
    // window.issueNumber = this.issueNumber
    // window.repoName = this.repoName
    // window.repoOwner = this.repoOwner

    this.resizeWindow()
  },
  computed: {
    ...mapGetters('localPanel', ['historyList'])
  },
  watch: {
    currentGithubRepo: function (newVal, oldVal) {
      this.resizeWindow()
    },
    historyList: function (newVal, oldVal) {
      this.resizeWindow()
    }
  },
  methods: {
    ...mapMutations('localPanel', [
      'addPanel',
      'deletePanel',
      'addProjects',
      'deleteProject',
    ]),
    resizeWindow () {
      let count = Math.min(this.historyList.length, 4) + Boolean(this.currentGithubRepo) + Boolean(this.issueNumber)
      document.body.style.height = `${276 + 44 * count}px`;
    },
    async createAndJumpToPanel (repo) {
      this.isLoading = true
      let panelId = uuidv4()
      this.addPanel({ id: panelId, name: repo })
      const projects = await this.$octoClient.loadEnabledProjectsFromRepo(
        repo.split('/')[0],
        repo.split('/')[1]
      );
      this.addProjects({ id: panelId, projects })
      chrome.tabs.create({ url: `dist/index.html#/local_panel/${panelId}` });
    },
    searchRepos: throttle(async function(name) {
      var searchKey = this.searchKey
      if (!this.searchKey.length) {
        this.repoNavDataTimestamp = Date.now();
        this.searchResult = [];
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
            name: searchKey,
          }
        );
        if (
          query &&
          query.search &&
          query.search.nodes &&
          ts > this.repoNavDataTimestamp
        ) {
          this.repoNavDataTimestamp = ts;
          this.searchResult = []
          query.search.nodes.forEach(node => {
            this.searchResult.push({
              ...node,
              display: `${node.owner.login}/${node.name}`,
            });
          });
        }

        console.log(this.searchResult)
      } catch (e) {
        this.$buefy.toast.open({
          duration: 3000,
          message: `Search repository failed`,
          position: 'is-bottom',
          type: 'is-danger',
          queue: false,
        });
      }
      this.repoNavIsLoading--;
    }, 1000),
    jump2History (type, id) {
      if (type == 'repo') {
        this.jump2ViewRepo(id)
      } else {
        this.jump2Panel(id)
      }
    },
    jump2Panel (panelId) {
      chrome.tabs.create({ url: `dist/index.html#/local_panel/${panelId}` });
    },
    jump2ViewRepo (repoName) {
      chrome.tabs.create({ url: `dist/index.html#/view/${repoName}` });
    },
    jump2ManagePanels () {
      chrome.tabs.create({ url: 'dist/index.html#/local_panel' });
    },
    jump2UserGuide() {
      chrome.tabs.create({ url: 'dist/index.html' });
    },
    resetAccessToken () {
      chrome.storage.sync.set({
        'accessToken': ''
      })
      window.accessToken = ''
      this.$router.push('start')
    }
  }
}
</script>

<style lang="stylus" scoped>
.popup-index-wrapper
  .search-container
    width 100%
    height 55px
    background-color #F7F9FA
    padding 12px 18px
    border-bottom 1px solid #E7E8EA
    box-sizing border-box

    .search-input-container
      position relative
      background: #F6F7F8;
      border-radius: 8px;
      font-style normal
      background-color transparent
      border none
      outline none
      background-position 6px center
      background-size 15px
      width 100%
      height 100%
  
      input
        width 100%
        height 100%
        font-style: normal;
        background-color: transparent;
        border: none;
        outline: none;
        padding-left: 42px;
        background-position: 6px center;
        background-size: 15px;
        background-image url(../assets/search.png)
        background-repeat: no-repeat;

        &::placeholder
          font-size 1rem

  .body-container
    .search-result-container
      height 365px
      overflow-y scroll
      padding-bottom 20px

      .loading
        height 100%
        width 100%
        background-image url(../assets/loading.gif)
        background-repeat: no-repeat;
        background-size: 200px;
        background-position: center 30px;

    ul
      list-style-type: none;
      padding: 0;
      margin: 0;

      &.panel-list
        max-height 176px
        overflow-y scroll

      li
        display: list-item;
        text-align: -webkit-match-parent;
        position relative

        .split-border
          border-top 1px solid #E7E8EA

      .menu-item
        background-repeat: no-repeat;
        padding-left: 57px;
        padding-right: 25px;
        color: rgb(23, 33, 40);
        background-size: 21px;
        background-position: 20px 12px;
        line-height: 44px;
        height: 44px;
        color: #22303b;
        background-color: white;
        display block
        white-space: nowrap
        text-overflow ellipsis
        overflow hidden

        strong
          font-weight 500

        &:hover
          background-color #e6e6e6

      .search-item
        padding 0 20px
        height 100%
        line-height: 33px
        background-color #fff
        cursor pointer

        .search-item-name
          height 22px

      .plain-item
        a
          cursor pointer

        &:hover
          background-color #fff

      .remove
        position absolute
        background-image: url(../assets/trash.svg);
        background-size: 18px;
        background-repeat: no-repeat;
        width: 20px;
        height: 40px;
        line-height 44px
        top 0
        right 5px
        cursor pointer
        background-position: 0 12px;
</style>
