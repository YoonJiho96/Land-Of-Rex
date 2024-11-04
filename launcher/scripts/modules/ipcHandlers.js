const { ipcMain } = require('electron');
const { downloadUpdate, installUpdate } = require('./updater');
const { downloadGame } = require('./s3Service');
const { doValidateGame } = require('./manifestValidator');
const path = require('path');
const { validateManifest } = require('./manifestValidator');
const { generateVersionJson } = require('./checkGame');

const LOCAL_FOLDER = "land-of-rex-launcher/LandOfRex";
const GAME_EXE = "LandOfRex.exe";

function handleIPC(mainWindow, exeDir) {
    // 업데이트 IPC
    ipcMain.on('download-update', () => {
        downloadUpdate();
    });

    ipcMain.on('install-update', () => {
        installUpdate();
    });

    // 게임 다운로드 IPC
    ipcMain.on('download-game', async () => {
        try {
            const defaultDownloadPath = path.join(exeDir, LOCAL_FOLDER);
            await downloadGame(defaultDownloadPath, mainWindow);
            await validateManifest(exeDir, mainWindow);

            // 버전 정보 저장
            await generateVersionJson(exeDir, mainWindow);
        } catch (error) {
            mainWindow.webContents.send('download-error', error.message || '알 수 없는 오류가 발생했습니다.');
        }
    });

    // 게임 시작 IPC
    ipcMain.on('game-start', () => {
        try {
            const gamePath = path.join(exeDir, LOCAL_FOLDER, GAME_EXE);
            const { execFile } = require('child_process');
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

    // 게임 유효성 검사 IPC
    ipcMain.on('game-validate', () => {
        try {
            doValidateGame(exeDir, mainWindow);
        } catch (error) {
            mainWindow.webContents.send('validate-error', error.message);
        }
    });
}

module.exports = { handleIPC };