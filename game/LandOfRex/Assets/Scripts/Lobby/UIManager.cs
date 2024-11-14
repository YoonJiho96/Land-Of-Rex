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

    public RankingManager rankingManager;
    private long userId = 0;

    private void Start()
    {
        if(LoginDataManager.Instance != null)
        {
            userId = LoginDataManager.Instance.LoginData.userId;
        }
        Debug.Log($"userId in UIManager: {userId}");  // UIManager에서
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space)) // Spacebar 키
        {
            if (isScreenUIActive) // Screen UI가 열려있을 때
            {
                LoadSelectedStage(); // Play 버튼 역할을 수행
            }
            else
            {
                ShowScreenUI(); // Screen UI를 열기
            }
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

    private void LoadSelectedStage()
    {
        if (currentScreenUI == tutoUI)
        {
            PlayTutorial();
        }
        else if (currentScreenUI == stage1UI)
        {
            PlayStage1();
        }
        else if (currentScreenUI == stage2UI)
        {
            PlayStage2();
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
            callAllRanking(0);
            callPersonalRanking(0, userId);
        }
        else if (IsPlayerInCollider(stage1Collider))
        {
            currentScreenUI = stage1UI;
            callAllRanking(1);
            callPersonalRanking(1, userId);
        }
        else if (IsPlayerInCollider(stage2Collider))
        {
            currentScreenUI = stage2UI;
            callAllRanking(2);
            callPersonalRanking(2, userId);
        }

        if (currentScreenUI != null)
        {
            currentScreenUI.SetActive(true); // 해당 자식 UI 활성화
            screenUI.SetActive(true); // Screen UI 전체 활성화
            isScreenUIActive = true;
        }
    }

    private void callAllRanking(int stage)
    {
        // 콜백 함수를 사용하여 랭킹 데이터 받기
        rankingManager.GetRankings(stage,
            rankings => {
                // 성공시: 받은 랭킹 데이터 출력
                Debug.Log("튜토리얼 전체 플레이어 랭킹 데이터 수신 성공");
                Debug.Log($"받은 랭킹 개수: {rankings.Count}");

                foreach (var rank in rankings)
                {
                    Debug.Log($"순위: {rank.ranking}, " +
                            $"닉네임: {rank.nickname}, " +
                            $"점수: {rank.score}, " +
                            $"시간: {rank.createdAt}");
                }
            },
            error => {
                // 실패시: 에러 메시지 출력
                Debug.LogError($"랭킹 데이터 수신 실패: {error}");
            }
        );
    }

    private void callPersonalRanking(int stage, long userId)
    {
        // 콜백 함수를 사용하여 개인 랭킹 데이터 받기
        rankingManager.GetPersonalRanking(stage, userId,
            personalRank => {
                // 성공시: 받은 개인 랭킹 데이터 출력
                Debug.Log("개인 랭킹 데이터 수신 성공");
                Debug.Log($"순위: {personalRank.ranking}, " +
                        $"닉네임: {personalRank.nickname}, " +
                        $"점수: {personalRank.score}, " +
                        $"시간: {personalRank.createdAt}");
            },
            error => {
                // 실패시: 에러 메시지 출력
                Debug.LogError($"개인 랭킹 데이터 수신 실패: {error}");
            }
        );
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
    public void Exit()
    {
        Time.timeScale = 1;
        SceneManager.LoadScene("LobbyMap");
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
    //public void OnExitButtonClicked()
    //{
    //    Debug.Log("Exit button clicked! Returning to main menu.");
    //    Time.timeScale = 1; // 게임 종료 전 시간 복구
    //    SceneManager.LoadScene("MainMenu"); // 메인 메뉴 씬으로 이동 (MainMenu 씬 이름 사용)
    //}

    // **Exit 버튼 기능**
    public void OnExitButtonClicked()
    {
        Debug.Log("Exit button clicked! Exiting game.");
        Time.timeScale = 1; // 게임 종료 전 시간 복구
        Application.Quit(); // 게임 종료
    }


    private bool IsPlayerInCollider(Collider collider)
    {
        // 플레이어가 해당 Collider 영역에 있는지 확인
        return collider.bounds.Contains(GameObject.FindGameObjectWithTag("Player").transform.position);
    }
}
