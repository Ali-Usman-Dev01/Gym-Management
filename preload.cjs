const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  members: {
    find: (query) => ipcRenderer.invoke('members-find', query),
    insert: (doc) => ipcRenderer.invoke('members-insert', doc),
    update: (id, update) => ipcRenderer.invoke('members-update', id, update),
    remove: (id) => ipcRenderer.invoke('members-remove', id),
  },
  plans: {
    find: (query) => ipcRenderer.invoke('plans-find', query),
    insert: (doc) => ipcRenderer.invoke('plans-insert', doc),
    update: (id, update) => ipcRenderer.invoke('plans-update', id, update),
    remove: (id) => ipcRenderer.invoke('plans-remove', id),
  },
  payments: {
    find: (query) => ipcRenderer.invoke('payments-find', query),
    insert: (doc) => ipcRenderer.invoke('payments-insert', doc),
    update: (id, update) => ipcRenderer.invoke('payments-update', id, update),
    remove: (id) => ipcRenderer.invoke('payments-remove', id),
  },
  checkins: {
    find: (query) => ipcRenderer.invoke('checkins-find', query),
    insert: (doc) => ipcRenderer.invoke('checkins-insert', doc),
    update: (id, update) => ipcRenderer.invoke('checkins-update', id, update),
    remove: (id) => ipcRenderer.invoke('checkins-remove', id),
  },
});