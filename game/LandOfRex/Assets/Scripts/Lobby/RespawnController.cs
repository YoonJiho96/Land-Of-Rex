using UnityEngine;

public class RespawnController : MonoBehaviour
{
    public Transform spawnPoint;

    private void OnTriggerEnter(Collider other)
    {
        if(other.CompareTag("Player"))
        {
            CharacterController controller = other.GetComponent<CharacterController>();

            if(controller != null)
            {
                controller.enabled = false;
                other.transform.position = spawnPoint.position;
                controller.enabled = true;
            }
        }
    }
}
