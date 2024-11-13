using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class IntroController : MonoBehaviour
{
    public float loadingTime = 1f;

    void Start()
    {
        StartCoroutine(StartIntro());
    }

    private IEnumerator StartIntro()
    {
        yield return new WaitForSeconds(loadingTime);

        SceneManager.LoadScene("LobbyMap");
    }
}
