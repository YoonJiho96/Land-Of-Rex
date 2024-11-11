using System.Collections;
using UnityEngine;
using UnityEngine.AI;

public class GateController : MonoBehaviour
{
    public Transform spawnPoint;

    private void OnTriggerEnter(Collider other)
    {
        if(other.CompareTag("Player"))
        {
            StartCoroutine(movePlayer(GetRootParent(other.transform)));
        }
        else if(other.CompareTag("Unit"))
        {
            Transform unit = GetRootParent(other.transform);
            NavMeshAgent agent = unit.GetComponent<NavMeshAgent>();

            agent.Warp(spawnPoint.position);
        }
    }

    private IEnumerator movePlayer(Transform player)
    {
        player.Find("ArrangeCollider").GetComponent<PlayerArrangeController>().FinishArrange();
        CharacterController controller = player.GetComponent<CharacterController>();

        yield return new WaitForSeconds(0.5f);

        controller.enabled = false;
        player.position = spawnPoint.position;
        controller.enabled = true;
    }

    private Transform GetRootParent(Transform current)
    {
        while (current.parent != null)
        {
            current = current.parent;
        }
        return current;
    }
}
