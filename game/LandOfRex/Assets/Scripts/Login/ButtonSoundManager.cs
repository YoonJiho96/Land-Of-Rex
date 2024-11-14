using UnityEngine;
using UnityEngine.UI;

public class ButtonSoundManager : MonoBehaviour
{
    public AudioClip buttonClickClip; // 버튼 클릭 소리 클립
    public AudioSource sfxSource; // 효과음 재생용 AudioSource

    void Start()
    {
        Transform canvasTransform = GetComponent<Transform>();
        if (canvasTransform != null)
        {
            AddButtonClickSound(canvasTransform);
        }
    }

    private void AddButtonClickSound(Transform parent)
    {
        // 부모 오브젝트 내 모든 자식 오브젝트를 탐색
        foreach (Transform child in parent)
        {
            // Button 컴포넌트가 있으면 클릭 이벤트에 소리 추가
            Button button = child.GetComponent<Button>();
            if (button != null)
            {
                button.onClick.AddListener(PlayClickSound);
            }

            // 자식 오브젝트가 또 다른 자식들을 가지고 있다면 재귀 호출
            AddButtonClickSound(child);
        }
    }

    private void PlayClickSound()
    {
        if (sfxSource != null && buttonClickClip != null)
        {
            sfxSource.PlayOneShot(buttonClickClip);
        }
    }
}
