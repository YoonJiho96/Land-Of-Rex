using System.Collections;
using System.Diagnostics;
using UnityEngine;
using UnityEngine.InputSystem;

public class GameManager : MonoBehaviour
{
    public DataManager dataManager;
    public GameObject sunLight;
    public InputActionAsset input;
    private InputAction nextAction;

    public Transform destination;

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

    void Awake()
    {
        var playerActions = input.FindActionMap("Player");
        nextAction = playerActions.FindAction("NextWave");
        gameTimer = new Stopwatch(); // Stopwatch 초기화
    }

    private void Start()
    {
        gameTimer.Start();
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
        else if(dataManager.isDay)
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
                    holdTime = 0f;  // 동작 후 holdTime 초기화
                }
            }
            else
            {
                holdTime = 0f;  // 입력이 중단되면 초기화
            }
        }
        else if(!dataManager.isDay)
        {
            if(isWaveCleared)
            {
                isWaveCleared = false;
                StartCoroutine(SpawnEnemys());
            }
            else
            {
                if(dataManager.enemys.Count == 0)
                {
                    isWaveCleared = true;
                    dataManager.isDay = true;
                    currentWave++;
                    StartCoroutine(RotateForDuration());
                    StartCoroutine(CheckGold());
                }
            }
        }
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
        for(int i=0; i<enemySpawnPoints.Length; i++)
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

        foreach(Transform building in dataManager.buildings)
        {
            if(building.gameObject.activeInHierarchy)
            {
                HouseData data = building.gameObject.GetComponent<HouseData>();

                if(data != null)
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
        foreach(Transform building in dataManager.buildings)
        {
            if(building.CompareTag("Core"))
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
        UnityEngine.Debug.Log("Failed...");
    }

    private void ClearStage()
    {
        gameTimer.Stop(); // 스테이지 클리어 시 타이머 정지
        totalElapsedTime = (float)gameTimer.Elapsed.TotalSeconds; // 시간을 초 단위로 저장

        UnityEngine.Debug.Log($"Clear!! {totalElapsedTime}초");
    }

    public float GetTotalElapsedTime()
    {
        return totalElapsedTime; // 다른 스크립트에서 호출하여 경과 시간을 가져올 수 있음
    }
}
