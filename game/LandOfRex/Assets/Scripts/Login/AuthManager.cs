using UnityEngine;
using UnityEngine.UI;
using System;
using System.Text;
using UnityEngine.Networking;
using System.Collections;
using TMPro;
using TMPro.Examples;
using JetBrains.Annotations;
using UnityEngine.SceneManagement;
using System.Text.RegularExpressions;

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
    public int highestStage;
}

[Serializable]
public class CheckUsernameRequest
{
    public String username;
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

    // 성공 메시지
    [SerializeField] private RectTransform sucessAlertTransform;
    [SerializeField] private GameObject successMessageAlert;
    [SerializeField] private TMP_Text successText;

    // 회원가입
    [SerializeField] private Button signUpButton;
    private bool isUsernameValid = false;
    private bool isNicknameValid = false;

    [SerializeField] private AuthUIManager authUIManager;

    [SerializeField] private AudioManager audioManager;

    private const string BASE_URL = "https://k11e102.p.ssafy.io";
    private const string SIGNUP_ENDPOINT = "/api/v1/auth/signup";
    private const string LOGIN_ENDPOINT = "/api/v1/auth/login";

    private void Start()
    {
        // 기본 배경음 재생
        if (audioManager != null)
        {
            audioManager.PlayDefaultBGM();
        }

        // 초기 메시지 창 크기를 0으로 설정
        alertTransform.localScale = new Vector3(0, 1, 1);
        sucessAlertTransform.localScale = new Vector3(0, 1, 1);

        // 가입 버튼 초기 비활성화
        signUpButton.interactable = false;
    }

    [Serializable]
    public class UsernameCheckResponse
    {
        public string code;
        public string message;
        public string data;
    }

    public void CheckUsernameExists()
    {
        string username = signUpUsernameInput.text;

        if (string.IsNullOrEmpty(username))
        {
            ShowErrorMessage("아이디를 입력해주세요.");
            return;
        }

        if (!IsValidUsername(username))
        {
            ShowErrorMessage("아이디는 영문과 숫자만 사용하여 4~12자로 입력해야 합니다.");
            return;
        }

        StartCoroutine(CheckUsername(username));
    }

    public void CheckNicknameExists()
    {
        string nickname = signUpNicknameInput.text;

        if (string.IsNullOrEmpty(nickname))
        {
            ShowErrorMessage("닉네임을 입력해주세요.");
            return;
        }

        if (!IsValidNickname(nickname))
        {
            ShowErrorMessage("닉네임은 한글, 영문, 숫자를 사용해 2~10자로 입력하세요.");
            return;
        }

        StartCoroutine(CheckNickname(nickname));
    }

    private IEnumerator CheckUsername(string username)
    {
        // JSON 데이터를 요청 본문에 포함하기 위한 객체 생성
        CheckUsernameRequest checkUsernameRequest = new CheckUsernameRequest { username = username };
        string json = JsonUtility.ToJson(checkUsernameRequest);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        using (UnityWebRequest www = new UnityWebRequest($"{BASE_URL}/api/v1/auth/username/exists", "POST"))
        {
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            Debug.Log($"Response Code: {www.responseCode}");
            Debug.Log($"Response Text: {www.downloadHandler.text}");

            UsernameCheckResponse response = JsonUtility.FromJson<UsernameCheckResponse>(www.downloadHandler.text);

            if (response.code == "success")
            {
                ShowSuccessMessage("사용 가능한 아이디 입니다.");
                isUsernameValid = true;
            }
            else if (response.code == "DUPLICATE_USERNAME")
            {
                ShowErrorMessage("중복된 아이디 입니다.");
                isUsernameValid = false;
            }
            else
            {
                ShowErrorMessage("아이디 확인 중 오류가 발생했습니다. " + response.message);
                isUsernameValid = false;
            }
        }
        UpdateSignUpButtonState();
    }

    private IEnumerator CheckNickname(string nickname)
    {
        using (UnityWebRequest www = UnityWebRequest.Get($"{BASE_URL}/api/v1/auth/nickname/{nickname}/exists"))
        {
            www.downloadHandler = new DownloadHandlerBuffer();
            yield return www.SendWebRequest();

            // JSON 응답을 파싱
            UsernameCheckResponse response = JsonUtility.FromJson<UsernameCheckResponse>(www.downloadHandler.text);

            Debug.Log(response.code);
            if (response.code == "success")
            {
                ShowSuccessMessage("사용 가능한 닉네임입니다.");
                isNicknameValid = true;
            }
            else if (response.code == "DUPLICATE_NICKNAME")
            {
                // 중복 닉네임 처리
                ShowErrorMessage("중복된 닉네임 입니다.");
                isNicknameValid = false;
            }
            else
            {
                ShowErrorMessage("닉네임 확인 중 오류가 발생했습니다." + response.message);
                isNicknameValid = false;
            }
        }
        UpdateSignUpButtonState();
    }

    private void UpdateSignUpButtonState()
    {
        // 두 조건이 모두 참일 때만 가입 버튼 활성화
        signUpButton.interactable = isUsernameValid && isNicknameValid;
    }

    // 정규식 패턴 정의
    private const string NICKNAME_REGEX = @"^(?=.*[a-zA-Z가-힣0-9])(?!(.*[ㄱ-ㅎ]{2,}|.*[ㅏ-ㅣ]{2,}))[a-zA-Z0-9가-힣]{2,10}$";
    private const string PASSWORD_REGEX = @"^[a-zA-Z0-9!@#$%^&()]{4,12}$";
    private const string USERNAME_REGEX = @"^[a-zA-Z0-9]{4,12}$";

    // 정규식 검사 함수
    private bool IsValidUsername(string username)
    {
        return Regex.IsMatch(username, USERNAME_REGEX);
    }

    private bool IsValidNickname(string nickname)
    {
        return Regex.IsMatch(nickname, NICKNAME_REGEX);
    }

    private bool IsValidPassword(string password)
    {
        return Regex.IsMatch(password, PASSWORD_REGEX);
    }

    // 회원가입 핸들러에서 정규식 검사 적용
    public void HandleSignUp()
    {
        if (!IsValidUsername(signUpUsernameInput.text))
        {
            ShowErrorMessage("아이디는 영문과 숫자만 사용하여 4~12자로 입력해야 합니다.");
            return;
        }

        if (!IsValidNickname(signUpNicknameInput.text))
        {
            ShowErrorMessage("닉네임은 한글, 영문, 숫자를 사용해 2~10자로 입력하세요.");
            return;
        }

        if (!IsValidPassword(signUpPasswordInput.text))
        {
            ShowErrorMessage("비밀번호는 영문, 숫자, 특수문자(!@#$%^&())를 사용하여 4~12자로 입력하세요.");
            return;
        }

        // 정규식 검사 통과 시 회원가입 진행
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
                ShowSuccessMessage("회원가입 성공!");
                authUIManager.ShowLoginPanel();
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
                ShowSuccessMessage("로그인 성공");

                // 응답 JSON을 LoginResponse 객체로 변환
                LoginResponse loginResponse = JsonUtility.FromJson<LoginResponse>(www.downloadHandler.text);

                // code와 data의 데이터를 출력
                Debug.Log($"로그인 결과 - 코드: {loginResponse.code}, 닉네임: {loginResponse.data.nickname}, 사용자 ID: {loginResponse.data.userId}, 최종 스테이지: {loginResponse.data.highestStage}");

                // 로그인 데이터 저장
                LoginDataManager.Instance.SetLoginData(loginResponse.data);

                // 씬 이동
                SceneManager.LoadScene("LobbyMap");
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

    // 회원가입 성공 시 성공 메시지 알림 표시 메서드 추가
    private void ShowSuccessMessage(string message)
    {
        if (successMessageAlert != null && !isAnimating)
        {
            successText.text = message;
            successMessageAlert.SetActive(true);
            StartCoroutine(AnimateSuccessAlert());
        }
    }

    private void ShowErrorMessage(string message)
    {
        if (messageAlert != null && !isAnimating)
        {
            errorText.text = message;
            messageAlert.SetActive(true);
            StartCoroutine(AnimateErrorAlert());
        }
    }

    private IEnumerator AnimateErrorAlert()
    {
        // 에러 메시지 애니메이션 시작
        isAnimating = true;
        yield return StartCoroutine(AnimateAlert(alertTransform));
        messageAlert.SetActive(false);
        isAnimating = false;
    }

    private IEnumerator AnimateSuccessAlert()
    {
        // 성공 메시지 애니메이션 시작
        isAnimating = true;
        yield return StartCoroutine(AnimateAlert(sucessAlertTransform));
        successMessageAlert.SetActive(false);
        isAnimating = false;
    }

    // 알림 메시지의 공통 애니메이션을 분리
    private IEnumerator AnimateAlert(RectTransform targetTransform)
    {
        float animationTime = 0.1f;
        float elapsedTime = 0f;

        // 알림 확장 애니메이션
        while (elapsedTime < animationTime)
        {
            elapsedTime += Time.deltaTime;
            float scale = Mathf.Lerp(0, 1, elapsedTime / animationTime);
            targetTransform.localScale = new Vector3(scale, 1, 1);
            yield return null;
        }

        // 2초 대기
        yield return new WaitForSeconds(2);

        // 알림 축소 애니메이션
        elapsedTime = 0f;
        while (elapsedTime < animationTime)
        {
            elapsedTime += Time.deltaTime;
            float scale = Mathf.Lerp(1, 0, elapsedTime / animationTime);
            targetTransform.localScale = new Vector3(scale, 1, 1);
            yield return null;
        }
    }
}