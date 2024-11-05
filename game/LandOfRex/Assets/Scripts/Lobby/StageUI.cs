using UnityEngine;

public class StageUI: MonoBehaviour
{
    // UI 오브젝트를 드래그해서 연결하세요.
    public GameObject targetUI;

    void Start()
    {
        // 초기 상태로 UI를 숨김
        targetUI.SetActive(false);
    }

    // 트리거 영역에 진입했을 때 호출
    private void OnTriggerEnter(Collider other)
    {
        // 플레이어만 해당 영역에 들어왔을 때 UI 표시
        if (other.CompareTag("Player"))
        {
            targetUI.SetActive(true);
        }
    }

    // 트리거 영역에서 벗어났을 때 호출
    private void OnTriggerExit(Collider other)
    {
        // 플레이어가 영역을 벗어났을 때 UI 숨김
        if (other.CompareTag("Player"))
        {
            targetUI.SetActive(false);
        }
    }
}
