<template>
  <div style="overflow-y: auto; height: 100%;">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            How to get github access token
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h3 class="title is-size-5">1 .On any GitHub page, click your profile icon and then click <a href="https://github.com/settings/tokens" target="blank">Settings</a>.</h3>
        <h3 class="title is-size-5">2. On the sidebar, click Personal access tokens.</h3>
        <h3 class="title is-size-5">3. Click <a href="https://github.com/settings/tokens/new" target="blank"> Generate new token</a>.</h3>
        <h3 class="title is-size-5">4. Add a token description, select scopes (repo) and click Generate token.</h3>
        <img src="../assets/select-scope.jpg" style="max-width: 500px;">
        <h3 class="title is-size-5">5. Copy the token to a secure location or password management app.</h3>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HowToGetAccessTokenPage',
};
</script>
