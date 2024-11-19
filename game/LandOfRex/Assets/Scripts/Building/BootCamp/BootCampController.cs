using UnityEngine;
using System.Collections;
using UnityEngine.InputSystem;

public class BootCampController : MonoBehaviour
{
    [Header("Building Settings")]
    [SerializeField] public int bootcampId = -1;
    [SerializeField] public int lLevel = 1;
    [SerializeField] public int selectedUnit = -1;
    [SerializeField] public float interactionRange = 5f; // 플레이어와의 상호작용 범위
    [SerializeField] public bool isElite = false;

    [Header("Unit Production")]
    [SerializeField] public float spawnInterval = 2f; // 유닛 스폰 시간
    [SerializeField] public Transform spawnPoint; // 스폰 할 위치
    [SerializeField] public GameObject[] unitPrefabs; // 스폰 할 유닛

    [Header("Level Settings")] // 레벨별 최대 유닛 수 설정
    // 레벨별 최대 생산 되는 유닛 수
    [SerializeField] public int maxUnit = 4;

    public bool isTraining = true; // 유닛이 생산중인지 나타냄
    public bool playerInRange = false; // 현재 업그레이드 가능한지

    public InputActionAsset inputAsset;
    private InputAction selectAction;

    public DataManager dataManager;
    public Transform player;
    public bool isSelecting = false;
    private float selectCooldown = 0.5f;
    private float lastSelectTime = 0f;

    private void Awake()
    {
        dataManager = GameObject.Find("DataManager").GetComponent<DataManager>();
        player = GameObject.FindWithTag("Player").transform;

        var playerActions = inputAsset.FindActionMap("Player"); // PlayerInputActions는 Input Actions Asset의 이름
        selectAction = playerActions.FindAction("Select");
    }

    private void OnEnable()
    {
        selectAction.Enable();
    }

    private void OnDisable()
    {
        selectAction.Disable();
    }

    // 건물 업그레이드
    public void Update()
    {
        // 플레이어와의 거리 계산
        if (player != null && !isSelecting && Time.time - lastSelectTime >= selectCooldown)
        {
            float distanceToPlayer = Vector3.Distance(transform.position, player.position);
            playerInRange = distanceToPlayer <= interactionRange;

            PlayerHPController playerHPController = player.GetComponent<PlayerHPController>();

            float inputSelect = selectAction.ReadValue<float>();

            // 플레이어가 상호작용 범위 내에 있고 E 키를 눌렀을 때 업그레이드
            if (!playerHPController.isDead && dataManager.isDay && playerInRange && inputSelect > 0f)
            {
                isSelecting = true;
                StartBootCampUI();
                lastSelectTime = Time.time;
            }
        }

        StartTraining();
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
            int currentUnitCount = dataManager.units[bootcampId].Count;

            // 현재 유닛 수가 최대 유닛 수보다 적을 때만 생산
            if (currentUnitCount < maxUnit)
            {
                if (selectedUnit < 0 || selectedUnit >= unitPrefabs.Length)
                {
                    Debug.LogError("Unit is not selelected!");
                    isTraining = false;
                    yield break;
                }

                if (spawnPoint == null)
                {
                    Debug.LogError("Spawn Point is not set!");
                    isTraining = false;
                    yield break;
                }

                // 유닛 생성
                GameObject newUnit = Instantiate(unitPrefabs[selectedUnit], spawnPoint.position, Quaternion.identity);

                if(newUnit != null)
                {
                    dataManager.units[bootcampId].Add(newUnit.transform);
                }
            }
            yield return new WaitForSeconds(spawnInterval);

            isTraining = false;
        }
    }

    public void StartBootCampUI()
    {
        // Canvas 아래에 있는 Select_Class 오브젝트를 찾기
        GameObject canvas = GameObject.Find("Canvas");
        if (canvas != null)
        {
            Transform selectClassTransform = isElite ? canvas.transform.Find("Select_EliteClass") : canvas.transform.Find("Select_Class");
            if (selectClassTransform != null)
            {
                GameObject selectClassUI = selectClassTransform.gameObject;
                selectClassUI.SetActive(true); // Select_Class UI 활성화

                if(!isElite)
                {
                    selectClassUI.GetComponent<UnitSelectionUI>().bootCamp = this;
                }
                else
                {
                    selectClassUI.GetComponent<SpecialUnitSelectionUI>().bootCamp = this;
                }
            }
            else
            {
                Debug.LogError("Select_Class UI not found under Canvas!");
            }
        }
        else
        {
            Debug.LogError("Canvas object not found in the hierarchy!");
        }
    }


    // 기즈모를 통한 시각적 디버깅
    public void OnDrawGizmosSelected()
    {
        // 상호작용 범위 표시 (빨간색)
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, interactionRange);
    }
}