using UnityEngine;

public class ScreenUI : MonoBehaviour
{
    public GameObject tutoUI;
    public GameObject stage1UI;
    public GameObject stage2UI;

    public Collider tutoCollider;
    public Collider stage1Collider;
    public Collider stage2Collider;

    private GameObject currentUI;
    private bool isScreenUIActive = false;

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Return)) // Enter 키
        {
            ShowScreenUI();
        }

        if (Input.GetKeyDown(KeyCode.Escape)) // Esc 키
        {
            HideScreenUI();
        }
    }

    private void ShowScreenUI()
    {
        if (isScreenUIActive)
            return; // 이미 활성화된 경우 다시 실행하지 않음

        // ScreenUI와 영역에 따른 자식 UI 활성화
        gameObject.SetActive(true);
        isScreenUIActive = true;

        if (IsPlayerInCollider(tutoCollider))
        {
            currentUI = tutoUI;
        }
        else if (IsPlayerInCollider(stage1Collider))
        {
            currentUI = stage1UI;
        }
        else if (IsPlayerInCollider(stage2Collider))
        {
            currentUI = stage2UI;
        }

        if (currentUI != null)
        {
            currentUI.SetActive(true);
        }
    }

    private void HideScreenUI()
    {
        if (!isScreenUIActive)
            return; // ScreenUI가 활성화 상태가 아니면 실행하지 않음

        // ScreenUI와 자식 UI 비활성화
        if (currentUI != null)
        {
            currentUI.SetActive(false);
            currentUI = null;
        }

        gameObject.SetActive(false);
        isScreenUIActive = false;
    }

    private bool IsPlayerInCollider(Collider collider)
    {
        // 플레이어가 해당 Collider 영역에 있는지 확인
        return collider.bounds.Contains(GameObject.FindGameObjectWithTag("Player").transform.position);
    }
}
