using UnityEngine;
using System.Collections;

public class BootCampController : MonoBehaviour
{
    [Header("Building Settings")]
    [SerializeField] public int currentLevel = 1; // 현재 레벨
    [SerializeField] public int maxLevel = 3; // 최대 업그레이드 가능 레벨
    [SerializeField] public float interactionRange = 3f; // 플레이어와의 상호작용 범위

    [Header("Unit Production")]
    [SerializeField] public float spawnInterval = 2f; // 유닛 스폰 시간
    [SerializeField] public Transform spawnPoint; // 스폰 할 위치
    [SerializeField] public GameObject unitPrefab; // 스폰 할 유닛

    [Header("Level Settings")] // 레벨별 최대 유닛 수 설정
    // 레벨별 최대 생산 되는 유닛 수
    // 레벨 1: 4유닛, 레벨 2: 8유닛, 레벨 3: 12유닛
    [SerializeField] public int[] maxUnitsPerLevel = { 4, 8, 12 };


    public int currentUnitCount = 0; // 이 건물이 생산한 현재 유닛 수
    public bool isTraining = false; // 유닛이 생산중인지 나타냄
    public bool playerInRange = false; // 현재 업그레이드 가능한지

    public void Start()
    {
        // static  Action<Transform> 이벤트 구독
        HPController.OnEntityDestroyed += HandleUnitDestroyed;
        StartTraining(); // 시작할 때 자동으로 유닛 생산 시작
    }

    // 건물 업그레이드
    public void Update()
    {
        // 플레이어가 상호작용 범위 내에 있고 E 키를 눌렀을 때 업그레이드
        if (playerInRange && Input.GetKeyDown(KeyCode.E) && currentLevel < maxLevel)
        {
            UpgradeBuilding();
        }
    }

    // 플레이어가 트리거 영역에 들어왔을 때
    public void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            playerInRange = true;
            // UI 표시 등의 추가 작업 가능
        }
    }

    // 플레이어가 트리거 영역에서 나갔을 때
    public void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            playerInRange = false;
            // UI 숨기기 등의 추가 작업 가능
        }
    }

    // 건물 업그레이드
    public void UpgradeBuilding()
    {
        if (currentLevel < maxLevel)
        {
            currentLevel++;
            Debug.Log($"Bootcamp upgraded to level {currentLevel}!");

            // 유닛 생산이 중지되어 있었다면 다시 시작
            if (!isTraining)
            {
                StartTraining();
            }
        }
    }

    // 유닛 생산 시작
    public void StartTraining()
    {
        if (!isTraining)
        {
            isTraining = true;
            StartCoroutine(TrainingCoroutine());
        }
    }

    public IEnumerator TrainingCoroutine()
    {
        while (isTraining)
        {
            // 현재 레벨에서의 최대 유닛 수를 가져옴
            int maxUnits = maxUnitsPerLevel[currentLevel - 1];


            // 현재 유닛 수가 최대 유닛 수보다 적을 때만 생산
            if (currentUnitCount < maxUnits)
            {

                if (unitPrefab == null)
                {
                    Debug.LogError("Unit Prefab is not set!");
                    yield break;
                }

                if (spawnPoint == null)
                {
                    Debug.LogError("Spawn Point is not set!");
                    yield break;
                }

                // 유닛 생성
                GameObject newUnit = Instantiate(unitPrefab, spawnPoint.position, Quaternion.identity);

                if (newUnit == null)
                {
                    Debug.LogError("Failed to instantiate unit!");
                }
                else
                {
                    Debug.Log($"Unit created! Current count: {currentUnitCount + 1}");
                    currentUnitCount++;
                }
            }
            yield return new WaitForSeconds(spawnInterval);
        }
    }

    // 유닛이 파괴될때마다 처리됨
    public void HandleUnitDestroyed(Transform destroyedUnit)
    {
        currentUnitCount--;
        if (!isTraining && currentUnitCount < maxUnitsPerLevel[currentLevel - 1])
        {
            StartTraining();
        }
    }

    public void OnDestroy()
    {
        // static  Action<Transform> 이벤트 구독 해제
        HPController.OnEntityDestroyed -= HandleUnitDestroyed;
        StopAllCoroutines();
    }

    // 기즈모를 통한 시각적 디버깅
    public void OnDrawGizmosSelected()
    {
        // 상호작용 범위 표시 (초록색)
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(transform.position, interactionRange);
    }
}