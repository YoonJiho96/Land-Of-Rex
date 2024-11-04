using UnityEngine;

public class ToggleUI : MonoBehaviour
{
    // UI 오브젝트를 드래그해서 연결하세요.
    public GameObject targetUI;

    void Update()
    {
        // ESC 버튼을 누를 때마다 UI를 토글
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            // targetUI의 활성화 상태를 반전시킴
            targetUI.SetActive(!targetUI.activeSelf);
        }
    }
}
