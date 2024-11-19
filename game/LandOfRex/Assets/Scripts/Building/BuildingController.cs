using System.Collections.Generic;
using TMPro;
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

    public GameObject buildingInfoUI; // GUI 오브젝트 참조

    public DataManager dataManager;

    private void Awake()
    {
        dataManager = GameObject.Find("DataManager").GetComponent<DataManager>();
        GameObject canvas = GameObject.Find("Canvas");
        buildingInfoUI = canvas.transform.Find("BuildingInfo").gameObject;
    }

    public void ShowPreview()
    {
        if (attackRangeObject != null)
        {
            attackRangeObject.SetActive(true);
        }

        if (nextBuilding != null)
        {
            previewBuilding = Instantiate(nextBuilding, transform.position, transform.rotation);
            SetMaterial(priviewMaterial, priviewRangeMaterial);
        }

        // 건물 정보 UI 활성화
        if (buildingInfoUI != null)
        {
            buildingInfoUI.SetActive(true);
            SetUIText();
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

        // 건물 정보 UI 비활성화
        if (buildingInfoUI != null)
        {
            buildingInfoUI.SetActive(false);
        }
    }

    private void SetUIText()
    {
        BuildingInfo preInfo = GetRootParent(transform).GetComponent<BuildingInfo>();

        buildingInfoUI.transform.Find("Level Text").GetComponent<TextMeshProUGUI>().text = preInfo.level;
        buildingInfoUI.transform.Find("Health Text").GetComponent<TextMeshProUGUI>().text = preInfo.health;
        buildingInfoUI.transform.Find("Special Text").GetComponent<TextMeshProUGUI>().text = preInfo.special;

        if (previewBuilding != null)
        {
            BuildingInfo nextInfo = previewBuilding.GetComponent<BuildingInfo>();

            buildingInfoUI.transform.Find("BuildingNameText").GetComponent<TextMeshProUGUI>().text = nextInfo.buildingName;
            buildingInfoUI.transform.Find("RangeText").GetComponent<TextMeshProUGUI>().text = nextInfo.comment;
            buildingInfoUI.transform.Find("Level Text Next").GetComponent<TextMeshProUGUI>().text = nextInfo.level;
            buildingInfoUI.transform.Find("Health Text Next").GetComponent<TextMeshProUGUI>().text = nextInfo.health;
            buildingInfoUI.transform.Find("Special Text Next").GetComponent<TextMeshProUGUI>().text = nextInfo.special;

            if(preInfo.special == "" && nextInfo.special != "")
            {
                buildingInfoUI.transform.Find("Special Text").GetComponent<TextMeshProUGUI>().text = nextInfo.special.Split("\\n")[0] + "\n-";
            }

            buildingInfoUI.transform.Find("Button_Rectangle_01_Convex_Yellow").Find("Text").GetComponent<TextMeshProUGUI>().text = "[업그레이드]\n" + GetNeedGold() + "골드 (F)";
        }
        else
        {
            buildingInfoUI.transform.Find("BuildingNameText").GetComponent<TextMeshProUGUI>().text = preInfo.buildingName;
            buildingInfoUI.transform.Find("RangeText").GetComponent<TextMeshProUGUI>().text = preInfo.comment;
            buildingInfoUI.transform.Find("Level Text Next").GetComponent<TextMeshProUGUI>().text = "";
            buildingInfoUI.transform.Find("Health Text Next").GetComponent<TextMeshProUGUI>().text = "";
            buildingInfoUI.transform.Find("Special Text Next").GetComponent<TextMeshProUGUI>().text = "";

            buildingInfoUI.transform.Find("Button_Rectangle_01_Convex_Yellow").Find("Text").GetComponent<TextMeshProUGUI>().text = "최대 레벨";
        }
    }

    public int GetNeedGold()
    {
        HouseData houseData = previewBuilding.GetComponent<HouseData>();

        if(houseData != null)
        {
            return houseData.gold;
        }

        return 10000;
    }

    public void CompleteBuilding()
    {
        if (previewBuilding != null)
        {
            SetMaterial(CompleteMaterial, CompleteRangeMaterial);
            SetCollider();

            BootCampController nextBootCamp = previewBuilding.transform.Find("Completed").GetComponent<BootCampController>();

            if (nextBootCamp != null)
            {
                int bootCampId;
                int selectedUnit = -1;

                Transform completed = GetRootParent(transform).Find("Completed");
                if (completed != null)
                {
                    bootCampId = completed.GetComponent<BootCampController>().bootcampId;
                    selectedUnit = completed.GetComponent<BootCampController>().selectedUnit;
                }
                else
                {
                    bootCampId = dataManager.units.Count;
                }

                nextBootCamp.bootcampId = bootCampId;
                nextBootCamp.selectedUnit = selectedUnit;

                if (!dataManager.units.ContainsKey(bootCampId))
                {
                    dataManager.units[bootCampId] = new List<Transform>();
                }

                nextBootCamp.isTraining = false;

                if(selectedUnit < 0)
                {
                    nextBootCamp.StartBootCampUI();
                }
            }

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
