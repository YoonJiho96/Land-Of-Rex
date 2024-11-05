using UnityEngine;
using UnityEngine.AI;
using System.Collections.Generic;

public class EnemyController : MonoBehaviour
{
    public Transform destination; // 최종 목적지
    public GameObject attackPrefeb;
    public bool isAerial = false;

    public Animator animator;

    public Transform attackStartPoint;

    private NavMeshAgent agent;

    public Transform detectedTarget;
    public List<Transform> detectedTargets = new List<Transform>();

    private List<Transform> attackTargets = new List<Transform>();

    public string[] priorityTags = { "Building", "Player" };

    public float attackInterval = 3f;
    public int damage = 10;

    private float lastAttackTime = 0f;

    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        if(checkIsAttacking())
        {
            animator.SetBool("Forward", false);
            if (Time.time >= lastAttackTime + attackInterval)
            {
                if (detectedTarget != null)
                {
                    agent.isStopped = true;
                    Attack(detectedTarget);
                    lastAttackTime = Time.time;
                }
            }
            return;
        }

        agent.isStopped = false;
        animator.SetBool("Forward", true);

        if (detectedTargets.Count > 0)
        {
            // 우선순위가 가장 높은 대상에게 이동
            detectedTarget = GetHighestPriorityTarget();

            if (detectedTarget != null)
            {
                agent.SetDestination(detectedTarget.position);
            }
            else
            {
                agent.SetDestination(destination.position);
            }
        }
        else if(agent.destination != destination.position)
        {
            // 리스트가 비어있다면 최종 목적지로 이동
            agent.SetDestination(destination.position);
        }
    }

    public void AddDetectedTarget(Transform target)
    {
        detectedTargets.Add(target);
    }

    public void RemoveDetectedTarget(Transform target)
    {
        detectedTargets.Remove(target);
    }

    public void AddAttackTarget(Transform target)
    {
        attackTargets.Add(target);
    }

    public void RemoveAttackTarget(Transform target)
    {
        attackTargets.Remove(target);
    }

    Transform GetHighestPriorityTarget()
    {
        Transform highestPriorityTarget = null;
        float closestDistance = float.MaxValue;

        foreach (string tag in priorityTags)
        {
            foreach (Transform target in detectedTargets)
            {
                // 현재 태그와 일치하는 대상 중에서 가장 가까운 대상 찾기
                if (target.CompareTag(tag))
                {
                    float distance = Vector3.Distance(transform.position, target.position);
                    if (distance < closestDistance)
                    {
                        closestDistance = distance;
                        highestPriorityTarget = target;
                    }
                }
            }

            // 우선순위가 가장 높은 태그에서 타겟을 찾으면 반환
            if (highestPriorityTarget != null)
            {
                return highestPriorityTarget;
            }
        }

        // 만약 모든 우선순위에 해당하는 타겟이 없다면 null 반환
        return highestPriorityTarget;
    }

    bool checkIsAttacking()
    {
        return attackTargets.Contains(detectedTarget);
    }

    private void Attack(Transform enemy)
    {
        animator.SetTrigger("Attack");
        transform.LookAt(enemy);
        GameObject projectile = Instantiate(attackPrefeb, attackStartPoint.position, Quaternion.identity);
        projectile.GetComponent<AttackController>().Initialize(enemy, damage);
    }
}
