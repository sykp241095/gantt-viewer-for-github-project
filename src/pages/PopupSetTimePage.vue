<template>
  <div class="popup-set-time-wrapper">
    <b-loading is-full-page="true" :active="isLoading" :can-cancel="true"></b-loading>
    <div class="header" @click="$router.push('/')">
      <img src="../assets/back.svg" width="20px" height="10px">
      <span>Back</span>
    </div>
    <div class="issue-body-wrapper">
      <div class="form">
        <div class="form-item">
          <div class="form-item-title">Set Time</div>
          <div class="form-item-hint" v-if="dates">
          {{ ganttDateDisplay }}
          </div>
          <b-field>
            <b-datepicker
                placeholder="Click to select..."
                inline
                v-model="dates"
                range>
            </b-datepicker>
          </b-field>
        </div>
      </div>
    </div>
    <div class="form-footer" @click="submit">Save</div>
  </div>
</template>

<script>
'use strict'

import moment from 'moment'

const FLAG_REGEX_ITEM_START = /GanttStart:\s*(\d{4}-\d{2}-\d{2})/i
const FLAG_REGEX_ITEM_DUE = /GanttDue:\s*(\d{4}-\d{2}-\d{2})/i
const FLAG_REGEX_ITEM_DURATION = /GanttDuration:\s*([\d]+)d/i
const FLAG_DATE_FORMAT = 'YYYY-MM-DD'

const TEMPLATE_ITEM_START = 'GanttStart: {}'
const TEMPLATE_ITEM_DUE = 'GanttDue: {}'
const TEMPLATE_ITEM_PROGRESS = 'GanttProgress: {}%'


export default {
  data () {
    return {
      dates: null,
      isLoading: false
    }
  },
  mounted () {
    document.body.style.height = '545px'
    // window.issueBody = "包含：\n- Guess\n- Set Time\n<!-- GanttStart: 2020-03-30 -->\n<!-- GanttDue: 2020-06-07 -->\n<!-- GanttProgress: 58% -->"
    // window.repoName = 'gantt-viewer-for-github-project'
    // window.repoOwner = 'sykp241095'
    // window.issueNumber = '12'
    let ganttStart = this.getValueFromBody(window.issueBody, FLAG_REGEX_ITEM_START)
    let ganttEnd = this.getValueFromBody(window.issueBody, FLAG_REGEX_ITEM_DUE)
    let ganttDuration = this.getValueFromBody(window.issueBody, FLAG_REGEX_ITEM_DURATION)
    if (ganttStart && ganttEnd) {
      ganttStart = moment(ganttStart).toDate()
      ganttEnd = moment(ganttEnd).toDate()
    } else if (ganttStart && ganttDuration) {
      ganttStart = moment(ganttStart).toDate()
      ganttEnd = moment(ganttStart).add(ganttDuration, 'day').toDate()
    } else {
      ganttStart = moment().toDate()
      ganttEnd = moment().add(1, 'day').toDate()
    }
    this.dates = [ganttStart, ganttEnd]
  },
  methods: {
    async submit () {
      this.isLoading = true
      let body = window.issueBody
      body = this.updateIssueBodyForField(
        body,
        FLAG_REGEX_ITEM_START,
        TEMPLATE_ITEM_START,
        moment(this.dates[0]).format(FLAG_DATE_FORMAT)
      )
      body = this.updateIssueBodyForField(
        body,
        FLAG_REGEX_ITEM_DUE,
        TEMPLATE_ITEM_DUE,
        moment(this.dates[1]).format(FLAG_DATE_FORMAT)
      )
      const m = body.match(FLAG_REGEX_ITEM_DURATION);
      if (m) {
        body = body.replace(m[0], '');
      }
      let issueId = await this.$octoClient.getIssueId(window.repoName, window.repoOwner, window.issueNumber)
      await this.$octoClient.request(
        `
        mutation update($id: ID!, $body: String!) {
          __typename
          updateIssue(input: {id: $id, body: $body}) {
            issue {
              body
            }
          }
        }
      `,
        {
          id: issueId,
          body,
        }
      )
      this.isLoading = false
      window.issueBody = body
      this.$buefy.notification.open({
        message: 'Save successfully!',
        type: 'is-success'
      })
    },
    getValueFromBody (body, flagMatcher) {
      const m = body.match(flagMatcher)
      if (m) {
        return m[1]
      }
      return null
    },
    updateIssueBodyForField (body, flagMatcher, template, newValue ) {
      const m = body.match(flagMatcher);
      const newValueFull = template.replace('{}', newValue);
      if (m) {
        return body.replace(m[0], newValueFull);
      } else {
        return body + `\n<!-- ${newValueFull} -->`;
      }
    }
  },
  computed: {
    ganttDateDisplay: function () {
      return `${moment(this.dates[0]).format(FLAG_DATE_FORMAT)} ~ ${moment(this.dates[1]).format(FLAG_DATE_FORMAT)}`
    }
  }
}
</script>

<style lang="stylus">
.popup-set-time-wrapper
  width 100%

  .header
    padding 10px 15px
    background-color #F7F9FA
    height 44px
    cursor pointer
    border-bottom 1px solid #E7E8EA

    &:hover
      background-color #e6e6e6

    span
      line-height 20px
      position relative
      top -4px
      padding-left 10px

  .issue-body-wrapper
    padding 10px

    .form
      padding 10px 0
      margin auto

      .form-item-title
        text-align center
        font-size 1.2rem
        font-weight 500

      .form-item-hint
        text-align center
        padding 5px 0

  .form-footer
    padding 10px 15px
    background-color #F7F9FA
    height 44px
    cursor pointer
    text-align center

    &:hover
      background-color #e6e6e6
</style>
