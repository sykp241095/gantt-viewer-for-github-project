<template>
  <div class="modal-card" style="width: auto">
    <section class="modal-card-body" style="padding: 30px">
      <p>To continue, you need to submit your personal github access_token.</p>
      <h3 style="margin: .3rem 0;">
        <router-link to="/how-to-get-access-token">How to get access_token?</router-link>
      </h3>
      <b-field label="Access Token">
        <b-input v-model="accessToken"></b-input>
      </b-field>
      <div style="text-align: center;">
        <b-button
          type="is-primary"
          @click="signin"
          :loading="isLoading"
          rounded
        >
          Get Start
        </b-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LoginDialog',
  data() {
    return {
      isLoading: false,
      accessToken: ''
    };
  },
  methods: {
    signin() {
      this.isLoading = true
      console.log(this.accessToken)
      chrome.storage.sync.set({
        'accessToken': this.accessToken
      })
      window.location.reload(false)
    },
  },
};
</script>
