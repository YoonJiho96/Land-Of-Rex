using UnityEngine;
using UnityEngine.InputSystem;

public class FixedCameraController : MonoBehaviour
{
    public Transform target; // 따라갈 대상 (캐릭터)
    public Vector3 offset; // 캐릭터와의 고정된 위치
    public float fixedY = 10f; // 고정된 Y 값

    // 줌 관련
    public InputActionAsset inputActions;  // Input Actions Asset을 연결할 변수
    private InputAction zoomAction;

    public float zoomSpeed = 2f;           // 줌 속도
    public float minZoom = 10f;             // 줌 최소값
    public float maxZoom = 30f;            // 줌 최대값
    public float zoomDuration = 0.5f;      // 줌 애니메이션이 완료되는 시간

    private bool isZoomingIn = false;      // 줌 상태 (줌 인/줌 아웃 상태를 토글하기 위한 변수)
    private float targetZoom;              // 목표 줌 크기
    private float zoomLerpTime = 0f;       // 줌 애니메이션 시간을 추적하는 변수

    private void Awake()
    {
        // 'Player' 액션 맵을 찾아서 Zoom 액션을 가져옴
        var playerActions = inputActions.FindActionMap("Player");
        zoomAction = playerActions.FindAction("Zoom");
    }

    private void OnEnable()
    {
        // 액션 활성화
        zoomAction.Enable();
        zoomAction.performed += OnZoomToggle;  // 줌 액션이 발생했을 때 토글 메서드 호출
    }

    private void OnDisable()
    {
        // 액션 비활성화 및 이벤트 해제
        zoomAction.performed -= OnZoomToggle;
        zoomAction.Disable();
    }

    private void Start()
    {
        // 시작할 때 현재 카메라의 orthographic size를 타겟 줌으로 설정
        targetZoom = Camera.main.orthographicSize;
    }

    private void Update()
    {
        // 점진적으로 줌이 변경되도록 처리
        if (Camera.main.orthographicSize != targetZoom)
        {
            zoomLerpTime += Time.deltaTime / zoomDuration; // 줌 시간을 계산
            Camera.main.orthographicSize = Mathf.Lerp(Camera.main.orthographicSize, targetZoom, zoomLerpTime);
        }
    }

    private void OnZoomToggle(InputAction.CallbackContext context)
    {
        // Z 키를 누를 때마다 줌 인/아웃 상태를 토글
        isZoomingIn = !isZoomingIn;

        // 줌 인일 경우 최소 줌 크기로, 줌 아웃일 경우 최대 줌 크기로 목표 설정
        targetZoom = isZoomingIn ? minZoom : maxZoom;

        // 줌 애니메이션을 새로 시작하므로 Lerp 시간 초기화
        zoomLerpTime = 0f;
    }

    void LateUpdate()
    {
        // X, Z 값은 캐릭터를 따라가되, Y 값은 캐릭터 높이에 따라 Y 위치 조정
        Vector3 newPosition = new Vector3(
            target.position.x + offset.x,
            target.position.y + fixedY,
            target.position.z + offset.z
        );
        transform.position = newPosition;

        // 기존 카메라의 회전 각도 (X: 45, Y: 45)를 유지
        transform.rotation = Quaternion.Euler(45, 45, 0);
    }
}
