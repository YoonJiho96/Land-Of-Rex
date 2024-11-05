using UnityEngine;

public class EnemyAttackController : MonoBehaviour
{
    public EnemyController enemyController;

    private void OnEnable()
    {
        PlayerHPController.OnEntityDestroyed += RemoveUnitOrBuilding;
        HPController.OnEntityDestroyed += RemoveUnitOrBuilding;
    }

    private void OnDisable()
    {
        PlayerHPController.OnEntityDestroyed -= RemoveUnitOrBuilding;
        HPController.OnEntityDestroyed -= RemoveUnitOrBuilding;
    }

    private void RemoveUnitOrBuilding(Transform entity)
    {
        enemyController.RemoveAttackTarget(entity); // 적 리스트에서 제거
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Building") || other.CompareTag("Player") || other.CompareTag("Core") || other.CompareTag("Unit"))
        {
            enemyController.AddAttackTarget(other.transform);
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Building") || other.CompareTag("Player") || other.CompareTag("Core") || other.CompareTag("Unit"))
        {
            RemoveUnitOrBuilding(other.transform);
        }
    }
}
