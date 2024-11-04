using UnityEngine;
using UnityEngine.AI;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class UnitController : MonoBehaviour
{
    // 스탯
    [Header("Unit Stats")]
    [SerializeField] public int attackDamage;
    [SerializeField] public float attackRange;
    [SerializeField] public float attackCooldown;
    [SerializeField] public float detectionRange;
    [SerializeField] public float areaEffectRadius;

    [Header("Movement")]
    [SerializeField] public float moveSpeed;
    [SerializeField] public float followDistance;

    [Header("Combat Settings")]
    [SerializeField] public float targetUpdateInterval = 0.5f; // 타겟 업데이트 주기
    public GameObject attackPrefeb;
    public bool canAttackAerial;
    public bool isMage;

    // Components
    public NavMeshAgent agent; // 자동 경로 탐색
    public Animator animator; // 움직임, 애니메이션
    public Transform player; // 플레이어 위치 정보. 플레이어 따라다닐 수 있어야 함.
    public Vector3 lastPosition;
    public Transform currentTarget; // 현재 어떤 적을 보고 있는가
    private Vector3 targetPosition; // 마법사일때 사용하는 공격 목표 위치

    // States
    public bool isAttacking = false; // 공격 중인지
    public bool isFollowingPlayerTotal = false; // 플레이어 따라가기 on/off 
    public bool isFollowingPlayerSub = false;
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
        // 컴포넌트 초기화
        agent = GetComponent<NavMeshAgent>();
        animator = GetComponent<Animator>();
        player = GameObject.FindGameObjectWithTag("Player")?.transform;


        // NavMeshAgent 설정
        if (agent != null)
        {
            agent.speed = moveSpeed;
            agent.stoppingDistance = attackRange;
            
            if(isMage)
            {
                agent.stoppingDistance *= 0.8f;
            }
        }

        StartCoroutine(UpdateTargetRoutine());
    }

    void OnDisable()
    {
        // 컴포넌트가 비활성화될 때 코루틴 정지
        if (targetUpdateCoroutine != null)
        {
            StopCoroutine(targetUpdateCoroutine);
            targetUpdateCoroutine = null;
        }
    }

    void OnEnable()
    {
        // 컴포넌트가 활성화될 때 코루틴 시작
        if (targetUpdateCoroutine == null)
        {
            targetUpdateCoroutine = StartCoroutine(UpdateTargetRoutine());
        }
    }

    public void Update()
    {
        if (isFollowingPlayerTotal && player != null)
        {
            FollowPlayer();
        }
        else
        {
            HandleCombat();
        }
    }

    public IEnumerator UpdateTargetRoutine()
    {
        while (true)
        {
            if (!isFollowingPlayerTotal)
            {
                if (!isMage)
                {
                    UpdateTargetPriority();
                }
                else
                {
                    FindBestAttackPosition();
                }
            }
            yield return new WaitForSeconds(targetUpdateInterval);
        }
    }

    private void FindBestAttackPosition()
    {
        // 공격 범위 내의 모든 적 탐지
        Collider[] nearbyEnemies = Physics.OverlapSphere(transform.position, detectionRange);
        List<Transform> enemies = new List<Transform>();

        foreach (Collider collider in nearbyEnemies)
        {
            if (collider.CompareTag("Enemy"))
            {
                enemies.Add(collider.transform);
            }
        }

        if (enemies.Count == 0)
        {
            targetPosition = Vector3.zero;
            return;
        }

        // 가장 많은 적을 포함하는 위치 찾기
        Vector3 bestPosition = Vector3.zero;
        int maxEnemiesHit = 0;

        foreach (Transform enemy in enemies)
        {
            int enemiesInRange = 0;
            foreach (Transform otherEnemy in enemies)
            {
                if (Vector3.Distance(enemy.position, otherEnemy.position) <= areaEffectRadius)
                {
                    enemiesInRange++;
                }
            }

            if (enemiesInRange > maxEnemiesHit)
            {
                maxEnemiesHit = enemiesInRange;
                bestPosition = enemy.position;
            }
        }

        if (maxEnemiesHit > 0)
        {
            targetPosition = bestPosition;
        }
    }

    private void UpdateTargetPriority()
    {
        enemiesInRange.Clear();

        // 먼저 공격 범위 내의 적들을 확인
        Collider[] nearbyEnemies = Physics.OverlapSphere(transform.position, attackRange);
        bool foundEnemyInAttackRange = false;

        foreach (Collider collider in nearbyEnemies)
        {
            if (collider.CompareTag("Enemy"))
            {
                    EnemyController enemyController = collider.GetComponent<EnemyController>();

                    if ((enemyController != null && (!enemyController.isAerial && !canAttackAerial)) || canAttackAerial)
                    {
                        float distance = Vector3.Distance(transform.position, collider.transform.position);
                        enemiesInRange.Add(new EnemyInfo(collider.transform, distance));
                        foundEnemyInAttackRange = true;
                    }
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
                    EnemyController enemyController = collider.GetComponent<EnemyController>();

                    if ((enemyController != null && (!enemyController.isAerial && !canAttackAerial)) || canAttackAerial)
                    {
                        float distance = Vector3.Distance(transform.position, collider.transform.position);
                        enemiesInRange.Add(new EnemyInfo(collider.transform, distance));
                    }
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
    }

    private void HandleCombat() // 적과의 거리가 일정 수준 이하면 공격함.
    {
        if (!isMage && currentTarget == null) return;

        if (isMage && targetPosition == Vector3.zero) return;

        float distanceToTarget = isMage ? 
            Vector3.Distance(transform.position, targetPosition) : 
            Vector3.Distance(transform.position, currentTarget.position);

        if (distanceToTarget <= attackRange)
        {
            AttackTarget();
            if (animator != null) animator.SetBool("IsMoving", false);
        }
        else if (distanceToTarget > detectionRange)
        {
            currentTarget = null;
            targetPosition = Vector3.zero;
            if (animator != null) animator.SetBool("IsMoving", false);
        }
        else
        {
            // 타겟을 향해 이동
            if (!isMage)
            {
                agent.SetDestination(currentTarget.position);
            }
            else
            {
                agent.SetDestination(targetPosition);
            }
            if (animator != null) animator.SetBool("IsMoving", true);
        }
    }

    public void AttackTarget()
    {
        if (Time.time - lastAttackTime >= attackCooldown) // 쿨타임 비교해서 공격
        {
            // 타겟 방향으로 회전
            transform.LookAt(currentTarget);

            // 공격 애니메이션 실행
            if (animator != null) animator.SetTrigger("Attack");
            if (!isMage && currentTarget != null)
            {
                EnemyController enemyController = currentTarget.GetComponent<EnemyController>();

                if ((enemyController != null && (!enemyController.isAerial && !canAttackAerial)) || canAttackAerial)
                {
                    // 여기서 뭘 던질지 정해야함.
                    GameObject attack = Instantiate(attackPrefeb, transform.position, Quaternion.identity);
                    attack.GetComponent<AttackController>().Initialize(currentTarget, attackDamage);
                }
            }
            else if(isMage)
            {
                GameObject attack = Instantiate(attackPrefeb, transform.position, Quaternion.identity);
                attack.GetComponent<AreaAttackController>().Initialize(targetPosition, attackDamage);
            }

            lastAttackTime = Time.time;
        }
    }

    public void FollowPlayer()
    {
        if (player == null) return;

        Vector3 destination = player.position;

        if(!isFollowingPlayerSub)
        {
            destination = lastPosition;
        }

        float distanceToPlayer = Vector3.Distance(transform.position, destination);

        if (distanceToPlayer > followDistance)
        {
            agent.SetDestination(destination);
            if (animator != null) animator.SetBool("IsMoving", true);
        }
        else
        {
            if(!isFollowingPlayerSub)
            {
                isFollowingPlayerTotal = false;

                agent.stoppingDistance = attackRange;
                if (isMage)
                {
                    agent.stoppingDistance *= 0.8f;
                }

                agent.speed = moveSpeed;

                // 따라가기 중단할 때 효과 추가 가능
                if (animator != null) animator.SetTrigger("StopFollow");
                agent.ResetPath();
            }
        }
    }

    public void Die()
    {
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
    }

    public void SetFollowPlayer(bool follow)
    {
        isFollowingPlayerSub = follow;

        if (follow)
        {
            isFollowingPlayerTotal = follow;
            agent.stoppingDistance = followDistance;
            agent.speed = 20f;

            currentTarget = null;
            targetPosition = Vector3.zero;
            // 따라가기 시작할 때 효과 추가 가능
            if (animator != null) animator.SetTrigger("StartFollow");
        }
        else
        {
            lastPosition = player.position;
        }
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
    }
}
