<template>
  <div class="start-container">
    <section class="modal-card-body" style="padding: 50px 30px;">
      <p>To continue, you need to submit your personal github access_token.</p>
      <h3 style="margin: .3rem 0;">
        <a @click="jump2HowTo">How to get access_token?</a>
      </h3>
      <b-field style="margin-bottom: .5rem;">
        <b-input v-model="accessToken" placeholder="Access Token"></b-input>
      </b-field>
      <small style="color: red;" v-if="error">{{ error }}</small>
      <div style="text-align: center; margin-top: .5rem;">
        <b-button
          type="is-primary"
          :loading="isLoading"
          @click="signin"
          rounded
        >
          Get Start
        </b-button>
      </div>
    </section>
  </div>
</template>

<script>
'use strict'

export default {
  data () {
    return {
      isLoading: false,
      accessToken: '',
      error: ''
    }
  },
  methods: {
    async signin () {
      window.accessToken = this.accessToken
      this.isLoading = true
      try {
        const resp = await this.$octoClient.getGithubUserInfo()
        if (resp.viewer) {
          chrome.storage.sync.set({
            'accessToken': this.accessToken,
            'userInfo': {
              login: resp.viewer.login,
              avatarUrl: resp.viewer.avatarUrl
            }
          })
          window.userInfo = {
            login: resp.viewer.login,
            avatarUrl: resp.viewer.avatarUrl
          }
          this.$router.push('/')
        } else {
          this.error = 'invalid access token'
          this.isLoading = false
          window.accessToken = ''
        }
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.error = 'invalid access token / network unrechable'
        window.accessToken = ''
      }
    },
    jump2HowTo () {
      chrome.tabs.create({ url: 'dist/index.html#/how-to-get-access-token' });
    }
  }
}
</script>
