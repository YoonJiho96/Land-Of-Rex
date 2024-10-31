export function handleValidationControls(validation) {
    // 유효성 검사 결과에 따른 업데이트 필요 여부 표시
    validation.onUpdateRequired((requireUpdate) => {
        const updateStatus = document.getElementById('latest-game-version');

        if (requireUpdate) {
            updateStatus.textContent = '업데이트가 필요합니다.';
            updateStatus.style.color = 'red';
        } else {
            updateStatus.textContent = '게임이 최신 버전입니다.';
            updateStatus.style.color = 'green';
        }
    });

    // 게임 설치 확인
    validation.onInstallRequired((requireInstall) => {
        const updateStatus = document.getElementById('latest-game-version');
        if (requireInstall) {
            updateStatus.textContent = '게임 설치가 필요합니다.';
            updateStatus.style.color = 'red';
        }
    });
}