using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class SpecialUnitSelectionUI : MonoBehaviour
{
    public Button magicianButton;
    public Button knightButton;
    public Button confirmButton;
    public TextMeshProUGUI descriptionText1;
    public TextMeshProUGUI descriptionText2;

    public BootCampController bootCamp;

    private int selectedUnit;

    private void Start()
    {
        // 각 버튼에 클릭 이벤트 등록
        magicianButton.onClick.AddListener(() => OnUnitSelected(0));
        knightButton.onClick.AddListener(() => OnUnitSelected(1));
        confirmButton.onClick.AddListener(OnConfirmSelection);

        // 초기 상태 설정
        OnUnitSelected(0); // 첫 번째 버튼(전사)을 기본 선택으로
    }

    private void OnUnitSelected(int unit)
    {
        selectedUnit = unit;

        // 선택된 유닛에 따라 설명 텍스트 변경
        switch (unit)
        {
            case 0:
                descriptionText1.text = "마법사";
                descriptionText2.text = "강력한 범위마법공격을 사용하는 원거리유닛";
                break;
            case 1:
                descriptionText1.text = "기마병";
                descriptionText2.text = "말을 타고 빠르게 전장에 합류가능한 근접유닛";
                break;
        }

        // 버튼 선택 시각적 효과
        UpdateButtonVisuals();
    }

    private void UpdateButtonVisuals()
    {
        // 모든 버튼을 기본 색상으로 리셋
        magicianButton.GetComponent<Image>().color = Color.white;
        knightButton.GetComponent<Image>().color = Color.white;

        // 선택된 버튼에 강조 색상 적용
        switch (selectedUnit)
        {
            case 0:
                magicianButton.GetComponent<Image>().color = Color.yellow;
                break;
            case 1:
                knightButton.GetComponent<Image>().color = Color.yellow;
                break;
        }
    }

    private void OnConfirmSelection()
    {
        // Debug.Log(selectedUnit + " 유닛이 선택되었습니다.");

        if (bootCamp != null)
        {
            bootCamp.selectedUnit = selectedUnit;
        }

        // 선택된 유닛에 대한 추가 로직을 여기에 작성
        // 예: 게임 상태에 유닛 설정하기
        CloseUI(); // UI를 닫기
    }

    private void CloseUI()
    {
        gameObject.SetActive(false);
    }
}
