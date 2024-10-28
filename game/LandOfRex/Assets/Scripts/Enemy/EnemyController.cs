using UnityEngine;
using UnityEngine.AI;
using System.Collections.Generic;

public class EnemyController : MonoBehaviour
{
    public Transform destination; // 최종 목적지
    public GameObject attackPrefeb;

    private NavMeshAgent agent;

    private Transform detectedTarget;
    public List<Transform> detectedTargets = new List<Transform>();

    public List<Transform> attackTargets = new List<Transform>();

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

        if (detectedTargets.Count > 0)
        {
            // 우선순위가 가장 높은 대상에게 이동
            detectedTarget = GetHighestPriorityTarget();
            agent.SetDestination(detectedTarget.position);
        }
        else
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
        // 우선순위 기준에 따라 타겟을 선택 (예: 거리)
        Transform highestPriorityTarget = detectedTargets[0];
        float closestDistance = Vector3.Distance(transform.position, highestPriorityTarget.position);

        foreach (Transform target in detectedTargets)
        {
            float distance = Vector3.Distance(transform.position, target.position);
            if (distance < closestDistance)
            {
                closestDistance = distance;
                highestPriorityTarget = target;
            }
        }

        return highestPriorityTarget;
    }

    bool checkIsAttacking()
    {
        return attackTargets.Contains(detectedTarget);
    }

    private void Attack(Transform enemy)
    {
        GameObject projectile = Instantiate(attackPrefeb, transform.position, Quaternion.identity);
        projectile.GetComponent<AttackController>().Initialize(enemy, damage);
    }
}
