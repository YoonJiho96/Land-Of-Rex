using UnityEngine;
using UnityEngine.UI;

public class AuthUIManager : MonoBehaviour
{
    [SerializeField] private GameObject loginPanel;
    [SerializeField] private GameObject signupPanel;
    [SerializeField] private Button signUpButton;

    // 로그인 패널 활성화 및 회원가입 패널 비활성화
    public void ShowLoginPanel()
    {
        loginPanel.SetActive(true);
        signupPanel.SetActive(false);
    }

    // 회원가입 패널 활성화 및 로그인 패널 비활성화
    public void ShowSignupPanel()
    {
        signUpButton.interactable = false;
        signupPanel.SetActive(true);
        loginPanel.SetActive(false);
    }
}
