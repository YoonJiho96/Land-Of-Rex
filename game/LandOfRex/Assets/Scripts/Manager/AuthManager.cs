using UnityEngine;
using UnityEngine.UI;
using System;
using System.Text;
using UnityEngine.Networking;
using System.Collections;

// 사용자 요청 모델
[Serializable]
public class SignUpRequest
{
    public string userId;
    public string nickname;
    public string password;
}

[Serializable]
public class LoginRequest
{
    public string userId;
    public string password;
}

// API 응답 모델
// 백엔드에서 넘어오는 response 
[Serializable]
public class ErrorResponse
{
    public string code;
    public string message;
    public string timestamp;
}

public class AuthManager : MonoBehaviour
{
    [SerializeField] private InputField signUpUserIdInput;
    [SerializeField] private InputField signUpNicknameInput;
    [SerializeField] private InputField signUpPasswordInput;
    [SerializeField] private InputField loginUserIdInput;
    [SerializeField] private InputField loginPasswordInput;

    // 에러 메시지를 표시할 UI Text 컴포넌트
    [SerializeField] private Text signUpErrorText;
    [SerializeField] private Text loginErrorText;

    private const string BASE_URL = "https://k11e102.p.ssafy.io";
    private const string SIGNUP_ENDPOINT = "/api/v1/auth/signup";
    private const string LOGIN_ENDPOINT = "/api/v1/auth/login";

    public void HandleSignUp()
    {
        // 입력값 검증
        if (string.IsNullOrEmpty(signUpUserIdInput.text) ||
            string.IsNullOrEmpty(signUpNicknameInput.text) ||
            string.IsNullOrEmpty(signUpPasswordInput.text))
        {
            ShowSignUpError("모든 필드를 입력해주세요.");
            return;
        }

        SignUpRequest request = new SignUpRequest
        {
            userId = signUpUserIdInput.text,
            nickname = signUpNicknameInput.text,
            password = signUpPasswordInput.text
        };

        StartCoroutine(SignUp(request));
    }

    public void HandleLogin()
    {
        // 입력값 검증
        if (string.IsNullOrEmpty(loginUserIdInput.text) ||
            string.IsNullOrEmpty(loginPasswordInput.text))
        {
            ShowLoginError("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        LoginRequest request = new LoginRequest
        {
            userId = loginUserIdInput.text,
            password = loginPasswordInput.text
        };

        StartCoroutine(Login(request));
    }

    private IEnumerator SignUp(SignUpRequest request)
    {
        string json = JsonUtility.ToJson(request);

        using (UnityWebRequest www = new UnityWebRequest(BASE_URL + SIGNUP_ENDPOINT, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.responseCode == 200)
            {
                Debug.Log("회원가입 성공!");
                // 회원가입 성공 처리 (예: 로그인 화면으로 전환)
                ShowSignUpError(""); // 에러 메시지 초기화
                // TODO: 로그인 화면으로 전환하는 코드 추가
            }
            else
            {
                ErrorResponse errorResponse = JsonUtility.FromJson<ErrorResponse>(www.downloadHandler.text);
                string errorMessage = GetSignUpErrorMessage(errorResponse.code);
                ShowSignUpError(errorMessage);
                Debug.LogError($"회원가입 실패: {errorResponse.code} - {errorResponse.message}");
            }
        }
    }

    private IEnumerator Login(LoginRequest request)
    {
        string json = JsonUtility.ToJson(request);

        using (UnityWebRequest www = new UnityWebRequest(BASE_URL + LOGIN_ENDPOINT, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.responseCode == 200)
            {
                Debug.Log("로그인 성공!");
                ShowLoginError(""); // 에러 메시지 초기화
                // TODO: 게임 메인 화면으로 전환하는 코드 추가
            }
            else
            {
                ErrorResponse errorResponse = JsonUtility.FromJson<ErrorResponse>(www.downloadHandler.text);
                string errorMessage = GetLoginErrorMessage(errorResponse.code);
                ShowLoginError(errorMessage);
                Debug.LogError($"로그인 실패: {errorResponse.code} - {errorResponse.message}");
            }
        }
    }

    // 회원가입 에러 코드에 따른 사용자 친화적인 메시지 반환
    private string GetSignUpErrorMessage(string errorCode)
    {
        switch (errorCode)
        {
            case "DUPLICATE_NICKNAME":
                return "이미 사용 중인 닉네임입니다.";
            case "DUPLICATE_USERID":
                return "이미 사용 중인 아이디입니다.";
            default:
                return "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
    }

    // 로그인 에러 코드에 따른 사용자 친화적인 메시지 반환
    private string GetLoginErrorMessage(string errorCode)
    {
        switch (errorCode)
        {
            case "LOGIN_FAIL":
                return "아이디 또는 비밀번호가 올바르지 않습니다.";
            case "USER_NOT_FOUND":
                return "존재하지 않는 사용자입니다.";
            default:
                return "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
    }

    // UI에 회원가입 에러 메시지 표시
    private void ShowSignUpError(string message)
    {
        if (signUpErrorText != null)
        {
            signUpErrorText.text = message;
            signUpErrorText.gameObject.SetActive(!string.IsNullOrEmpty(message));
        }
    }

    // UI에 로그인 에러 메시지 표시
    private void ShowLoginError(string message)
    {
        if (loginErrorText != null)
        {
            loginErrorText.text = message;
            loginErrorText.gameObject.SetActive(!string.IsNullOrEmpty(message));
        }
    }
}