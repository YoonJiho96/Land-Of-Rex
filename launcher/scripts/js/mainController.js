import { handleUpdate } from './updateController.js';
import { handleDownload } from './downloadController.js';
import { handleGameStart } from './gameController.js';
import { handleWindowControls } from './ui/windowControls.js';

document.addEventListener('DOMContentLoaded', () => {
    // 업데이트 관련 초기화
    handleUpdate(window.updater);

    // 다운로드 관련 초기화
    handleDownload(window.api);

    // 게임 시작 관련 초기화
    handleGameStart(window.game);

    // 창 제어 초기화
    handleWindowControls(window.electron);

    // 현재 버전 설정
    const currentVersionSpan = document.getElementById('current-version');
    window.updater.onCurrentVersion((version) => {
        currentVersionSpan.textContent = version;
    });

    // 유효성 검사 결과에 따른 업데이트 필요 여부 표시
    window.validation.onUpdateRequired((requireUpdate) => {
        const updateStatus = document.getElementById('latest-game-version');

        if (requireUpdate) {
            updateStatus.textContent = '업데이트가 필요합니다.';
            updateStatus.style.color = 'red';
        } else {
            updateStatus.textContent = '게임이 최신 버전입니다.';
            updateStatus.style.color = 'green';
        }
    });

    window.validation.onInstallRequired((requireInstall) => {
        const updateStatus = document.getElementById('latest-game-version');
        if (requireInstall) {
            updateStatus.textContent = '게임 설치가 필요합니다.';
            updateStatus.style.color = 'red';
        }
    })
});
