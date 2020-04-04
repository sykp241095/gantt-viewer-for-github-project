import { Http } from 'vue-resource';

const { graphql } = require('@octokit/graphql');

// Enable gantt-viewer for all project.  2020/03-29 by wangdi
// const FLAG_PROJECT_ENABLE = 'EnableGantt'.toLowerCase();

const QUERY_FRAG_PROJECT = `
  body
  id
  name
  number
  state
  url
`;
// owner {
//   __typename
//   ... on Organization {
//     login
//   }
//   ... on Repository {
//     name
//     owner {
//       ... on Organization {
//         login
//       }
//       ... on User {
//         login
//       }
//     }
//   }
// }

class OctoClient {
  QUERY_FRAG_RATELIMIT = `
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
  `;

  request = async (query, parameters) => {
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `Bearer ${window.accessToken}`,
      },
    })
    const resp = await graphqlWithAuth(query, parameters)
    // const resp = await Http.post(
    //   'https://api.github.com/graphql',
    //   {
    //     query,
    //     parameters,
    //   },
    //   {
    //     headers: {
    //       Authorization: 'Bearer 7f9dd579be37b5d76c8dd3a89bb2ae80ec35bb89'
    //     }
    //   }
    // );
    return resp;
  };

  loadEnabledProjectsFromRepo = async (org, repo) => {
    const r = [];
    let after = null;
    for (;;) {
      const resp = await this.request(
        `
        query loadEnabledProjectsFromRepo($org: String!, $repo: String!, $after: String) {
          repository(name: $repo, owner: $org) {
            projects(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                ${QUERY_FRAG_PROJECT}
              }
            }
          }
          ${this.QUERY_FRAG_RATELIMIT}
        }
      `,
        {
          org,
          repo,
          after,
        }
      );
      if (!resp || !resp.repository) {
        console.log(resp);
        throw new Error('Invalid loadEnabledProjectsFromRepo response');
      }
      console.log('loadEnabledProjectsFromRepo rateLimit', resp.rateLimit);
      console.log(resp.repository.projects);
      resp.repository.projects.nodes.forEach(n => {
        r.push(n)
      });
      if (!resp.repository.projects.pageInfo.hasNextPage) {
        break;
      }
      after = resp.repository.projects.pageInfo.endCursor;
    }
    return r;
  };

  loadEnabledProjectsFromOrg = async org => {
    const r = [];
    let after = null;
    for (;;) {
      const resp = await this.request(
        `
        query loadEnabledProjectsFromOrg($org: String!, $after: String) {
          organization(login: $org) {
            projects(first: 100, after: $after) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                ${QUERY_FRAG_PROJECT}
              }
            }
          }
          ${this.QUERY_FRAG_RATELIMIT}
        }
      `,
        {
          org,
          after,
        }
      );
      if (!resp || !resp.organization) {
        console.log(resp);
        throw new Error('Invalid loadEnabledProjectsFromOrg response');
      }
      console.log('loadEnabledProjectsFromOrg rateLimit', resp.rateLimit);
      console.log(resp.organization.projects.nodes);
      resp.organization.projects.nodes.forEach(n => {
        r.push(n)
      });
      if (!resp.organization.projects.pageInfo.hasNextPage) {
        break;
      }
      after = resp.organization.projects.pageInfo.endCursor;
    }
    return r;
  };

  getRepoProject = async (org, repo, num) => {
    const resp = await this.request(
      `
      query getRepoProject($org: String!, $repo: String!, $num: Int!) {
        repository(name: $repo, owner: $org) {
          project(number: $num) {
            ${QUERY_FRAG_PROJECT}
          }
        }
        ${this.QUERY_FRAG_RATELIMIT}
      }
    `,
      {
        org,
        repo,
        num,
      }
    );
    if (!resp || !resp.repository) {
      console.log(resp);
      throw new Error('Invalid getRepoProject response');
    }
    console.log('getRepoProject rateLimit', resp.rateLimit);
    return resp.repository.project;
  };

  getOrgProject = async (org, num) => {
    const resp = await this.request(
      `
      query getOrgProject($org: String!, $num: Int!) {
        organization(login: $org) {
          project(number: $num) {
            ${QUERY_FRAG_PROJECT}
          }
        }
        ${this.QUERY_FRAG_RATELIMIT}
      }
    `,
      {
        org,
        num,
      }
    );
    if (!resp || !resp.organization) {
      console.log(resp);
      throw new Error('Invalid getOrgProject response');
    }
    console.log('getOrgProject rateLimit', resp.rateLimit);
    return resp.organization.project;
  };

  getIssueId = async (repoName, repoOwner, issueNumber) => {
    issueNumber = parseInt(issueNumber)
    const resp = await this.request(
      `
      query getOrgProject($repoName: String!, $repoOwner: String!, $issueNumber: Int!) {
        repository(name: $repoName, owner: $repoOwner) {
          issue(number: $issueNumber) {
            id
          }
        }
        ${this.QUERY_FRAG_RATELIMIT}
      }
    `,
      {
        repoName,
        repoOwner,
        issueNumber
      }
    );
    if (!resp || !resp.repository) {
      console.log(resp);
      throw new Error('Invalid getIssueId response');
    }
    return resp.repository.issue.id;
  }

  getGithubUserInfo = async () => {
    const resp = await this.request(
      `
      query { 
        viewer {
            login
            avatarUrl
            id
            name
          }
      }
      `
    )
    return resp
  }
}

export const octoClient = new OctoClient();

export const OctoClientPlugin = {
  install(Vue, _options) {
    Vue.prototype.$octoClient = octoClient;
  },
};
