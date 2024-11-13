//using UnityEngine;
//using UnityEngine.UI;

//public class BuildingUIController : MonoBehaviour
//{
//    public GameObject buildingUI;
//    public Text buildingNameText;
//    public Text healthText;
//    public Text attackPowerText;
//    public Text rangeText;
//    public Text specialEffectText;

//    private void OnTriggerEnter(Collider other)
//    {
//        BuildingInfo buildingInfo = other.GetComponent<BuildingInfo>();
//        if (buildingInfo != null)
//        {
//            buildingUI.SetActive(true);

//            // 이름
//            buildingNameText.text = buildingInfo.buildingName;

//            // 체력
//            healthText.text = $"체력: {buildingInfo.health}";

//            // 공격력: 0이 아닌 경우에만 표시
//            if (buildingInfo.attackPower > 0)
//                attackPowerText.text = $"공격력: {buildingInfo.attackPower}";
//            else
//                attackPowerText.text = ""; // 공격력 미표시

//            // 사거리: 0.0f가 아닌 경우에만 표시
//            if (buildingInfo.range > 0)
//                rangeText.text = $"사거리: {buildingInfo.range}";
//            else
//                rangeText.text = ""; // 사거리 미표시

//            // 특수 효과: 빈 문자열이 아닌 경우에만 표시
//            if (!string.IsNullOrEmpty(buildingInfo.specialEffect))
//                specialEffectText.text = $"특수 효과: {buildingInfo.specialEffect}";
//            else
//                specialEffectText.text = ""; // 특수 효과 미표시
//        }
//    }

//    private void OnTriggerExit(Collider other)
//    {
//        if (other.GetComponent<BuildingInfo>() != null)
//        {
//            buildingUI.SetActive(false);
//        }
//    }
//}
