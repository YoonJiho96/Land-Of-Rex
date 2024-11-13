using System.Collections;
using UnityEngine;

public class DisasterStage1Manager : MonoBehaviour
{
    public GameObject startWater;
    public GameObject[] water1;
    public GameObject[] water2;
    public GameObject[] water3;
    public GameObject[] water4;
    public GameObject[] water5;
    public GameObject[] water6;

    public void Disaster()
    {
        StartCoroutine(activeDisaster());
        StartCoroutine(inactiveDisaster());
    }

    private IEnumerator activeDisaster()
    {
        foreach(GameObject water in water1)
        {
            water.SetActive(true);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water2)
        {
            water.SetActive(true);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water3)
        {
            water.SetActive(true);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water4)
        {
            water.SetActive(true);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water5)
        {
            water.SetActive(true);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water6)
        {
            water.SetActive(true);
        }
    }

    private IEnumerator inactiveDisaster()
    {
        yield return new WaitForSeconds(5f);

        startWater.SetActive(false);

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water1)
        {
            water.SetActive(false);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water2)
        {
            water.SetActive(false);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water3)
        {
            water.SetActive(false);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water4)
        {
            water.SetActive(false);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water5)
        {
            water.SetActive(false);
        }

        yield return new WaitForSeconds(0.1f);

        foreach (GameObject water in water6)
        {
            water.SetActive(false);
        }
    }
}
