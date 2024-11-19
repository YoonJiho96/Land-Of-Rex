using System.Collections;
using System.Diagnostics;
using TMPro;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public DataManager dataManager;
    public GameObject sunLight;
    public GameObject dayGUI;  // 낮에 나타나는 GUI
    public GameObject nightGUI; // 밤에 나타나는 GUI
    public TMP_Text waveText; // 웨이브 텍스트 오브젝트 연결
    public InputActionAsset input;
    private InputAction nextAction;

    public Transform destination;
    public int stage;

    private float holdTime = 0f;
    public float requiredHoldTime = 1f;

    public float rotationDuration = 5f;   // 회전 지속 시간
    private float rotationTimeElapsed = 0f;

    public int currentWave = 0;
    public bool isWaveCleared = true;
    public Transform[] enemySpawnPoints;
    public EnemyData[] enemyCount;
    public GameObject[] enemayPrefabs;
    public Transform bossSpawnPoint;
    public GameObject bossPrefab;
    public int maxStage;

    private Stopwatch gameTimer; // 전체 시간을 측정할 Stopwatch
    private float totalElapsedTime; // 측정된 총 시간을 저장할 변수
    public int[] stageGold;

    public GameObject clearUI;
    public GameObject failUI;
    public RankingManager rankingManager;
    public float targetTime;

    void Awake()
    {
        var playerActions = input.FindActionMap("Player");
        nextAction = playerActions.FindAction("NextWave");
        gameTimer = new Stopwatch(); // Stopwatch 초기화
    }

    private void Start()
    {
        gameTimer.Start();
        UpdateGUI(); // 게임 시작 시 GUI 초기화
        UpdateWaveText(); // 시작 시 웨이브 텍스트 업데이트

        // 낮 배경음 재생
        int bgmIndex = 0;
        if (AudioManager.Instance != null)
        {
            AudioManager.Instance.ChangeBGM(bgmIndex);
        }
    }

    private void OnEnable()
    {
        // 액션 활성화
        nextAction.Enable();
    }

    private void OnDisable()
    {
        // 액션 비활성화
        nextAction.Disable();
    }

    // Update is called once per frame
    void Update()
    {
        CheckCastle();

        if (currentWave == maxStage && gameTimer.IsRunning)
        {
            ClearStage();
        }
        else if (dataManager.isDay)
        {
            float nextInput = nextAction.ReadValue<float>();
            // 키가 눌린 상태로 일정 시간 지속되면 작업 실행
            if (nextInput > 0)
            {
                holdTime += Time.deltaTime;
                if (holdTime >= requiredHoldTime)
                {
                    dataManager.isDay = false;
                    StartCoroutine(RotateForDuration());
                    UpdateGUI(); // GUI 업데이트
                    holdTime = 0f;  // 동작 후 holdTime 초기화

                    // 낮 밤 전환
                    if (AudioManager.Instance != null)
                    {
                        AudioManager.Instance.PlaySFX(0);
                        AudioManager.Instance.ChangeBGM(1);
                    }
                }
            }
            else
            {
                holdTime = 0f;  // 입력이 중단되면 초기화
            }
        }
        else if (!dataManager.isDay)
        {
            if (isWaveCleared)
            {
                isWaveCleared = false;
                StartCoroutine(SpawnEnemys());
            }
            else
            {
                if (dataManager.enemys.Count == 0)
                {
                    isWaveCleared = true;
                    dataManager.isDay = true;
                    currentWave++;
                    StartCoroutine(RotateForDuration());
                    StartCoroutine(CheckGold());
                    UpdateGUI(); // GUI 업데이트
                    UpdateWaveText(); // 웨이브 전환 시 업데이트

                    // 낮 밤 전환
                    if (AudioManager.Instance != null)
                    {
                        AudioManager.Instance.PlaySFX(1);
                        AudioManager.Instance.ChangeBGM(0); // 낮 BGM으로 전환
                    }
                }
            }
        }
    }

    private void UpdateGUI()
    {
        // 낮일 때는 dayGUI 활성화, 밤일 때는 nightGUI 활성화
        dayGUI.SetActive(dataManager.isDay);
        nightGUI.SetActive(!dataManager.isDay);
    }

    private void UpdateWaveText()
    {
        int displayedWave = Mathf.Min(currentWave + 1, maxStage);
        waveText.text = $"Wave: {displayedWave} / {maxStage}";
    }


    IEnumerator RotateForDuration()
    {
        rotationTimeElapsed = 0f;

        Quaternion currentRotation = sunLight.transform.rotation;
        Quaternion targetRotation = currentRotation * Quaternion.Euler(180, 0, 0);

        while (rotationTimeElapsed < rotationDuration)
        {
            rotationTimeElapsed += Time.deltaTime;

            // 지정된 시간 동안 점진적으로 회전
            sunLight.transform.rotation = Quaternion.Slerp(currentRotation, targetRotation, rotationTimeElapsed / rotationDuration);

            yield return null;
        }

        sunLight.transform.rotation = targetRotation; // 최종적으로 정확히 180도 회전
    }

    IEnumerator SpawnEnemys()
    {
        for (int i = 0; i < enemySpawnPoints.Length; i++)
        {
            int[] waveEnemyCounts = {enemyCount[i].slime[currentWave],
                enemyCount[i].wildBoar[currentWave],
                enemyCount[i].gorgon[currentWave],
                enemyCount[i].crow[currentWave],
                enemyCount[i].reaper[currentWave]};

            for (int j = 0; j < 5; j++)
            {
                for (int k = 0; k < waveEnemyCounts[j]; k++)
                {
                    GameObject enemy = Instantiate(enemayPrefabs[j],
                        enemySpawnPoints[i].position,
                        Quaternion.identity);

                    enemy.transform.Find("Body").GetComponent<EnemyController>().destination = destination;
                }

                yield return null;
            }
        }

        if (currentWave == 6)
        {
            GameObject boss = Instantiate(bossPrefab,
                bossSpawnPoint.position,
                Quaternion.identity);

            boss.transform.Find("Body").GetComponent<EnemyController>().destination = destination;
        }

        yield return null;
    }

    public IEnumerator CheckGold()
    {
        dataManager.totalGold += stageGold[currentWave - 1];
        dataManager.gold += stageGold[currentWave - 1];

        foreach (Transform building in dataManager.buildings)
        {
            if (building.gameObject.activeInHierarchy)
            {
                HouseData data = building.gameObject.GetComponent<HouseData>();

                if (data != null)
                {
                    dataManager.totalGold += data.gold;
                    dataManager.gold += data.gold;
                }
            }

            building.gameObject.GetComponent<HPController>().ReviveBuilding();
        }

        yield return null;
    }

    private void CheckCastle()
    {
        foreach (Transform building in dataManager.buildings)
        {
            if (building.CompareTag("Core"))
            {
                if (building.gameObject.activeInHierarchy)
                {
                    return;
                }
                else
                {
                    FailStage();
                }
            }
        }
    }

    private void FailStage()
    {
        failUI.SetActive(true);
    }

    private void ClearStage()
    {
        gameTimer.Stop(); // 스테이지 클리어 시 타이머 정지
        totalElapsedTime = (float)gameTimer.Elapsed.TotalSeconds; // 시간을 초 단위로 저장
        int totalGold = dataManager.totalGold;
        int usedGold = dataManager.usedGold;
        int deadCount = dataManager.playerDeadCount;

        UnityEngine.Debug.Log($"Clear!! {totalElapsedTime}초");

        float score = 3000 * (totalGold / usedGold)
            + 5000 * (deadCount == 0 ? 1 : 1 / (deadCount + 1))
            + 400 * (targetTime / totalElapsedTime);

        if(LoginDataManager.Instance.LoginData.highestStage < stage)
        {
            LoginDataManager.Instance.LoginData.highestStage = stage;
        }

        rankingManager.SubmitScore(totalElapsedTime, LoginDataManager.Instance.LoginData.userId, totalGold, usedGold, deadCount, (int) score, stage);
        
        clearUI.SetActive(true);

        clearUI.transform.Find("Score").GetComponent<TextMeshProUGUI>().text = ((int) score).ToString();
    }

    public float GetTotalElapsedTime()
    {
        return totalElapsedTime; // 다른 스크립트에서 호출하여 경과 시간을 가져올 수 있음
    }
}
