using UnityEngine;
using UnityEngine.AI;
using System.Collections.Generic;

public class EnemyController : MonoBehaviour
{
    public Transform destination; // 최종 목적지

    private NavMeshAgent agent;
    public List<Transform> targets = new List<Transform>();

    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        if (targets.Count > 0)
        {
            // 우선순위가 가장 높은 대상에게 이동
            Transform target = GetHighestPriorityTarget();
            agent.SetDestination(target.position);
        }
        else
        {
            // 리스트가 비어있다면 최종 목적지로 이동
            agent.SetDestination(destination.position);
        }
    }

    public void AddTarget(Transform target)
    {
        targets.Add(target);
    }

    public void RemoveTarget(Transform target)
    {
        targets.Remove(target);
    }

    Transform GetHighestPriorityTarget()
    {
        // 우선순위 기준에 따라 타겟을 선택 (예: 거리)
        Transform highestPriorityTarget = targets[0];
        float closestDistance = Vector3.Distance(transform.position, highestPriorityTarget.position);

        foreach (Transform target in targets)
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
}
