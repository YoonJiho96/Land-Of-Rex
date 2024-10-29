using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerBuildingCollider : MonoBehaviour
{
    // 입력
    public InputActionAsset inputActions;
    private InputAction interactAction;

    public BuildingController nearestBuilding;
    public bool isInteracting = false; // 상호작용 중인지 확인하는 플래그
    private float interactCooldown = 0.5f; // 상호작용 쿨타임
    private float lastInteractTime = 0f; // 마지막 상호작용 시간 기록

    private void Awake()
    {
        // Input Actions를 가져와서 액션을 초기화
        var playerActions = inputActions.FindActionMap("Player"); // PlayerInputActions는 Input Actions Asset의 이름
        interactAction = playerActions.FindAction("Interact");
    }

    private void OnEnable()
    {
        interactAction.Enable();
    }

    private void OnDisable()
    {
        interactAction.Disable();
    }

    private void Update()
    {
        // 상호작용 입력 처리
        float isInteracted = interactAction.ReadValue<float>();
        if (isInteracted > 0 && Time.time - lastInteractTime > interactCooldown)
        {
            if (nearestBuilding != null && !isInteracting) // 상호작용 중이 아니고 건물이 가까이 있을 때
            {
                isInteracting = true; // 상호작용 시작
                nearestBuilding.CompleteBuilding(); // 건물 설치
                lastInteractTime = Time.time; // 마지막 상호작용 시간 기록

                Invoke(nameof(ResetInteraction), interactCooldown); // 쿨타임 후 상호작용 플래그 초기화
            }
        }
    }

    private void ResetInteraction()
    {
        isInteracting = false; // 상호작용 플래그 초기화
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("BuildingInteraction"))
        {
            BuildingController currentBuilding = other.GetComponent<BuildingController>();
            if (currentBuilding != null)
            {
                // 기존 건물 프리뷰 숨기기
                if (nearestBuilding != null)
                {
                    nearestBuilding.HidePreview();
                }

                // nearestBuilding 업데이트
                nearestBuilding = currentBuilding;
                nearestBuilding.ShowPreview();
            }
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("BuildingInteraction"))
        {
            BuildingController currentBuilding = other.GetComponent<BuildingController>();
            if (currentBuilding != null && nearestBuilding == currentBuilding)
            {
                nearestBuilding.HidePreview();
                nearestBuilding = null; // 최근 건물도 제거
            }
        }
    }

    private void OnTriggerStay(Collider other)
    {
        if (other.CompareTag("BuildingInteraction"))
        {
            BuildingController currentBuilding = other.GetComponent<BuildingController>();
            if (currentBuilding != null)
            {
                // 거리 계산
                float distanceToCurrentBuilding = Vector3.Distance(transform.position, currentBuilding.transform.position);

                // 가장 가까운 건물로 업데이트
                if (nearestBuilding == null || distanceToCurrentBuilding < Vector3.Distance(transform.position, nearestBuilding.transform.position))
                {
                    if (nearestBuilding != null && nearestBuilding != currentBuilding)
                    {
                        nearestBuilding.HidePreview(); // 이전 건물 미리보기를 숨김
                    }

                    nearestBuilding = currentBuilding; // 최근 건물로 업데이트
                    nearestBuilding.ShowPreview(); // 새로운 건물 미리보기 표시
                }
            }
        }
    }
}
