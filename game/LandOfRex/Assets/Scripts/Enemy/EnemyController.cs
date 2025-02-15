using UnityEngine;
using UnityEngine.AI;
using System.Collections.Generic;

public class EnemyController : MonoBehaviour, ObjectController
{
    public Transform destination; // 최종 목적지
    public GameObject attackPrefeb;
    public Transform additionalAttackeffectPosition;
    public GameObject additionalAttackPrefeb;
    public bool isAerial = false;
    public bool isMimic = false;

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

        if(isMimic)
        {
            destination = transform;
        }
    }

    void Update()
    {
        if(checkIsAttacking())
        {
            if (animator != null)
            {
                animator.SetBool("Forward", false);
            }
            if (Time.time >= lastAttackTime + attackInterval)
            {
                if (detectedTarget != null)
                {
                    if (agent != null)
                    {
                        agent.isStopped = true;
                    }
                    Attack(detectedTarget);
                    lastAttackTime = Time.time;
                }
            }
            return;
        }

        if(isMimic && agent != null && agent.remainingDistance < 5f)
        {
            if (animator != null)
            {
                animator.SetBool("Rest", true);
                animator.SetBool("Forward", false);
            }
        }
        else 
        {
            if (agent != null)
            {
                agent.isStopped = false;
            }

            if (animator != null)
            {
                animator.SetBool("Forward", true);
            }

            if (isMimic)
            {
                if (animator != null)
                {
                    animator.SetBool("Rest", false);
                }
            }
        }

        if (detectedTargets.Count > 0)
        {
            // 우선순위가 가장 높은 대상에게 이동
            detectedTarget = GetHighestPriorityTarget();

            if (detectedTarget != null)
            {
                if (agent != null)
                {
                    agent.SetDestination(detectedTarget.position);
                }
            }
            else
            {
                if (agent != null)
                {
                    agent.SetDestination(destination.position);
                }
            }
        }
        else if(agent != null && agent.destination != destination.position)
        {
            // 리스트가 비어있다면 최종 목적지로 이동
            agent.SetDestination(destination.position);
        }
    }

    public void AddDetectedTarget(Transform target)
    {
        if (!detectedTargets.Contains(target))
        {
            detectedTargets.Add(target);
        }
    }

    public void RemoveDetectedTarget(Transform target)
    {
        detectedTargets.Remove(target);
    }

    public void AddAttackTarget(Transform target)
    {
        if (!attackTargets.Contains(target))
        {
            attackTargets.Add(target);
        }
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
        if (animator != null)
        {
            animator.SetTrigger("Attack");
        }
        transform.LookAt(enemy);
        GameObject projectile = Instantiate(attackPrefeb, attackStartPoint.position, Quaternion.identity);
        projectile.GetComponent<AttackController>().Initialize(enemy, damage);

        if(additionalAttackPrefeb != null)
        {
            GameObject additionalEffect = Instantiate(additionalAttackPrefeb, additionalAttackeffectPosition.position, Quaternion.identity);

            Destroy(additionalEffect, 1f);
        }
    }

    public void die()
    {
        throw new System.NotImplementedException();
    }
}
