using UnityEngine;

public class BuildingController : MonoBehaviour
{
    public GameObject nextBuilding;
    public GameObject previewBuilding;

    public Material priviewMaterial;
    public Material CompleteMaterial;

    public void ShowPreview()
    {
        previewBuilding = Instantiate(nextBuilding, transform.position, transform.rotation);
        SetMaterial(priviewMaterial);
    }

    public void HidePreview()
    {
        if(previewBuilding != null)
        {
            Destroy(previewBuilding);
        }
    }

    public void CompleteBuilding()
    {
        previewBuilding = Instantiate(nextBuilding, transform.position, transform.rotation);
        SetMaterial(CompleteMaterial);
        SetCollider();

        Destroy(this);
    }

    private void SetMaterial(Material material)
    {
        Renderer renderer = previewBuilding.transform.Find("Body").GetComponent<Renderer>();

        renderer.material = material;
    }

    private void SetCollider()
    {
        Transform notTriggerCollider = previewBuilding.transform.Find("Body");

        notTriggerCollider.GetComponent<Collider>().enabled = true;

        Transform triggerCollider = previewBuilding.transform.Find("Completed");

        triggerCollider.gameObject.SetActive(true);
    }
}
