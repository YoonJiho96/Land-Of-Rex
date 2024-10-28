using UnityEngine;

public class EnemyDetectController : MonoBehaviour
{
    public EnemyController enemyController;

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
        enemyController.RemoveTarget(entity); // 적 리스트에서 제거
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Building") || other.CompareTag("Player"))
        {
            enemyController.AddTarget(other.transform);
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Building") || other.CompareTag("Player"))
        {
            RemoveEnemyOrBuilding(other.transform);
        }
    }
}
