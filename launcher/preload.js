const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('updater', {
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, version) => callback(version)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
  onUpdateError: (callback) => ipcRenderer.on('update-error', (event, error) => callback(error)),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progress) => callback(progress)),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  installUpdate: () => ipcRenderer.send('install-update'),

  // 현재 버전을 받는 부분 추가
  onCurrentVersion: (callback) => ipcRenderer.on('current-version', (event, version) => callback(version)),
});

contextBridge.exposeInMainWorld('electron', {
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window')
});

// 게임 다운로드
contextBridge.exposeInMainWorld('api', {
  downloadGame: () => ipcRenderer.send('download-game'),
  onDownloadGameProgress: (callback) => ipcRenderer.on('download-game-progress', (event, progress) => callback(progress)),
  onDownloadGameComplete: (callback) => ipcRenderer.on('download-complete', () => callback()),
  onDownloadError: (callback) => ipcRenderer.on('download-error', (event, error) => callback(error)),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
});

// 게임 시작
contextBridge.exposeInMainWorld('game', {
  gameStart: () => ipcRenderer.send('game-start'),
  onGameStartError: (callback) => ipcRenderer.on('game-start-error', (event, errorMessage) => callback(errorMessage))
});