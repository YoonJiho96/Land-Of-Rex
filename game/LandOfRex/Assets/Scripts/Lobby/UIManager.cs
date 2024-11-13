using UnityEngine;
using UnityEngine.SceneManagement;

public class UIManager : MonoBehaviour
{
    public GameObject screenUI;  // Screen UI 전체
    public GameObject menuUI;    // Menu UI
    public GameObject settingsUI; // Settings UI

    public GameObject tutoUI;    // ScreenUI 자식 UI
    public GameObject stage1UI;  // ScreenUI 자식 UI
    public GameObject stage2UI;  // ScreenUI 자식 UI

    public Collider tutoCollider;    // 튜토리얼 영역 Collider
    public Collider stage1Collider;  // Stage1 영역 Collider
    public Collider stage2Collider;  // Stage2 영역 Collider

    private GameObject currentScreenUI; // 현재 활성화된 ScreenUI 자식 UI
    private bool isScreenUIActive = false;
    private bool isMenuUIActive = false;

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Return)) // Enter 키
        {
            ShowScreenUI();
        }

        if (Input.GetKeyDown(KeyCode.Escape)) // Esc 키
        {
            if (isScreenUIActive)
            {
                HideScreenUI(); // ScreenUI가 활성화되어 있으면 ScreenUI를 닫음
            }
            else
            {
                ToggleMenuUI(); // ScreenUI가 닫혀 있으면 MenuUI를 토글
            }
        }
    }

    private void ShowScreenUI()
    {
        if (isMenuUIActive || isScreenUIActive)
            return; // Menu UI가 열려있거나 이미 Screen UI가 켜져있으면 실행하지 않음

        // Player가 있는 Collider 영역에 따라 해당 UI를 활성화
        if (IsPlayerInCollider(tutoCollider))
        {
            currentScreenUI = tutoUI;
        }
        else if (IsPlayerInCollider(stage1Collider))
        {
            currentScreenUI = stage1UI;
        }
        else if (IsPlayerInCollider(stage2Collider))
        {
            currentScreenUI = stage2UI;
        }

        if (currentScreenUI != null)
        {
            currentScreenUI.SetActive(true); // 해당 자식 UI 활성화
            screenUI.SetActive(true); // Screen UI 전체 활성화
            isScreenUIActive = true;
        }
    }

    private void HideScreenUI()
    {
        if (currentScreenUI != null)
        {
            currentScreenUI.SetActive(false); // 현재 활성화된 자식 UI 비활성화
            currentScreenUI = null;
        }

        screenUI.SetActive(false); // Screen UI 전체 비활성화
        isScreenUIActive = false;
    }

    private void ToggleMenuUI()
    {
        isMenuUIActive = !isMenuUIActive; // Menu UI의 활성화 상태를 토글
        menuUI.SetActive(isMenuUIActive); // Menu UI 활성화/비활성화

        // 게임 일시정지 및 재개 설정
        Time.timeScale = isMenuUIActive ? 0 : 1;
    }

    public void PlayTutorial()
    {
        SceneManager.LoadScene("TutorialScene 1");
    }

    public void PlayStage1()
    {
        SceneManager.LoadScene("Stage1 1");
    }

    public void PlayStage2()
    {
        SceneManager.LoadScene("Stage2 1");
    }

    // **Continue 버튼 기능**
    public void OnContinueButtonClicked()
    {
        ToggleMenuUI(); // Menu UI를 닫고 게임을 재개
        Debug.Log("Continue button clicked! Resuming game.");
    }

    // **Settings 버튼 기능**
    public void OnSettingsButtonClicked()
    {
        settingsUI.SetActive(true); // Settings UI 열기
        menuUI.SetActive(false);    // Menu UI 숨기기 (또는 메뉴에 함께 표시 가능)
        Debug.Log("Settings button clicked! Opening settings menu.");
    }

    // **Exit 버튼 기능**
    public void OnExitButtonClicked()
    {
        Debug.Log("Exit button clicked! Returning to main menu.");
        Time.timeScale = 1; // 게임 종료 전 시간 복구
        SceneManager.LoadScene("MainMenu"); // 메인 메뉴 씬으로 이동 (MainMenu 씬 이름 사용)
    }

    private bool IsPlayerInCollider(Collider collider)
    {
        // 플레이어가 해당 Collider 영역에 있는지 확인
        return collider.bounds.Contains(GameObject.FindGameObjectWithTag("Player").transform.position);
    }
}
