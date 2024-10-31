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
const LOCAL_FOLDER = "land-of-rex-launcher/LandOfRex"
const GAME_EXE = "LandOfRex.exe"

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

app.whenReady().then(async () => {
  autoUpdater.autoDownload = false;

  createWindow();
  autoUpdater.checkForUpdates();

  // 화면 로드된 후 게임 설치 검증
  mainWindow.webContents.on('did-finish-load', async () => {
    await validateManifest();
  });

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

// 빌드 경로
const exeDir = path.dirname(app.getPath('userData'));

// 게임 다운로드 IPC 핸들러
ipcMain.on('download-game', async () => {
  try {
    // 실행 파일의 디렉토리 경로 가져오기
    const defaultDownloadPath = path.join(exeDir, LOCAL_FOLDER);

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
    await validateManifest(); // 클라이언트 유효성 확인
  } catch (error) {
    mainWindow.webContents.send('download-error', error.message || '알 수 없는 오류가 발생했습니다.');
  }
});

// 게임 시작 버튼
ipcMain.on('game-start', () => {
  try {
    const gamePath = path.join(exeDir, LOCAL_FOLDER, GAME_EXE);
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


// 유효성 검사 작업
const crypto = require('crypto');

// 파일 해시 계산 함수
function calculateFileHash(filePath) {
  const hash = crypto.createHash('md5');
  const fileData = fs.readFileSync(filePath);
  hash.update(fileData);
  return hash.digest('hex');
}

// 디렉터리 크기 및 해시 계산 함수
function calculateDirectorySizeAndHash(directory) {
  let totalSize = 0;
  const hash = crypto.createHash('md5');

  // 파일을 정렬하여 일관된 해시 값 유지
  const filesAndDirs = fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

  filesAndDirs.forEach(dirent => {
    const fullPath = path.join(directory, dirent.name);

    if (dirent.isDirectory()) {
      // 재귀적으로 하위 디렉터리 크기와 해시 계산
      const { size, dirHash } = calculateDirectorySizeAndHash(fullPath);
      totalSize += size;
      hash.update(dirHash);
    } else {
      const fileSize = fs.statSync(fullPath).size;
      const fileHash = calculateFileHash(fullPath);
      totalSize += fileSize;
      hash.update(fileHash);
      hash.update(fileSize.toString());
    }
  });

  return { size: totalSize, dirHash: hash.digest('hex') };
}

// manifest 생성 함수
function generateFileManifest(directory) {
  // directory가 존재하는지 확인
  if (!fs.existsSync(directory)) {
    console.error(`Directory does not exist: ${directory}`);
    return null; // 설치 안됨
  }

  const manifest = { directories: [], files: [] };

  // 최상위 디렉터리 크기와 해시 값을 계산하여 저장
  const { size, dirHash } = calculateDirectorySizeAndHash(directory);
  manifest.root_directory = {
    path: path.basename(directory), // 최상위 디렉터리 이름만 저장
    size: size,
    hash: dirHash
  };

  // 각 하위 디렉터리 및 파일에 대한 메타데이터 생성
  const addFilesAndDirectories = (currentDir) => {
    const filesAndDirs = fs.readdirSync(currentDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

    filesAndDirs.forEach(dirent => {
      const fullPath = path.join(currentDir, dirent.name);
      const relativePath = path.relative(directory, fullPath);

      if (dirent.isDirectory()) {
        const { size, dirHash } = calculateDirectorySizeAndHash(fullPath);
        manifest.directories.push({
          path: relativePath,
          size: size,
          hash: dirHash
        });
        addFilesAndDirectories(fullPath); // 하위 디렉터리 재귀 호출
      } else {
        const fileSize = fs.statSync(fullPath).size;
        const fileHash = calculateFileHash(fullPath);
        manifest.files.push({
          path: relativePath,
          size: fileSize,
          hash: fileHash
        });
      }
    });
  };

  addFilesAndDirectories(directory);
  return manifest;
}

// 유효성 검사 함수
async function validateManifest() {
  const localManifestPath = path.join(exeDir, "land-of-rex-launcher", 'manifest.json');
  const gameFolderPath = path.join(exeDir, LOCAL_FOLDER); // LandOfRex 폴더 경로
  const serverManifest = await downloadManifestFromS3();

  // LandOfRex 폴더가 존재하지 않는 경우
  if (!fs.existsSync(gameFolderPath)) {
    console.log("게임 폴더가 존재하지 않습니다. 설치가 필요합니다.");
    mainWindow.webContents.send('installation-required', true); // 설치가 필요함을 UI에 알림
    return false; // 설치 필요
  }

  // 로컬 manifest.json 존재 여부 확인
  if (fs.existsSync(localManifestPath)) {
    const localManifest = JSON.parse(fs.readFileSync(localManifestPath, 'utf-8'));

    if (localManifest.root_directory.hash === serverManifest.root_directory.hash) {
      mainWindow.webContents.send('update-required', false);
      console.log("로컬과 서버 manifest가 일치합니다.");
      return true; // 업데이트 필요 없음
    } else {
      mainWindow.webContents.send('update-required', true);
      console.log("업데이트가 필요합니다.");
      return false; // 업데이트 필요
    }
  } else {
    console.log("로컬 manifest가 존재하지 않아 새로 생성합니다.");
    const manifest = generateFileManifest(gameFolderPath);

    // 폴더가 없는 경우 null이 반환되므로 null 체크 후 파일 생성
    if (manifest) {
      fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2));
      await validateManifest();
      return true; // manifest 생성 성공
    } else {
      mainWindow.webContents.send('installation-required', true); // 설치 필요 알림
      return false; // 설치 필요
    }
  }
}

// 직접 게임 설치 유효성 검사
async function doValidateGame() {
  const gameFolderPath = path.join(exeDir, LOCAL_FOLDER);

  // LandOfRex 폴더가 존재하지 않는 경우
  if (!fs.existsSync(gameFolderPath)) {
    console.log("유효성 확인 : 게임 폴더가 존재하지 않습니다. 설치가 필요합니다.");
    mainWindow.webContents.send('installation-required', true);
    return;
  }

  // 새로 manifest 생성
  const localManifestPath = path.join(exeDir, "land-of-rex-launcher", 'manifest.json');
  const manifest = generateFileManifest(gameFolderPath);
  fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2));

  // manifest 체크
  const serverManifest = await downloadManifestFromS3();
  const localManifest = JSON.parse(fs.readFileSync(localManifestPath, 'utf-8'));
  if (localManifest.root_directory.hash === serverManifest.root_directory.hash) {
    mainWindow.webContents.send('update-required', false);
    console.log("로컬과 서버 manifest가 일치합니다.");
    return;
  } else {
    mainWindow.webContents.send('update-required', true);
    console.log("업데이트가 필요합니다.");
    return;
  }
}

// 게임 유효성 검사 버튼
ipcMain.on('game-validate', () => {
  try {
    console.log("유효성 검사 시작");
    doValidateGame();
  } catch (error) {
    console.log(error.message);
  }
});

const downloadManifestFromS3 = async () => {
  const params = {
    Bucket: S3_BUCKET,  // 버킷 이름
    Key: `game/manifest.json` // manifest 파일의 S3 경로
  };

  try {
    // S3에서 객체를 가져옴
    const data = await s3.getObject(params).promise();
    const manifestJson = data.Body.toString('utf-8'); // Buffer를 문자열로 변환
    return JSON.parse(manifestJson); // JSON 객체로 변환하여 반환
  } catch (error) {
    console.error("S3에서 manifest.json 파일을 다운로드하는 중 오류 발생:", error);
    throw new Error('manifest 파일을 가져올 수 없습니다.');
  }
};
