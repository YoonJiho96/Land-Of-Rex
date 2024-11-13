using UnityEngine;

public class LoginDataManager : MonoBehaviour
{
    // 싱글톤 인스턴스
    public static LoginDataManager Instance { get; private set; }

    public LoginData LoginData { get; private set; }

    private void Awake()
    {
        // 싱글톤 인스턴스 초기화
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject); // 씬 전환 시 파괴되지 않도록 설정
        }
        else
        {
            Destroy(gameObject); // 중복된 인스턴스가 생성되지 않도록 파괴
        }
    }

    // 로그인 데이터를 설정하는 메서드
    public void SetLoginData(LoginData loginData)
    {
        LoginData = loginData;
    }
}
