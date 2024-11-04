const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { downloadManifestFromS3 } = require('./s3Service');

function calculateFileHash(filePath) {
    const hash = crypto.createHash('md5');
    const fileData = fs.readFileSync(filePath);
    hash.update(fileData);
    return hash.digest('hex');
}

function calculateDirectorySizeAndHash(directory) {
    let totalSize = 0;
    const hash = crypto.createHash('md5');

    const filesAndDirs = fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

    filesAndDirs.forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);

        if (dirent.isDirectory()) {
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

function generateFileManifest(directory) {
    if (!fs.existsSync(directory)) {
        console.error(`Directory does not exist: ${directory}`);
        return null;
    }

    const manifest = { directories: [], files: [] };
    const { size, dirHash } = calculateDirectorySizeAndHash(directory);
    manifest.root_directory = {
        path: path.basename(directory),
        size: size,
        hash: dirHash
    };

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
                addFilesAndDirectories(fullPath);
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

async function validateManifest(exeDir, mainWindow) {
    const localManifestPath = path.join(exeDir, "land-of-rex-launcher", 'manifest.json');
    const GAME_FOLDER = "land-of-rex-launcher/LandOfRex"; // 일관성을 유지하거나 매개변수로 전달
    const gameFolderPath = path.join(exeDir, GAME_FOLDER);
    const serverManifest = await downloadManifestFromS3();

    if (!fs.existsSync(gameFolderPath)) {
        mainWindow.webContents.send('installation-required', true);
        return false;
    }

    if (fs.existsSync(localManifestPath)) {
        const localManifest = JSON.parse(fs.readFileSync(localManifestPath, 'utf-8'));

        if (localManifest.root_directory.hash === serverManifest.root_directory.hash) {
            mainWindow.webContents.send('update-required', false);
            return true;
        } else {
            mainWindow.webContents.send('update-required', true);
            return false;
        }
    } else {
        const manifest = generateFileManifest(gameFolderPath);

        if (manifest) {
            fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2));
            return await validateManifest(exeDir, mainWindow);
        } else {
            mainWindow.webContents.send('installation-required', true);
            return false;
        }
    }
}

async function doValidateGame(exeDir, mainWindow) {
    const gameFolderPath = path.join(exeDir, "land-of-rex-launcher", 'LandOfRex');

    if (!fs.existsSync(gameFolderPath)) {
        console.log("유효성 확인 : 게임 폴더가 존재하지 않습니다. 설치가 필요합니다.");
        mainWindow.webContents.send('installation-required', true);
        return;
    }

    const localManifestPath = path.join(exeDir, "land-of-rex-launcher", 'manifest.json');
    const manifest = generateFileManifest(gameFolderPath);
    fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2));

    const serverManifest = await downloadManifestFromS3();
    const localManifest = JSON.parse(fs.readFileSync(localManifestPath, 'utf-8'));

    if (localManifest.root_directory.hash === serverManifest.root_directory.hash) {
        mainWindow.webContents.send('update-required', false);
        console.log("로컬과 서버 manifest가 일치합니다.");
    } else {
        mainWindow.webContents.send('update-required', true);
        console.log("업데이트가 필요합니다.");
    }
}

async function doValidateGameVersion(exeDir, mainWindow) {
    // 1. manifest 서버와 비교
    const checkedList = checkcheck(exeDir, mainWindow);

    if (checkedList.length == 0) {
        // 업데이트 할 필요가 없음
        console.log("파일이 모두 최신 버전 입니다.");
    } else {
        console.log("갱신 필요한 파일 있음");
    }
}

async function checkcheck(exeDir, mainWindow) {
    const localManifestPath = path.join(exeDir, "land-of-rex-launcher", 'manifest.json');
    const gameFolderPath = path.join(exeDir, "land-of-rex-launcher", "LandOfRex");
    const serverManifest = await downloadManifestFromS3();

    // 로컬 manifest 새로 생성
    const manifest = generateFileManifest(gameFolderPath);
    if (manifest) {
        fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2));
    } else {
        mainWindow.webContents.send('installation-required', true);
        return;
    }

    const localManifest = JSON.parse(fs.readFileSync(localManifestPath, 'utf-8'));
    const differingFiles = [];

    // 서버와 로컬 manifest의 파일 해시 비교
    const compareAllFiles = (serverFiles, localFiles) => {
        const localFileMap = new Map(localFiles.map(file => [file.path, file]));

        serverFiles.forEach(serverFile => {
            const localFile = localFileMap.get(serverFile.path);

            console.log(`Checking file: ${serverFile.path}`);

            // 서버에만 있는 파일 또는 해시가 다른 파일 기록
            if (!localFile || localFile.hash !== serverFile.hash) {
                console.log(`서버와 다른 파일: ${serverFile.path}`);
                differingFiles.push({
                    path: serverFile.path,
                    size: serverFile.size,
                    hash: serverFile.hash
                });
            }
        });
    };

    compareAllFiles(serverManifest.files, localManifest.files);

    if (differingFiles.length > 0) {
        console.log("서버와 다른 파일 목록이 있습니다.");
    } else {
        console.log("로컬과 서버 manifest가 일치합니다.");
    }

    return differingFiles;
}

module.exports = { validateManifest, doValidateGame, doValidateGameVersion };