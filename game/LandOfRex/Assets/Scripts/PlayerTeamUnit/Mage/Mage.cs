using UnityEngine;
using UnityEngine.AI;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class Mage : MonoBehaviour
{
    // 마법사 스탯
    [Header("Unit Stats")]
    [SerializeField] public int attackDamage = 20;
    [SerializeField] public float attackRange = 25f;
    [SerializeField] public float attackCooldown = 3f;
    [SerializeField] public float detectionRange = 30f;
    [SerializeField] public float areaEffectRadius = 30f; // 범위 공격 반경

    [Header("Movement")]
    [SerializeField] public float moveSpeed = 5f;
    [SerializeField] public float followDistance = 5f;

    // 플레이어와 가까이 있을 때 플레이어가 E 키를 누를 수 있는 범위
    [Header("Input")]
    [SerializeField] public float interactionRange = 3f;

    [Header("Combat Settings")]
    [SerializeField] public float targetUpdateInterval = 0.5f; // 타겟 업데이트 주기
    public GameObject areaAttackPrefab;



    // Components
    public NavMeshAgent agent; // 보병의 자동 경로 탐색
    public Animator animator; // 보병의 움직임, 애니메이션
    public Transform player; // 플레이어 위치 정보. 보병이 플레이어 따라다닐 수 있어야 함.

    private Vector3 targetPosition; // 공격 목표 위치

    // States
    public bool isAttacking = false; // 공격 중인지
    public bool isFollowingPlayer = false; // 플레이어 따라가기 on/off 
    public float lastAttackTime = 0f; // 쿨타임 관리

    private Coroutine targetUpdateCoroutine;


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
            //agent.stoppingDistance = attackRange;
            agent.stoppingDistance = attackRange * 0.8f; // 공격 범위보다 약간 안쪽에서 정지
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
                //UpdateTargetPriority();
                FindBestAttackPosition();
            }
            yield return new WaitForSeconds(targetUpdateInterval);
            Debug.Log("UpdateTargetRoutine e");
        }

    }

    private void FindBestAttackPosition()
    {
        // 공격 범위 내의 모든 적 탐지
        Collider[] nearbyEnemies = Physics.OverlapSphere(transform.position, attackRange);
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

    private void HandleCombat() // 적과의 거리가 일정 수준 이하면 공격함.
    {
        Debug.Log("HandleCombat s");
        
        if (targetPosition == Vector3.zero) return;

        float distanceToTarget = Vector3.Distance(transform.position, targetPosition);

        if (distanceToTarget <= attackRange && Time.time - lastAttackTime >= attackCooldown)
        {
            AttackTarget();
            if (animator != null) animator.SetBool("IsMoving", false);
        }
        else if (distanceToTarget > attackRange && distanceToTarget <= detectionRange)
        {
            agent.SetDestination(targetPosition);
            if (animator != null) animator.SetBool("IsMoving", true);
        }
        Debug.Log("HandleCombat e");
    }


    public void AttackTarget()
    {
        Debug.Log("AttackTarget s");
        transform.LookAt(targetPosition);

        // 공격 애니메이션 실행
        if (animator != null) animator.SetTrigger("Attack");

        // 범위 공격 발사
        GameObject attack = Instantiate(areaAttackPrefab, transform.position, Quaternion.identity);
        attack.GetComponent<AreaAttackController>().Initialize(targetPosition, attackDamage);

        lastAttackTime = Time.time;
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
            targetPosition = Vector3.zero;
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
