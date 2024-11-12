using UnityEngine;
using UnityEngine.UI;
using System;
using System.Text;
using UnityEngine.Networking;
using System.Collections;
using TMPro;
using TMPro.Examples;

// 사용자 요청 모델
[Serializable]
public class SignUpRequest
{
    public string username;
    public string nickname;
    public string password;
}

[Serializable]
public class LoginRequest
{
    public string username;
    public string password;
}

[Serializable]
public class LoginResponse
{
    public string code;
    public LoginData data;
}

[Serializable]
public class LoginData
{
    public string nickname;
    public int userId;
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
    [SerializeField] private TMP_InputField signUpUsernameInput;
    [SerializeField] private TMP_InputField signUpNicknameInput;
    [SerializeField] private TMP_InputField signUpPasswordInput;
    [SerializeField] private TMP_InputField loginUserIdInput;
    [SerializeField] private TMP_InputField loginPasswordInput;

    // 오류 메시지
    [SerializeField] private RectTransform alertTransform;
    [SerializeField] private GameObject messageAlert;
    [SerializeField] private TMP_Text errorText;

    private const string BASE_URL = "https://k11e102.p.ssafy.io";
    private const string SIGNUP_ENDPOINT = "/api/v1/auth/signup";
    private const string LOGIN_ENDPOINT = "/api/v1/auth/login";

    private void start()
    {
        // 초기 메시지 창 크기를 0으로 설정
        alertTransform.localScale = new Vector3(0, 1, 1);
    }

    public void HandleSignUp()
    {
        // 입력값 검증
        if (string.IsNullOrEmpty(signUpUsernameInput.text) ||
            string.IsNullOrEmpty(signUpNicknameInput.text) ||
            string.IsNullOrEmpty(signUpPasswordInput.text))
        {
            //ShowSignUpError("모든 필드를 입력해주세요.");
            ShowErrorMessage("모든 필드를 입력해주세요.");
            Debug.Log("모든 필드를 입력해주세요.");
            return;
        }

        SignUpRequest request = new SignUpRequest
        {
            username = signUpUsernameInput.text,
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
            ShowErrorMessage("아이디와 비밀번호를 입력해주세요.");
            Debug.Log("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        LoginRequest request = new LoginRequest
        {
            username = loginUserIdInput.text,
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
                // 회원가입 성공 처리
                // TODO: 로그인 화면으로 전환하는 코드 추가
            }
            else
            {
                ErrorResponse errorResponse = JsonUtility.FromJson<ErrorResponse>(www.downloadHandler.text);
                string errorMessage = GetSignUpErrorMessage(errorResponse.code);
                ShowErrorMessage(errorMessage);
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
                // 성공적인 응답 처리
                Debug.Log("로그인 성공!");

                // 응답 JSON을 LoginResponse 객체로 변환
                LoginResponse loginResponse = JsonUtility.FromJson<LoginResponse>(www.downloadHandler.text);

                // code와 data의 데이터를 출력
                Debug.Log($"로그인 결과 - 코드: {loginResponse.code}, 닉네임: {loginResponse.data.nickname}, 사용자 ID: {loginResponse.data.userId}");

                // 에러 메시지 초기화
                // TODO: 게임 메인 화면으로 전환하는 코드 추가
            }
            else
            {
                ErrorResponse errorResponse = JsonUtility.FromJson<ErrorResponse>(www.downloadHandler.text);
                string errorMessage = GetLoginErrorMessage(errorResponse.code);
                ShowErrorMessage(errorMessage);
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

    private bool isAnimating = false;

    private void ShowErrorMessage(string message)
    {
        if (messageAlert != null && !isAnimating)
        {
            errorText.text = message;
            messageAlert.SetActive(true);
            StartCoroutine(AnimateAlert());
        }
    }

    private IEnumerator AnimateAlert()
    {
        // 애니메이션이 시작되었음을 표시
        isAnimating = true;

        // 메시지 확장 애니메이션
        float animationTime = 0.1f;
        float elapsedTime = 0f;

        // 알림이 좁은 곳에서 펼쳐지게 애니메이션
        while (elapsedTime < animationTime)
        {
            elapsedTime += Time.deltaTime;
            float scale = Mathf.Lerp(0, 1, elapsedTime / animationTime);
            alertTransform.localScale = new Vector3(scale, 1, 1);
            yield return null;
        }

        // 2초 대기
        yield return new WaitForSeconds(1);

        // 메시지 축소 애니메이션
        elapsedTime = 0f;
        while (elapsedTime < animationTime)
        {
            elapsedTime += Time.deltaTime;
            float scale = Mathf.Lerp(1, 0, elapsedTime / animationTime);
            alertTransform.localScale = new Vector3(scale, 1, 1);
            yield return null;
        }

        // 알림 메시지 비활성화
        messageAlert.SetActive(false);

        // 애니메이션 종료
        isAnimating = false;
    }
}