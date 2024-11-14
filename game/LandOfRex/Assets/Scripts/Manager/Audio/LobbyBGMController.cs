using UnityEngine;

public class LobbyBGMController : MonoBehaviour
{
    void Start()
    {
        // 로비 배경음 전환
        if (AudioManager.Instance != null)
        {
            if (AudioManager.Instance.bgmSource.clip != AudioManager.Instance.defaultBGM)
            {
                AudioManager.Instance.PlayDefaultBGM();
            }
        }
    }
}
