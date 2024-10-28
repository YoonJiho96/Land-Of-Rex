using UnityEngine;

public class EnemyDetectController : MonoBehaviour
{
    public EnemyController enemyController;

    private void OnEnable()
    {
        HPController.OnEntityDestroyed += RemoveUnitOrBuilding;
    }

    private void OnDisable()
    {
        HPController.OnEntityDestroyed -= RemoveUnitOrBuilding;
    }

    private void RemoveUnitOrBuilding(Transform entity)
    {
        enemyController.RemoveDetectedTarget(entity); // 적 리스트에서 제거
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Building") || other.CompareTag("Player"))
        {
            enemyController.AddDetectedTarget(other.transform);
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Building") || other.CompareTag("Player"))
        {
            RemoveUnitOrBuilding(other.transform);
        }
    }
}
