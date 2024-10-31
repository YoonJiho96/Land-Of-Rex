using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    // 입력
    public InputActionAsset inputActions;

    // 이동 관련 수치
    public float moveSpeed = 5f;         // 캐릭터 이동 속도
    public float rotationSpeed = 700f;   // 회전 속도
    public float gravity = -9.81f;

    // 이동 관련
    private Vector2 moveInput;            // 입력받은 이동 값
    private InputAction moveAction;      // 이동 액션
    private CharacterController controller;
    private Vector3 velocity;            // 중력 및 이동 속도 벡터
    private bool isGrounded;

    // 배치 관련
    private InputAction arrangeAction;
    public PlayerArrangeController arrangeController;
    public bool isArrange = false;
    private float arrangeCooldown = 0.5f;
    private float lastArrangeTime = 0f;

    private PlayerHPController playerHPController;

    private void Awake()
    {
        controller = GetComponent<CharacterController>();
        playerHPController = GetComponent<PlayerHPController>();

        // Input Actions를 가져와서 액션을 초기화
        var playerActions = inputActions.FindActionMap("Player"); // PlayerInputActions는 Input Actions Asset의 이름
        moveAction = playerActions.FindAction("Move");
        arrangeAction = playerActions.FindAction("Arrange");
    }

    private void OnEnable()
    {
        // 액션 활성화
        moveAction.Enable();
        arrangeAction.Enable();
    }

    private void OnDisable()
    {
        // 액션 비활성화
        moveAction.Disable();
        arrangeAction.Disable();
    }

    private void Update()
    {
        if(playerHPController.isDead)
        {
            isArrange = false;
            arrangeController.finishArrange();
        }

        // 상호작용 입력 처리
        float isArranged = arrangeAction.ReadValue<float>();

        if (!playerHPController.isDead && isArranged > 0 && Time.time - lastArrangeTime > arrangeCooldown)
        {
            if (arrangeController != null)
            {
                if(!isArrange)
                {
                    isArrange = true;
                    arrangeController.startArrange();
                }
                else
                {
                    isArrange = false;
                    arrangeController.finishArrange();
                }

                lastArrangeTime = Time.time;
            }
        }

        // 캐릭터가 땅에 닿았는지 여부 확인
        isGrounded = controller.isGrounded;

        if (isGrounded && velocity.y < 0)
        {
            velocity.y = -2f; // 땅에 닿아 있으면 속도를 리셋해 바닥에 붙도록
        }

        // 입력을 받아서 움직임 처리
        moveInput = moveAction.ReadValue<Vector2>();

        // 이동 방향 계산
        Vector3 moveDirection = new Vector3(moveInput.x, 0f, moveInput.y).normalized;

        Quaternion rotationOffset = Quaternion.Euler(0, 45f, 0);
        moveDirection = rotationOffset * moveDirection;

        // 캐릭터가 움직이고 있을 때
        if (moveDirection.magnitude > 0)
        {
            // CharacterController를 사용하여 이동 처리
            controller.Move(moveDirection * moveSpeed * Time.deltaTime);

            // 이동 방향으로 캐릭터 회전
            Quaternion targetRotation = Quaternion.LookRotation(moveDirection);
            transform.rotation = Quaternion.RotateTowards(transform.rotation, targetRotation, rotationSpeed * Time.deltaTime);
        }

        // 중력 적용
        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}
