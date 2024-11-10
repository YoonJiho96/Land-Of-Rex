using UnityEngine;
using System.Collections.Generic;

public class PlayerAttackController : MonoBehaviour
{
    public GameObject playerAttack;
    public Transform attackPoint;
    public Animator animator;
    public float attackInterval = 3f;
    public int playerDamage = 10;

    public PlayerHPController playerHPController;

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
        if (other.CompareTag("Enemy") && !enemiesInRange.Contains(other.transform))
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
        if(playerHPController.isDead)
        {
            return;
        }

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
        animator.SetTrigger("Attack");
        GameObject projectile = Instantiate(playerAttack, attackPoint.position, Quaternion.identity);
        projectile.GetComponent<AttackController>().Initialize(enemy, playerDamage);
    }
}
