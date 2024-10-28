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
});
