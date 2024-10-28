// 업데이트 모달 요소
const updateModal = document.getElementById('update-modal');
const downloadedModal = document.getElementById('downloaded-modal');
const progressModal = document.getElementById('progress-modal');
const currentVersionSpan = document.getElementById('current-version');
const latestVersionP = document.getElementById('latest-version');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');

// 버튼 요소
const updateYesBtn = document.getElementById('update-yes');
const updateNoBtn = document.getElementById('update-no');
const installYesBtn = document.getElementById('install-yes');
const installNoBtn = document.getElementById('install-no');

// 다운로드 확인 모달 버튼
const downloadButton = document.getElementById('download-button');
const downloadModal = document.getElementById('download-modal');
const downloadYesBtn = document.getElementById('download-yes');
const downloadNoBtn = document.getElementById('download-no');

// 다운로드 완료 모달 버튼
const downloadCompleteModal = document.getElementById('download-complete-modal');
const downloadCompleteOkBtn = document.getElementById('download-complete-ok');

// 다운로드 오류 모달 버튼
const downloadErrorModal = document.getElementById('download-error-modal');
const downloadErrorOkBtn = document.getElementById('download-error-ok');
const downloadErrorMessage = document.getElementById('download-error-message');

// 게임 시작 버튼
const gameStartBtn = document.getElementById('game-start-button');

// 게임 시작 오류 모달
const gameStartErrorModal = document.getElementById('game-start-error-modal');
const gameStartErrorOkBtn = document.getElementById('game-start-error-ok');
const gameStartErrorMessage = document.getElementById('game-start-error-message');

// 현재 버전 설정 (메인 프로세스로부터 수신)
window.updater.onCurrentVersion((version) => {
    currentVersionSpan.textContent = version;
});

// 업데이트가 있을 때
window.updater.onUpdateAvailable((version) => {
    latestVersionP.textContent = `새로운 버전: ${version}`;
    updateModal.style.display = 'flex';
});

// 업데이트 다운로드 진행 시
window.updater.onDownloadProgress((progress) => {
    const percent = Math.round(progress.percent);
    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    if (progressModal.style.display !== 'flex') {
        progressModal.style.display = 'flex';
    }
});

// 업데이트 다운로드 완료 시
window.updater.onUpdateDownloaded(() => {
    progressModal.style.display = 'none';
    downloadedModal.style.display = 'flex';
});

// 업데이트 오류 발생 시
window.updater.onUpdateError((error) => {
    alert(`업데이트 중 오류가 발생했습니다: ${error}`);
});

// "예" 버튼 클릭 시 업데이트 다운로드 시작
updateYesBtn.addEventListener('click', () => {
    window.updater.downloadUpdate();
    updateModal.style.display = 'none';
});

// "아니오" 버튼 클릭 시 모달 닫기
updateNoBtn.addEventListener('click', () => {
    updateModal.style.display = 'none';
});

// "예" 버튼 클릭 시 업데이트 설치
installYesBtn.addEventListener('click', () => {
    window.updater.installUpdate();
});

// "아니오" 버튼 클릭 시 모달 닫기
installNoBtn.addEventListener('click', () => {
    downloadedModal.style.display = 'none';
});

// 창 제어 버튼 동작
document.getElementById('minimize-btn').addEventListener('click', () => {
    window.api.minimizeWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
    window.api.closeWindow();
});

// 게임 다운로드 버튼 클릭 시 다운로드 확인 모달 표시 및 다운로드 시작
downloadButton.addEventListener('click', () => {
    // '예' 버튼 클릭 시 다운로드 시작
    downloadYesBtn.addEventListener('click', () => {
        downloadModal.style.display = 'none';
        window.api.downloadGame();
        document.getElementById('progress-game-container').style.display = 'block';
    });

    // '아니오' 버튼 클릭 시 모달 닫기
    downloadNoBtn.addEventListener('click', () => {
        downloadModal.style.display = 'none';
    });

    // 다운로드 확인 모달 표시
    downloadModal.style.display = 'flex';
});

// 게임 다운로드 진행 상황 업데이트
window.api.onDownloadGameProgress((progress) => {
    document.getElementById('progress-game-percent').innerText = `${progress.percent}%`;
    document.getElementById('progress-game-bar').value = progress.percent;
});

// 게임 다운로드 완료 시 처리
window.api.onDownloadGameComplete(() => {
    document.getElementById('progress-game-container').style.display = 'none';
    document.getElementById('progress-game-bar').value = 0;
    document.getElementById('progress-game-percent').innerText = '0%';
    downloadCompleteModal.style.display = 'flex';
});

// 게임 다운로드 오류 발생 시 처리
window.api.onDownloadError((error) => {
    document.getElementById('progress-game-container').style.display = 'none';
    document.getElementById('progress-game-bar').value = 0;
    document.getElementById('progress-game-percent').innerText = '0%';
    downloadErrorMessage.textContent = `다운로드 중 오류 발생: ${error}`;
    downloadErrorModal.style.display = 'flex';
});

// 다운로드 완료 모달의 "확인" 버튼 클릭 시 모달 닫기
downloadCompleteOkBtn.addEventListener('click', () => {
    downloadCompleteModal.style.display = 'none';
});

// 다운로드 오류 모달의 "확인" 버튼 클릭 시 모달 닫기
downloadErrorOkBtn.addEventListener('click', () => {
    downloadErrorModal.style.display = 'none';
});

// 게임 시작
gameStartBtn.addEventListener('click', () => {
    window.game.gameStart();
});

// 게임 시작 오류 이벤트 수신 시
window.game.onGameStartError((errorMessage) => {
    console.log("게임 실행 오류 발생2:", errorMessage); // 오류 발생 시 로그 추가
    gameStartErrorMessage.textContent = `게임 시작 중 오류 발생: ${errorMessage}`;
    gameStartErrorModal.style.display = 'flex';
});

// 게임 시작 오류 모달의 "확인" 버튼 클릭 시 모달 닫기
gameStartErrorOkBtn.addEventListener('click', () => {
    gameStartErrorModal.style.display = 'none';
});