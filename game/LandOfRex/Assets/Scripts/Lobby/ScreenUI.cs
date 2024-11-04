using UnityEngine;

public class EnterAreaUIController : MonoBehaviour
{
    // 특정 UI 창을 연결하는 변수
    public GameObject targetUI; // UI 창 (비활성 상태로 시작)

    // 플레이어가 특정 지역에 있는지 여부를 저장하는 변수
    private bool isPlayerInArea = false;

    private void Start()
    {
        // 시작할 때 UI 창을 비활성화
        targetUI.SetActive(false);
    }

    private void Update()
    {
        // 플레이어가 지역 안에 있을 때만 Enter 키로 UI 열기
        if (isPlayerInArea && Input.GetKeyDown(KeyCode.Return)) // Enter 키
        {
            OpenUI();
        }

        // UI가 열린 상태에서 Esc 키로 닫기
        if (targetUI.activeSelf && Input.GetKeyDown(KeyCode.Escape)) // Esc 키
        {
            CloseUI();
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            Debug.Log("Player entered the trigger area");
            isPlayerInArea = true;
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            Debug.Log("Player exited the trigger area");
            isPlayerInArea = false;
        }
    }

    private void OpenUI()
    {
        Debug.Log("UI Opened");
        targetUI.SetActive(true);
    }


    private void CloseUI()
    {
        targetUI.SetActive(false);
    }
}
