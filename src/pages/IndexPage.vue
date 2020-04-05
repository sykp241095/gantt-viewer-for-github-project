<template>
  <div style="overflow-y: scroll; height: 100%;">
    <vue-headful title="Gantt Viewer for Github Project" />
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Getting Started !
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">Introduction</h1>
        <p>
          Gantt Viewer for Github Project(GV) is used for managing Github Projects, Issues, Milestones in Gantt View ways
        </p>
        <p>
          Powered by: <a href="https://www.pingcap.com" target="_blank">PingCAP, Inc.</a>
        </p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">Usage</h1>
        <br />
        <div class="columns">
          <div class="column is-two-fifths">
            <h2 class="subtitle">Step 1: Create project for your repo</h2>
          </div>
          <div class="column">
            <img src="../assets/step1.png" />
          </div>
        </div>
        <br />
        <br />

        <div class="columns">
          <div class="column is-two-fifths">
            <h2 class="subtitle">Step 2: Create issue, link issue to that Github project</h2>
          </div>
          <div class="column">
            <img src="../assets/step2.png" />
          </div>
        </div>
        <br />
        <br />

        <div class="columns">
          <div class="column is-two-fifths">
            <h2 class="subtitle">Step n: Open your Gantt panel by clicking that panel in extension's popup</h2>
          </div>
          <div class="column">
            <img src="../assets/stepn-1.png" style="width:350px;" />
          </div>
        </div>
        <br />
        <br />

        <div class="columns">
          <div class="column is-two-fifths">
            <h2 class="subtitle">Congrats</h2>
          </div>
          <div class="column">
            <img src="../assets/stepn.png" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
};
</script>
<style lang="stylus" scoped>
img
  display block
</style>