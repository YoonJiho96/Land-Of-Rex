using UnityEngine;

public class RangeGUIController : MonoBehaviour
{
    public GameObject gui; // 활성화할 GUI
    public int maxShowCount = 3; // GUI가 켜질 수 있는 최대 횟수
    private int currentShowCount = 0; // 현재 GUI가 켜진 횟수
    private bool isPlayerInside = false;

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player") && currentShowCount < maxShowCount)
        {
            isPlayerInside = true;
            gui.SetActive(true); // GUI 활성화
            currentShowCount++; // GUI 켜진 횟수 증가
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            isPlayerInside = false;
            gui.SetActive(false); // GUI 비활성화
        }
    }
}
