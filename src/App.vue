<template>
  <div style="height: 100%; width: 100%; position: relative; overflow: hidden;">
    <b-loading :is-full-page="true" :active="isLoading" :can-cancel="false" />
    <b-modal
      animation="zoom-in"
      :active="!isLoading && !userInfo && $route.name !== 'how-to-get-access-token' && false"
      has-modal-card
      trap-focus
      :can-cancel="false"
    >
      <LoginDialog />
    </b-modal>
<!--     <div
      style="position: absolute; left: 0; top: 0; width: 100%; height: 3.25rem; z-index: 10;"
    >
      <Nav :userInfo="userInfo" />
    </div> -->
    <div
      style="position: absolute; top: 0; bottom: 0; left: 0; width: 100%;"
    >
      <router-view v-if="userInfo || $route.name === 'how-to-get-access-token'"></router-view>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue';
import LoginDialog from '@/components/LoginDialog.vue';

export default {
  name: 'App',
  components: {
    LoginDialog,
    Nav,
  },
  data() {
    return {
      isLoading: true,
      userInfo: null
    };
  },
  async mounted() {
    // // FIXME: This is ugly. Use vuex.
    // window.sessionInfo = null;
    // try {
    //   const resp = await this.$http.get('/github/info');
    //   if (resp.data && resp.data.accessToken) {
    //     this.sessionInfo = resp.data;
    //     // FIXME: This is ugly. Use vuex.
    //     window.sessionInfo = this.sessionInfo;
    //   }
    // } catch (e) {
    //   if (e.status !== 403) {
    //     console.error(e);
    //     this.$buefy.toast.open({
    //       duration: 5000,
    //       message: `Network connection error. Please refresh and retry.`,
    //       position: 'is-bottom',
    //       type: 'is-danger',
    //       queue: false,
    //     });
    //   }
    // }
    try {
      const resp = await this.$octoClient.getGithubUserInfo()
      if (resp.viewer) {
        this.userInfo = resp.viewer
      }
    } catch (e) {
      console.log(e)
    }
    this.isLoading = false;
  }
};
</script>

<style lang="scss">
@import './custom.scss';

html {
  height: 100%;
}
</style>
