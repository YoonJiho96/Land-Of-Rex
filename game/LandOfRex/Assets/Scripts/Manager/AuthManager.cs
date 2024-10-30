using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Collections;
using TMPro;
using UnityEngine.UI;

// 로그인 요청/응답 데이터
[Serializable]
public class LoginRequest
{
    public string email;
    public string password;

    public LoginRequest(string email, string password)
    {
        this.email = email;
        this.password = password;
    }
}

// 회원가입 요청/응답 데이터
[Serializable]
public class SignUpRequest
{
    public string email;
    public string password;
    public string nickname;

    public SignUpRequest(string email, string password, string nickname)
    {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }
}

// 서버 응답 데이터
[Serializable]
public class AuthResponse
{
    public bool success;
    public UserData data;
    public string message;
    public string token;
}

// 사용자 데이터
[Serializable]
public class UserData
{
    public int userId;
    public string email;
    public string nickname;
    public string token;

    // 싱글톤 인스턴스
    private static UserData _instance;
    public static UserData Instance
    {
        get
        {
            if (_instance == null)
                _instance = new UserData();
            return _instance;
        }
    }
}

public class AuthManager : MonoBehaviour
{
    private string baseUrl = "https://your-backend-url.com/api/auth/";

    [Header("UI References")]
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public TMP_InputField nicknameInput;
    public Button loginButton;
    public Button signUpButton;
    public Button logoutButton;
    public Text errorText;

    void Start()
    {
        // 버튼 이벤트 등록
        loginButton?.onClick.AddListener(() => StartCoroutine(Login()));
        signUpButton?.onClick.AddListener(() => StartCoroutine(SignUp()));
        logoutButton?.onClick.AddListener(Logout);

        // 저장된 토큰이 있다면 자동 로그인
        string savedToken = PlayerPrefs.GetString("AuthToken", "");
        if (!string.IsNullOrEmpty(savedToken))
        {
            UserData.Instance.token = savedToken;
            // 토큰 유효성 검증 필요시 추가
        }
    }

    // 로그인
    private IEnumerator Login()
    {
        string email = emailInput.text;
        string password = passwordInput.text;

        // 입력 검증
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            errorText.text = "이메일과 비밀번호를 입력해주세요.";
            yield break;
        }

        LoginRequest loginData = new LoginRequest(email, password);
        string jsonData = JsonUtility.ToJson(loginData);

        using (UnityWebRequest www = new UnityWebRequest(baseUrl + "login", "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                AuthResponse response = JsonUtility.FromJson<AuthResponse>(www.downloadHandler.text);
                if (response.success)
                {
                    // 사용자 데이터와 토큰 저장
                    UserData.Instance.userId = response.data.userId;
                    UserData.Instance.email = response.data.email;
                    UserData.Instance.nickname = response.data.nickname;
                    UserData.Instance.token = response.token;

                    // 토큰 로컬 저장
                    PlayerPrefs.SetString("AuthToken", response.token);
                    PlayerPrefs.Save();

                    // 로그인 성공 처리 (예: 씬 전환)
                    Debug.Log("Login successful!");
                }
                else
                {
                    errorText.text = response.message;
                }
            }
            else
            {
                errorText.text = "로그인 실패: " + www.error;
            }
        }
    }

    // 회원가입
    private IEnumerator SignUp()
    {
        string email = emailInput.text;
        string password = passwordInput.text;
        string nickname = nicknameInput.text;

        // 입력 검증
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(nickname))
        {
            errorText.text = "모든 필드를 입력해주세요.";
            yield break;
        }

        SignUpRequest signUpData = new SignUpRequest(email, password, nickname);
        string jsonData = JsonUtility.ToJson(signUpData);

        using (UnityWebRequest www = new UnityWebRequest(baseUrl + "signup", "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                AuthResponse response = JsonUtility.FromJson<AuthResponse>(www.downloadHandler.text);
                if (response.success)
                {
                    Debug.Log("Sign up successful!");
                    // 회원가입 성공 후 자동 로그인 또는 로그인 화면으로 전환
                    yield return StartCoroutine(Login());
                }
                else
                {
                    errorText.text = response.message;
                }
            }
            else
            {
                errorText.text = "회원가입 실패: " + www.error;
            }
        }
    }

    // 로그아웃
    private void Logout()
    {
        // 토큰 및 사용자 데이터 삭제
        UserData.Instance.token = null;
        UserData.Instance.userId = 0;
        UserData.Instance.email = null;
        UserData.Instance.nickname = null;

        // 저장된 토큰 삭제
        PlayerPrefs.DeleteKey("AuthToken");
        PlayerPrefs.Save();

        // 로그아웃 후 처리 (예: 로그인 화면으로 전환)
        Debug.Log("Logged out successfully!");
    }
}