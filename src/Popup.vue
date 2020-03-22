<template>
  <div>
    <b-loading :is-full-page="true" :active="false" :can-cancel="false" />
    <router-view></router-view>
  </div>
</template>

<script>
'use strict'

export default {
  name: 'Popup',
  data () {
    return {
      userInfo,
      accessToken
    }
  },
}
</script>

<style lang="stylus">
body
  height 100%
  width auto
  right auto
  bottom auto
  background-color #fff
  color #222
  font 400 15px/20px
  font-family -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
              'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
              'Segoe UI Emoji', 'Segoe UI Symbol'
  overflow visible
  overflow-y scroll
  margin 0
  position relative
  box-sizing border-box

#app
  height 100%
  width 100%
  padding 0
  overflow hidden
</style>

<style lang="scss">
@import './custom.scss'
</style>

