import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    panels: {},
  },
  mutations: {
    addPanel(state, { id, name }) {
      let timestamp = Date.now()
      const panel = {
        id,
        name,
        timestamp,
        projects: {},
      };
      Vue.set(state.panels, id, panel);
    },
    viewPanel(state, { id }) {
      let panel = state.panels[id]
      if (!panel) {
        return
      }
      Vue.set(state.panels[id], 'timestamp', Date.now())
    },
    deletePanel(state, { id }) {
      Vue.delete(state.panels, id);
    },
    renamePanel(state, { id, name }) {
      state.panels[id].name = name;
    },
    addProjects(state, { id, projects }) {
      projects.forEach(p => {
        Vue.set(state.panels[id].projects, p.id, {
          id: p.id,
          url: p.url,
          name: p.name,
        });
      });
    },
    deleteProject(state, { id, projectId }) {
      Vue.delete(state.panels[id].projects, projectId);
    },
  },
  actions: {},
  getters: {
    historyList: state => {
      let _tempPanel = []
      for(let id in state.panels) {
        _tempPanel.push({id, name: state.panels[id].name, timestamp: state.panels[id].timestamp})
      }
      return _tempPanel
      _tempPanel.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0
      })
      return _tempPanel
    }
  }
};
