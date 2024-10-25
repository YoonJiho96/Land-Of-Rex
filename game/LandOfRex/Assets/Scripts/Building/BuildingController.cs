using UnityEngine;

public class BuildingController : MonoBehaviour
{
    public GameObject nextBuilding;
    public GameObject previewBuilding;

    public Material priviewMaterial;
    public Material CompleteMaterial;

    public void ShowPreview()
    {
        if (nextBuilding != null)
        {
            previewBuilding = Instantiate(nextBuilding, transform.position, transform.rotation);
            SetMaterial(priviewMaterial);
        }
    }

    public void HidePreview()
    {
        if (previewBuilding != null)
        {
            Destroy(previewBuilding);
        }
    }

    public void CompleteBuilding()
    {
        SetMaterial(CompleteMaterial);
        SetCollider();

        // 최상위 부모를 찾아서 파괴
        Transform rootParent = GetRootParent(transform);
        Destroy(rootParent.gameObject);
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

    // 루트 부모 찾기 (자기 자신이 루트 오브젝트라면 자기 자신을 반환)
    private Transform GetRootParent(Transform current)
    {
        // 부모가 없다면, 현재 오브젝트가 루트 오브젝트이므로 그 자신을 반환
        while (current.parent != null)
        {
            current = current.parent;
        }
        return current;
    }
}
