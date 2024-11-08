using UnityEngine;

public class DisasterStage1After : MonoBehaviour
{
    public Collider triggerCollider;

    private void Awake()
    {
        triggerCollider = GetComponent<Collider>();
    }

    private void OnEnable()
    {
        CheckAndDamageUnitsInTrigger();
    }

    private void CheckAndDamageUnitsInTrigger()
    {
        Collider[] objectsInTrigger = Physics.OverlapBox(triggerCollider.bounds.center, triggerCollider.bounds.extents, triggerCollider.transform.rotation);

        foreach (Collider col in objectsInTrigger)
        {
            if (col.CompareTag("Unit") || col.CompareTag("Enemy"))
            {
                DealDamageToCollider(col);
            }
        }
    }

    private void DealDamageToCollider(Collider col)
    {
        HPController hpController = col.GetComponent<HPController>();
        if (hpController != null)
        {
            hpController.GetDamage(10000000);
        }
    }
}
