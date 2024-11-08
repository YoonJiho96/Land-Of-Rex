using System.Collections;
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

    void Awake()
    {
        var playerActions = input.FindActionMap("Player");
        nextAction = playerActions.FindAction("NextWave");
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
        float nextInput = nextAction.ReadValue<float>();
        if(dataManager.isDay)
        {
            // 키가 눌린 상태로 일정 시간 지속되면 작업 실행
            if (nextInput > 0)
            {
                holdTime += Time.deltaTime;
                if (holdTime >= requiredHoldTime)
                {
                    dataManager.isDay = !dataManager.isDay;
                    StartCoroutine(RotateForDuration());
                    holdTime = 0f;  // 동작 후 holdTime 초기화
                }
            }
            else
            {
                holdTime = 0f;  // 입력이 중단되면 초기화
            }
        }
        else
        {
            if(isWaveCleared)
            {
                isWaveCleared = false;
                SpawnEnemys();
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

    void SpawnEnemys()
    {
        for(int i=0; i<enemySpawnPoints.Length; i++)
        {
            int[] waveEnemyCounts = {enemyCount[i].slime[currentWave],
                enemyCount[i].wildBoar[currentWave],
                enemyCount[i].gorgon[currentWave],
                enemyCount[i].crow[currentWave],
                enemyCount[i].reaper[currentWave]};

            for(int j=0; j<5; j++)
            {
                for(int k=0; k<waveEnemyCounts[j]; k++)
                {
                    GameObject enemy = Instantiate(enemayPrefabs[j],
                        enemySpawnPoints[i].position,
                        Quaternion.identity);

                    enemy.transform.Find("Body").GetComponent<EnemyController>().destination = destination;
                }
            }
        }
    }
}
