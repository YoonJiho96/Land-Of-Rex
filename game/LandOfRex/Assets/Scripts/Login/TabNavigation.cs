using UnityEngine;
using TMPro;
using UnityEngine.EventSystems;

public class TabNavigation : MonoBehaviour
{
    public TMP_InputField[] inputFields; // TMP InputField 배열로 관리
    private int currentIndex = 0;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Tab))
        {
            // 현재 포커스된 InputField 가져오기
            GameObject currentSelected = EventSystem.current.currentSelectedGameObject;

            // 현재 포커스된 InputField가 배열에 포함되어 있는지 확인
            for (int i = 0; i < inputFields.Length; i++)
            {
                if (currentSelected == inputFields[i].gameObject)
                {
                    currentIndex = i;
                    break;
                }
            }

            // Shift 키를 눌렀는지 확인 (반대 방향 이동)
            if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift))
            {
                currentIndex--;
                if (currentIndex < 0)
                {
                    currentIndex = inputFields.Length - 1; // 마지막 필드로 이동
                }
            }
            else
            {
                currentIndex++;
                if (currentIndex >= inputFields.Length)
                {
                    currentIndex = 0; // 첫 번째 필드로 이동
                }
            }

            // 다음 InputField로 포커스 이동
            inputFields[currentIndex].Select();
        }
    }
}
