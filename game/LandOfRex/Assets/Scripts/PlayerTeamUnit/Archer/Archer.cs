using UnityEngine;
using UnityEngine.AI;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class Archer : MonoBehaviour
{
    // 궁병 스탯
    [Header("Unit Stats")]
    [SerializeField] public int attackDamage = 20;
    [SerializeField] public float attackRange = 10f;
    [SerializeField] public float attackCooldown = 4f;
    [SerializeField] public float detectionRange = 10f;

    [Header("Movement")]
    [SerializeField] public float moveSpeed = 5f;
    [SerializeField] public float followDistance = 5f;

    // 플레이어와 가까이 있을 때 플레이어가 E 키를 누를 수 있는 범위
    [Header("Input")]
    [SerializeField] public float interactionRange = 3f;

    [Header("Combat Settings")]
    [SerializeField] public float targetUpdateInterval = 0.5f; // 타겟 업데이트 주기
    public GameObject attackPrefeb;

    // Components
    public NavMeshAgent agent; // 궁병의 자동 경로 탐색
    public Animator animator; // 궁병의 움직임, 애니메이션
    public Transform player; // 플레이어 위치 정보. 보병이 플레이어 따라다닐 수 있어야 함.
    public Transform currentTarget; // 현재 어떤 적을 보고 있는가

    // States
    public bool isAttacking = false; // 공격 중인지
    public bool isFollowingPlayer = false; // 플레이어 따라가기 on/off 
    public float lastAttackTime = 0f; // 쿨타임 관리

    // 적 타겟 관리
    private List<EnemyInfo> enemiesInRange = new List<EnemyInfo>();
    public Coroutine targetUpdateCoroutine;

    // 적 정보를 저장하기 위한 구조체
    private struct EnemyInfo
    {
        public Transform transform;
        public float distance;

        public EnemyInfo(Transform transform, float distance)
        {
            this.transform = transform;
            this.distance = distance;
        }
    }

    void Start()
    {
        Debug.Log("start s");
        // 컴포넌트 초기화
        agent = GetComponent<NavMeshAgent>();
        animator = GetComponent<Animator>();
        player = GameObject.FindGameObjectWithTag("Player")?.transform;


        // NavMeshAgent 설정
        if (agent != null)
        {
            agent.speed = moveSpeed;
            agent.stoppingDistance = attackRange;
        }

        StartCoroutine(UpdateTargetRoutine());

        Debug.Log("start e");
    }

    void OnDisable()
    {
        Debug.Log("onDisalbe s");
        // 컴포넌트가 비활성화될 때 코루틴 정지
        if (targetUpdateCoroutine != null)
        {
            StopCoroutine(targetUpdateCoroutine);
            targetUpdateCoroutine = null;
        }
        Debug.Log("onDisalbe e");
    }

    void OnEnable()
    {
        Debug.Log("OnEnable s");
        // 컴포넌트가 활성화될 때 코루틴 시작
        if (targetUpdateCoroutine == null)
        {
            targetUpdateCoroutine = StartCoroutine(UpdateTargetRoutine());
        }
        Debug.Log("OnEnable e");
    }

    public void Update()
    {
        Debug.Log("update s");

        // E키 입력 처리
        if (Input.GetKeyDown(KeyCode.E) && player != null)
        {
            float distanceToPlayer = Vector3.Distance(transform.position, player.position);
            if (distanceToPlayer <= interactionRange)
            {
                SetFollowPlayer(!isFollowingPlayer);
            }
        }

        if (isFollowingPlayer && player != null)
        {
            FollowPlayer();
        }
        else
        {
            HandleCombat();
        }
        Debug.Log("update e");
    }

    public IEnumerator UpdateTargetRoutine()
    {
        Debug.Log("UpdateTargetRoutine s");
        while (true)
        {
            if (!isFollowingPlayer)
            {
                UpdateTargetPriority();
            }
            yield return new WaitForSeconds(targetUpdateInterval);
            Debug.Log("UpdateTargetRoutine e");
        }

    }


    private void UpdateTargetPriority()
    {
        Debug.Log("UpdateTargetPriority s");
        enemiesInRange.Clear();

        // 먼저 공격 범위 내의 적들을 확인
        Collider[] nearbyEnemies = Physics.OverlapSphere(transform.position, attackRange);
        bool foundEnemyInAttackRange = false;

        foreach (Collider collider in nearbyEnemies)
        {
            if (collider.CompareTag("Enemy"))
            {
                float distance = Vector3.Distance(transform.position, collider.transform.position);
                enemiesInRange.Add(new EnemyInfo(collider.transform, distance));
                foundEnemyInAttackRange = true;
            }
        }

        // 공격 범위 내에 적이 없다면 탐지 범위 내의 적들을 확인
        if (!foundEnemyInAttackRange)
        {
            Collider[] detectableEnemies = Physics.OverlapSphere(transform.position, detectionRange);
            foreach (Collider collider in detectableEnemies)
            {
                if (collider.CompareTag("Enemy"))
                {
                    float distance = Vector3.Distance(transform.position, collider.transform.position);
                    enemiesInRange.Add(new EnemyInfo(collider.transform, distance));
                }
            }
        }

        // 거리순으로 정렬
        enemiesInRange = enemiesInRange.OrderBy(e => e.distance).ToList();

        // 현재 타겟 업데이트
        if (enemiesInRange.Count > 0)
        {
            currentTarget = enemiesInRange[0].transform;
        }
        else
        {
            currentTarget = null;
        }
        Debug.Log("UpdateTargetPriority e");
    }

    private void HandleCombat() // 적과의 거리가 일정 수준 이하면 공격함.
    {
        Debug.Log("HandleCombat s");
        if (currentTarget == null) return;

        float distanceToTarget = Vector3.Distance(transform.position, currentTarget.position);

        if (distanceToTarget <= attackRange)
        {

            Debug.Log("HandleCombat attack");
            AttackTarget();
            if (animator != null) animator.SetBool("IsMoving", false);
        }
        else if (distanceToTarget > detectionRange)
        {
            Debug.Log("HandleCombat missing");
            currentTarget = null;
            if (animator != null) animator.SetBool("IsMoving", false);
        }
        else
        {

            Debug.Log("HandleCombat moving");
            // 타겟을 향해 이동
            agent.SetDestination(currentTarget.position);
            if (animator != null) animator.SetBool("IsMoving", true);
        }
        Debug.Log("HandleCombat e");
    }


    public void AttackTarget()
    {
        Debug.Log("AttackTarget s");
        if (Time.time - lastAttackTime >= attackCooldown) // 쿨타임 비교해서 공격
        {
            // 타겟 방향으로 회전
            transform.LookAt(currentTarget);

            // 공격 애니메이션 실행
            if (animator != null) animator.SetTrigger("Attack");
            if (currentTarget != null)
            {
                // 여기서 뭘 던질지 정해야함.
                GameObject attack = Instantiate(attackPrefeb, transform.position, Quaternion.identity);
                attack.GetComponent<AttackController>().Initialize(currentTarget, attackDamage);
            }

            lastAttackTime = Time.time;
        }
        Debug.Log("AttackTarget e");
    }

    public void FollowPlayer()
    {
        Debug.Log("FollowPlayer s");
        if (player == null) return;

        float distanceToPlayer = Vector3.Distance(transform.position, player.position);

        if (distanceToPlayer > followDistance)
        {
            agent.SetDestination(player.position);
            if (animator != null) animator.SetBool("IsMoving", true);
        }
        else
        {
            agent.ResetPath();
            if (animator != null) animator.SetBool("IsMoving", false);
        }
        Debug.Log("FollowPlayer e");
    }

    public void Die()
    {
        Debug.Log("Die s");
        if (animator != null) animator.SetTrigger("Die");

        if (targetUpdateCoroutine != null)
        {
            StopCoroutine(targetUpdateCoroutine);
        }

        // 사망 처리 (애니메이션 완료 후 오브젝트 제거)
        Destroy(gameObject, 2f);

        // 컴포넌트들 비활성화
        enabled = false;
        if (agent != null) agent.enabled = false;
        Debug.Log("Die e");
    }

    public void SetFollowPlayer(bool follow)
    {
        Debug.Log("SetFollowPlayer s");
        isFollowingPlayer = follow;
        if (follow)
        {
            currentTarget = null;
            // 따라가기 시작할 때 효과 추가 가능
            if (animator != null) animator.SetTrigger("StartFollow");
        }
        else
        {
            // 따라가기 중단할 때 효과 추가 가능
            if (animator != null) animator.SetTrigger("StopFollow");
            agent.ResetPath();
        }
        Debug.Log("SetFollowPlayer e");
    }

    // 기즈모를 통한 시각적 디버깅
    public void OnDrawGizmosSelected()
    {
        // 공격 범위 (빨간색)
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, attackRange);

        // 감지 범위 (노란색)
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, detectionRange);

        // 상호작용 범위 (초록색)
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(transform.position, interactionRange);
    }
}
