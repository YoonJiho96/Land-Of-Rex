const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const AWS = require('aws-sdk');
const fs = require('fs');
const { execFile } = require('child_process');

require('dotenv').config(); // 환경 변수 로드

// S3 환경 변수
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const GAME_FOLDER = process.env.GAME_FOLDER_NAME;
// 게임 시작 환경 변수
const LOCAL_FOLDER = process.env.GAME_LOCAL_FOLDER_NAME
const GAME_EXE = process.env.GAME_EXE_NAME

// AWS S3 설정
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

const s3 = new AWS.S3();

let mainWindow;
let latestVersion = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    frame: false
  });

  mainWindow.setMenu(null);
  mainWindow.setResizable(false);
  mainWindow.loadFile('index.html');

  // 현재 버전 보내기
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('current-version', app.getVersion());
  });

  // 업데이트 이벤트 핸들러
  autoUpdater.on('update-available', (info) => {
    latestVersion = info.version;
    mainWindow.webContents.send('update-available', latestVersion);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('download-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', (error) => {
    console.error('업데이트 중 에러 발생:', error);
    mainWindow.webContents.send('update-error', error == null ? "알 수 없는 오류" : (error.stack || error).toString());
  });
};

app.whenReady().then(() => {
  autoUpdater.autoDownload = false;

  createWindow();
  autoUpdater.checkForUpdates();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 업데이트 관련 IPC 핸들러
ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

// 창 제어 IPC 핸들러
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

// 게임 다운로드 IPC 핸들러
ipcMain.on('download-game', async () => {
  try {
    // 기본 다운로드 경로 설정
    const defaultDownloadPath = path.join(__dirname, LOCAL_FOLDER);

    // S3에서 게임 폴더의 모든 객체 목록 가져오기
    const listParams = {
      Bucket: S3_BUCKET,
      Prefix: `${GAME_FOLDER}/`,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (!listedObjects.Contents.length) {
      throw new Error('S3에 다운로드할 게임 폴더가 존재하지 않습니다.');
    }

    // 디렉토리 생성
    fs.mkdirSync(defaultDownloadPath, { recursive: true });

    // 각 객체 다운로드
    for (let i = 0; i < listedObjects.Contents.length; i++) {
      const obj = listedObjects.Contents[i];
      const key = obj.Key;

      // 폴더는 건너뛰기
      if (key.endsWith('/')) continue;

      const relativePath = key.substring(GAME_FOLDER.length + 1);
      const filePath = path.join(defaultDownloadPath, relativePath);

      // 디렉토리 생성
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      };

      const file = fs.createWriteStream(filePath);
      const s3Stream = s3.getObject(params).createReadStream();

      await new Promise((resolve, reject) => {
        s3Stream.pipe(file)
          .on('error', reject)
          .on('close', resolve);
      });

      // 진행 상황 전송
      const progress = ((i + 1) / listedObjects.Contents.length) * 100;
      mainWindow.webContents.send('download-game-progress', { percent: progress.toFixed(2) });
    }

    // 다운로드 완료 이벤트 전송
    mainWindow.webContents.send('download-complete');
  } catch (error) {
    mainWindow.webContents.send('download-error', error.message || '알 수 없는 오류가 발생했습니다.');
  }
});

// 게임 시작 버튼
ipcMain.on('game-start', () => {
  try {
    const gamePath = path.join(__dirname, LOCAL_FOLDER, GAME_EXE);
    execFile(gamePath, (error) => {
      if (error) {
        mainWindow.webContents.send('game-start-error', error.message || '게임 실행에 실패했습니다.');
      } else {
        console.log("게임이 정상적으로 실행되었습니다.");
      }
    });
  } catch (error) {
    mainWindow.webContents.send('game-start-error', error.message);
  }
});