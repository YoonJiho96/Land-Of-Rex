using UnityEngine;
using System.Collections.Generic;

public class BuildingAttackController : MonoBehaviour
{
    public GameObject towerAttack;
    public Transform attackPoint;
    public float attackInterval = 3f;
    public int towerDamage = 10;

    private float lastAttackTime = 0f;
    private List<Transform> enemiesInRange = new List<Transform>();

    private void OnEnable()
    {
        HPController.OnEntityDestroyed += RemoveEnemyOrBuilding;
    }

    private void OnDisable()
    {
        HPController.OnEntityDestroyed -= RemoveEnemyOrBuilding;
    }

    private void RemoveEnemyOrBuilding(Transform entity)
    {
        enemiesInRange.Remove(entity); // 적 리스트에서 제거
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Enemy"))
        {
            enemiesInRange.Add(other.transform);
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Enemy"))
        {
            enemiesInRange.Remove(other.transform);
        }
    }

    private void Update()
    {
        if (Time.time >= lastAttackTime + attackInterval)
        {
            Transform closestEnemy = FindClosestEnemy();
            if (closestEnemy != null)
            {
                Attack(closestEnemy);
                lastAttackTime = Time.time;
            }
        }
    }

    private Transform FindClosestEnemy()
    {
        Transform closestEnemy = null;
        float closestDistance = Mathf.Infinity;

        foreach (Transform enemy in enemiesInRange)
        {
            float distance = Vector3.Distance(transform.position, enemy.position);
            if (distance < closestDistance)
            {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;
    }

    private void Attack(Transform enemy)
    {
        GameObject projectile = Instantiate(towerAttack, attackPoint.position, Quaternion.identity);
        projectile.GetComponent<AttackController>().Initialize(enemy, towerDamage);
    }
}
