using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Collections;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using TMPro;  // TextMeshPro를 사용하는 경우
using System.Collections.Generic;

[Serializable]
public class OAuthTokenResponse
{
    public bool success;
    public TokenData data;
    public string message;
}

[Serializable]
public class TokenData
{
    public string access_token;
    public string refresh_token;
    public string token_type;
    public int expires_in;
}

[Serializable]
public class OAuthUserData
{
    public int user_id;
    public string email;
    public string image_url;
    public string nickname;
    public string refresh_token;
    public string social_id;
    public string role;
    public string social_type;
    public string created_at;
    public string updated_at;
}

public class AuthManager : MonoBehaviour
{
    // 싱글톤
    private static AuthManager _instance;
    public static AuthManager Instance
    {
        get
        {
            if (_instance == null)
            {
                // 1. 먼저 씬에서 AuthManager 컴포넌트를 찾아봄
                _instance = FindAnyObjectByType<AuthManager>();
                if (_instance == null)
                {
                    // 2. 새로운 GameObject를 만들고
                    GameObject go = new GameObject("AuthManager");
                    // 3. AuthManager 컴포넌트를 추가
                    _instance = go.AddComponent<AuthManager>();
                    // 4. 씬이 바뀌어도 파괴되지 않도록 설정
                    DontDestroyOnLoad(go);
                }
            }
            return _instance; // 존재하는 인스턴스 반환
        }
    }

    // 백엔드 기본 api 주소
    private string baseUrl = "https://your-backend-url.com/api/";
    private string currentProvider; // "GOOGLE", "KAKAO", "NAVER" 중 하나

    // OAuth 제공자별 클라이언트 ID
    private readonly Dictionary<string, string> clientIds = new Dictionary<string, string>
    {
        { "GOOGLE", "your-google-client-id" },
        { "KAKAO", "your-kakao-client-id" },
        { "NAVER", "your-naver-client-id" }
    };

    private void Awake()
    {
        // 이미 다른 AuthManager가 존재하는가
        if (_instance != null && _instance != this)
        {
            // 중복 인스턴스가 감지되면 현재 게임오브젝트를 파괴
            Destroy(gameObject);
            return;
        }
        _instance = this;
        // 이 게임오브젝트를 씬이 변경되어도 파괴되지 않도록 설정
        DontDestroyOnLoad(gameObject);
    }

    // OAuth 로그인 시작
    public void StartOAuthLogin(string provider)
    {
        // Oauth 제공 하는 곳 ex. 카카오
        currentProvider = provider.ToUpper();
        string clientId = clientIds[currentProvider];

        // 이는 OAuth 인증 완료 후 리다이렉트될 URL
        string redirectUri = $"{baseUrl}auth/{currentProvider.ToLower()}/callback";
        string authUrl = "";

        switch (currentProvider)
        {
            case "GOOGLE":
                authUrl = $"https://accounts.google.com/o/oauth2/v2/auth" +
                         $"?client_id={clientId}" +
                         $"&redirect_uri={UnityWebRequest.EscapeURL(redirectUri)}" +
                         "&response_type=code" +
                         "&scope=email%20profile";
                break;

            case "KAKAO":
                authUrl = $"https://kauth.kakao.com/oauth/authorize" +
                         $"?client_id={clientId}" +
                         $"&redirect_uri={UnityWebRequest.EscapeURL(redirectUri)}" +
                         "&response_type=code";
                break;

            case "NAVER":
                string state = GenerateRandomState();
                PlayerPrefs.SetString("oauth_state", state);
                authUrl = $"https://nid.naver.com/oauth2.0/authorize" +
                         $"?client_id={clientId}" +
                         $"&redirect_uri={UnityWebRequest.EscapeURL(redirectUri)}" +
                         "&response_type=code" +
                         $"&state={state}";
                break;
        }

        Application.OpenURL(authUrl);
        StartCoroutine(WaitForAuthCode());
    }

    private string GenerateRandomState()
    {
        return System.Guid.NewGuid().ToString();
    }

    // Authorization Code 대기
    private IEnumerator WaitForAuthCode()
    {
        // 인증 코드가 없으면 0.5초마다 확인
        while (string.IsNullOrEmpty(UserData.Instance.authCode))
        {
            // 0.5초마다 확인
            yield return new WaitForSeconds(0.5f);
        }

        // 네이버 로그인의 경우 state 값 검증
        if (currentProvider == "NAVER")
        {
            // 저장된 state와 받은 state 비교
            string savedState = PlayerPrefs.GetString("oauth_state");
            string receivedState = UserData.Instance.authState;

            if (savedState != receivedState)
            {
                // CSRF 공격 방지를 위한 검증 실패 처리
                Debug.LogError("OAuth state mismatch - possible CSRF attack");
                UserData.Instance.ClearAuthData();
                yield break;
            }

            PlayerPrefs.DeleteKey("oauth_state");
        }

        // 인증 코드를 받으면 토큰 교환 진행
        StartCoroutine(ExchangeCodeForToken(UserData.Instance.authCode));
        UserData.Instance.ClearAuthData();
    }

    // Authorization Code를 토큰으로 교환
    private IEnumerator ExchangeCodeForToken(string authCode)
    {
        // 토큰 교환 url
        string tokenUrl = $"{baseUrl}auth/{currentProvider.ToLower()}/token";
        WWWForm form = new WWWForm();
        form.AddField("code", authCode);
        form.AddField("grant_type", "authorization_code");

        using (UnityWebRequest www = UnityWebRequest.Post(tokenUrl, form))
        {
            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                OAuthTokenResponse tokenResponse = JsonUtility.FromJson<OAuthTokenResponse>(www.downloadHandler.text);
                if (tokenResponse.success)
                {
                    // 토큰 저장
                    UserData.Instance.SetTokens(
                        tokenResponse.data.access_token,
                        tokenResponse.data.refresh_token
                    );
                    // 사용자 정보 요청 시작
                    StartCoroutine(GetUserInfo());
                }
                else
                {
                    Debug.LogError("Token exchange failed: " + tokenResponse.message);
                }
            }
            else
            {
                Debug.LogError("Token exchange error: " + www.error);
            }
        }
    }

    // 사용자 정보 가져오기
    private IEnumerator GetUserInfo()
    {
        using (UnityWebRequest www = UnityWebRequest.Get($"{baseUrl}auth/user"))
        {
            // Bearer 토큰 인증 헤더 추가
            www.SetRequestHeader("Authorization", "Bearer " + UserData.Instance.accessToken);

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                // 사용자 정보 파싱 및 저장
                OAuthUserData userData = JsonUtility.FromJson<OAuthUserData>(www.downloadHandler.text);

                // UserData 싱글톤에 정보 저장
                UserData.Instance.SetUserInfo(
                    userData.user_id,
                    userData.email,
                    userData.nickname,
                    userData.image_url,
                    userData.social_id,
                    userData.social_type,
                    userData.role
                );

                // 로비 씬으로 이동
                SceneManager.LoadScene("LobbyScene");
            }
            else
            {
                Debug.LogError("Failed to get user info: " + www.error);
            }
        }
    }

    // 토큰 갱신
    public IEnumerator RefreshAuthToken()
    {
        string refreshUrl = $"{baseUrl}auth/refresh";
        WWWForm form = new WWWForm();
        form.AddField("refresh_token", UserData.Instance.refreshToken);
        form.AddField("grant_type", "refresh_token");

        // 토큰 갱신 요청
        using (UnityWebRequest www = UnityWebRequest.Post(refreshUrl, form))
        {
            yield return www.SendWebRequest();

            // 성공시 새 토큰 저장, 실패시 로그아웃
            if (www.result == UnityWebRequest.Result.Success)
            {
                OAuthTokenResponse tokenResponse = JsonUtility.FromJson<OAuthTokenResponse>(www.downloadHandler.text);
                if (tokenResponse.success)
                {
                    UserData.Instance.SetTokens(
                        tokenResponse.data.access_token,
                        tokenResponse.data.refresh_token
                    );
                }
                else
                {
                    Debug.LogError("Token refresh failed: " + tokenResponse.message);
                    StartCoroutine(Logout()); // 토큰 갱신 실패시 로그아웃
                }
            }
            else
            {
                Debug.LogError("Token refresh error: " + www.error);
                StartCoroutine(Logout());
            }
        }
    }

    // 로그아웃
    public IEnumerator Logout()
    {
        if (string.IsNullOrEmpty(UserData.Instance.accessToken))
        {
            yield break;
        }

        using (UnityWebRequest www = UnityWebRequest.PostWwwForm($"{baseUrl}auth/logout", ""))
        {
            www.SetRequestHeader("Authorization", "Bearer " + UserData.Instance.accessToken);

            yield return www.SendWebRequest();

            // 로컬 사용자 데이터 초기화
            UserData.Instance.ClearUserData();

            // 로그인 씬으로 이동
            SceneManager.LoadScene("LoginScene");
        }
    }
}

// UserData 클래스 정의
public class UserData
{
    // 싱글톤 패턴 구현
    private static UserData _instance;
    public static UserData Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new UserData();
            }
            return _instance;
        }
    }

    // OAuth 인증 관련 데이터
    public string authCode { get; private set; }
    public string authState { get; private set; }
    public string accessToken { get; private set; }
    public string refreshToken { get; private set; }

    // 사용자 정보
    public int userId { get; private set; }
    public string email { get; private set; }
    public string nickname { get; private set; }
    public string imageUrl { get; private set; }
    public string socialId { get; private set; }
    public string socialType { get; private set; }
    public string role { get; private set; }

    public void SetAuthCode(string code, string state = null)
    {
        authCode = code;
        authState = state;
    }

    public void SetTokens(string access, string refresh)
    {
        accessToken = access;
        refreshToken = refresh;
    }

    public void SetUserInfo(int id, string email, string nickname, string imageUrl,
                          string socialId, string socialType, string role)
    {
        this.userId = id;
        this.email = email;
        this.nickname = nickname;
        this.imageUrl = imageUrl;
        this.socialId = socialId;
        this.socialType = socialType;
        this.role = role;
    }

    public void ClearAuthData()
    {
        authCode = null;
        authState = null;
    }

    public void ClearUserData()
    {
        accessToken = null;
        refreshToken = null;
        userId = 0;
        email = null;
        nickname = null;
        imageUrl = null;
        socialId = null;
        socialType = null;
        role = null;
        ClearAuthData();
    }
}