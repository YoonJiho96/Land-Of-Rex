using UnityEngine;

public class StageManager : MonoBehaviour
{

    public GameObject[] forest;
    public GameObject[] volcano;

    void Update()
    {
        if(LoginDataManager.Instance.LoginData.highestStage > 1 && volcano[0].activeSelf)
        {
            foreach(GameObject obj in volcano)
            {
                obj.SetActive(false);
            }
        }
        else if(LoginDataManager.Instance.LoginData.highestStage > 0 && forest[0].activeSelf)
        {
            foreach (GameObject obj in forest)
            {
                obj.SetActive(false);
            }
        }
    }
}
