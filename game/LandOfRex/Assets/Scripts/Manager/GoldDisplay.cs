using UnityEngine;
using TMPro; // TextMeshPro 네임스페이스 추가

public class GoldDisplay : MonoBehaviour
{
    public DataManager dataManager;
    public TextMeshProUGUI goldText; // TextMeshProUGUI 타입으로 수정

    void Update()
    {
        goldText.text = dataManager.gold.ToString();
    }
}
