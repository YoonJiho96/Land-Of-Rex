using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class UnitSelectionUI : MonoBehaviour
{
    public Button warriorButton;
    public Button archerButton;
    public Button spearmanButton;
    public Button confirmButton;
    public TextMeshProUGUI descriptionText1;
    public TextMeshProUGUI descriptionText2;

    private string selectedUnit;

    private void Start()
    {
        // 각 버튼에 클릭 이벤트 등록
        warriorButton.onClick.AddListener(() => OnUnitSelected("Warrior"));
        archerButton.onClick.AddListener(() => OnUnitSelected("Archer"));
        spearmanButton.onClick.AddListener(() => OnUnitSelected("Spearman"));
        confirmButton.onClick.AddListener(OnConfirmSelection);

        // 초기 상태 설정
        OnUnitSelected("Warrior"); // 첫 번째 버튼(전사)을 기본 선택으로
    }

    private void OnUnitSelected(string unit)
    {
        selectedUnit = unit;

        // 선택된 유닛에 따라 설명 텍스트 변경
        switch (unit)
        {
            case "Warrior":
                descriptionText1.text = "전사";
                descriptionText2.text = "준수한 체력과 공격력가진 근접유닛";
                break;
            case "Archer":
                descriptionText1.text = "궁수";
                descriptionText2.text = "공중유닛 공격이 가능한 원거리유닛";
                break;
            case "Spearman":
                descriptionText1.text = "창병";
                descriptionText2.text = "높은 공격력을 가진 근접유닛";
                break;
        }

        // 버튼 선택 시각적 효과
        UpdateButtonVisuals();
    }

    private void UpdateButtonVisuals()
    {
        // 모든 버튼을 기본 색상으로 리셋
        warriorButton.GetComponent<Image>().color = Color.white;
        archerButton.GetComponent<Image>().color = Color.white;
        spearmanButton.GetComponent<Image>().color = Color.white;

        // 선택된 버튼에 강조 색상 적용
        switch (selectedUnit)
        {
            case "Warrior":
                warriorButton.GetComponent<Image>().color = Color.yellow;
                break;
            case "Archer":
                archerButton.GetComponent<Image>().color = Color.yellow;
                break;
            case "Spearman":
                spearmanButton.GetComponent<Image>().color = Color.yellow;
                break;
        }
    }

    private void OnConfirmSelection()
    {
        Debug.Log(selectedUnit + " 유닛이 선택되었습니다.");

        // 선택된 유닛에 대한 추가 로직을 여기에 작성
        // 예: 게임 상태에 유닛 설정하기
        CloseUI(); // UI를 닫기
    }

    private void CloseUI()
    {
        gameObject.SetActive(false);
    }
}
