using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class IntroController : MonoBehaviour
{
    public RectTransform imageRectTransform;
    public CanvasGroup imageCanvasGroup;
    public float loadingTime = 1f;
    public float animationDuration = 0.5f; // 애니메이션 시간
    public float moveDistance = 100f; // 이동 거리

    public AudioManager audioManager;

    void Start()
    {
        if (audioManager != null)
        {
            audioManager.PlayDefaultBGM(); // 기본 배경음 재생
        }

        StartCoroutine(StartIntro());
    }

    private IEnumerator StartIntro()
    {
        // 1. 이미지가 아래에서 위로 올라오며 나타남
        yield return StartCoroutine(AnimateImage(Vector2.down * moveDistance, Vector2.zero, 0, 1));

        // 2. 로딩 시간 대기
        yield return new WaitForSeconds(loadingTime);

        // 3. 이미지가 위로 올라가며 사라짐
        yield return StartCoroutine(AnimateImage(Vector2.zero, Vector2.up * moveDistance, 1, 0));

        // 4. 다음 씬 로드
        SceneManager.LoadScene("Login");
    }

    private IEnumerator AnimateImage(Vector2 startPos, Vector2 endPos, float startAlpha, float endAlpha)
    {
        float elapsedTime = 0f;
        imageRectTransform.anchoredPosition = startPos;
        imageCanvasGroup.alpha = startAlpha;

        while (elapsedTime < animationDuration)
        {
            elapsedTime += Time.deltaTime;
            float t = elapsedTime / animationDuration;

            // 위치와 투명도 보간
            imageRectTransform.anchoredPosition = Vector2.Lerp(startPos, endPos, t);
            imageCanvasGroup.alpha = Mathf.Lerp(startAlpha, endAlpha, t);

            yield return null;
        }

        // 최종 위치와 투명도 설정
        imageRectTransform.anchoredPosition = endPos;
        imageCanvasGroup.alpha = endAlpha;
    }
}