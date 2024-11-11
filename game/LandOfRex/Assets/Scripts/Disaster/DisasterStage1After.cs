using UnityEngine;
using System.Collections.Generic;

public class DisasterStage1After : MonoBehaviour
{
    private HashSet<Collider> processedColliders = new HashSet<Collider>();

    private void OnEnable()
    {
        // 활성화 시점에서 초기화하여 OnTriggerStay에서 이벤트가 발생하도록 함
        processedColliders.Clear();
    }

    private void OnTriggerEnter(Collider other)
    {
        if (!processedColliders.Contains(other))
        {
            if (other.CompareTag("Unit") || other.CompareTag("Enemy"))
            {
                other.GetComponent<HPController>().GetDamage(150);
                processedColliders.Add(other);
            }
            else if(other.CompareTag("Player"))
            {
                other.GetComponent<PlayerHPController>().GetDamage(150);
                processedColliders.Add(other);
            }
        }
    }

    private void OnTriggerStay(Collider other)
    {
        if (!processedColliders.Contains(other))
        {
            if (other.CompareTag("Unit") || other.CompareTag("Enemy"))
            {
                other.GetComponent<HPController>().GetDamage(150);
                processedColliders.Add(other);
            }
            else if (other.CompareTag("Player"))
            {
                other.GetComponent<PlayerHPController>().GetDamage(150);
                processedColliders.Add(other);
            }
        }
    }
}
