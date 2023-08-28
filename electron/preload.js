const { contextBridge,ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('callCmd', {
  callCmd: (filePath) => ipcRenderer.send('call-cmd',filePath)
})

contextBridge.exposeInMainWorld('ButtonGroup', {
  insert: (ButtonGroup) => ipcRenderer.send('ButtonGroup-insert',ButtonGroup),
  update: (ButtonGroup) => ipcRenderer.send('ButtonGroup-update',ButtonGroup),
  delete: (buttonGroupId) => ipcRenderer.send('ButtonGroup-delete',buttonGroupId),
  select: () => ipcRenderer.invoke('ButtonGroup-select')
})

contextBridge.exposeInMainWorld('Button', {
  insert: (Button) => ipcRenderer.send('Button-insert',Button),
  update: (Button) => ipcRenderer.send('Button-update',Button),
  delete: (buttonId) => ipcRenderer.send('Button-delete',buttonId),
  select: (buttonGroupId) => ipcRenderer.invoke('Button-select',buttonGroupId)
})