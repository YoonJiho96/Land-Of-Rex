export function handleDownload(api) {
    const downloadButton = document.getElementById('download-button');
    const downloadModal = document.getElementById('download-modal');
    const downloadYesBtn = document.getElementById('download-yes');
    const downloadNoBtn = document.getElementById('download-no');
    const downloadCompleteModal = document.getElementById('download-complete-modal');
    const downloadCompleteOkBtn = document.getElementById('download-complete-ok');
    const downloadErrorModal = document.getElementById('download-error-modal');
    const downloadErrorOkBtn = document.getElementById('download-error-ok');
    const downloadErrorMessage = document.getElementById('download-error-message');
    const progressGameContainer = document.getElementById('progress-game-container');
    const progressGameBar = document.getElementById('progress-game-bar');
    const progressGamePercent = document.getElementById('progress-game-percent');

    // 다운로드 확인 모달 표시 및 다운로드 시작
    downloadButton.addEventListener('click', () => {
        // '예' 버튼 클릭 시 다운로드 시작
        downloadYesBtn.addEventListener('click', () => {
            downloadModal.style.display = 'none';
            api.downloadGame();
            progressGameContainer.style.display = 'block';
        }, { once: true });

        // '아니오' 버튼 클릭 시 모달 닫기
        downloadNoBtn.addEventListener('click', () => {
            downloadModal.style.display = 'none';
        }, { once: true });

        // 다운로드 확인 모달 표시
        downloadModal.style.display = 'flex';
    });

    // 게임 다운로드 진행 상황 업데이트
    api.onDownloadGameProgress((progress) => {
        progressGamePercent.innerText = `${progress.percent}%`;
        progressGameBar.value = progress.percent;
    });

    // 게임 다운로드 완료 시 처리
    api.onDownloadGameComplete(() => {
        // progressGameContainer.style.display = 'none';
        progressGameBar.value = 0;
        progressGamePercent.innerText = '0%';
        downloadCompleteModal.style.display = 'flex';
    });

    // 게임 다운로드 오류 발생 시 처리
    api.onDownloadError((error) => {
        // progressGameContainer.style.display = 'none';
        progressGameBar.value = 0;
        progressGamePercent.innerText = '0%';
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
}
