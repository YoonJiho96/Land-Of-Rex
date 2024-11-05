using System.Collections.Generic;
using UnityEngine;

public class BuildingController : MonoBehaviour
{
    public GameObject nextBuilding;
    public GameObject previewBuilding;
    public GameObject attackRangeObject;

    public Material priviewMaterial;
    public Material CompleteMaterial;

    public Material priviewRangeMaterial;
    public Material CompleteRangeMaterial;

    public void ShowPreview()
    {
        if(attackRangeObject != null)
        {
            attackRangeObject.SetActive(true);
        }

        if (nextBuilding != null)
        {
            previewBuilding = Instantiate(nextBuilding, transform.position, transform.rotation);
            SetMaterial(priviewMaterial, priviewRangeMaterial);
        }
    }

    public void HidePreview()
    {
        if (attackRangeObject != null)
        {
            attackRangeObject.SetActive(false);
        }

        if (previewBuilding != null)
        {
            Destroy(previewBuilding);
        }
    }

    public void CompleteBuilding()
    {
        if (previewBuilding != null)
        {
            SetMaterial(CompleteMaterial, CompleteRangeMaterial);
            SetCollider();

            // 최상위 부모를 찾아서 파괴
            Transform rootParent = GetRootParent(transform);
            Destroy(rootParent.gameObject);
        }
    }

    private void SetMaterial(Material buildingMaterial, Material rangeMaterial)
    {
        Transform body = previewBuilding.transform.Find("Body");
        
        foreach(Transform child in body)
        {
            Renderer renderer = child.GetComponent<Renderer>();
            renderer.material = buildingMaterial;
        }


        Transform attackRange = previewBuilding.transform.Find("AttackRange");
        if(attackRange != null)
        {
            attackRange.gameObject.SetActive(true);
            attackRange.GetComponent<Renderer>().material = rangeMaterial;
        }
    }

    private void SetCollider()
    {
        Transform notTriggerCollider = previewBuilding.transform.Find("Body");
        Collider[] colliders = notTriggerCollider.GetComponents<Collider>();

        foreach(Collider collider in colliders)
        {
            collider.enabled = true;
        }

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
