using UnityEngine;

public class DisasterStage1Before : MonoBehaviour
{
    public GameObject afterDisaster;

    private void OnDestroy()
    {
        afterDisaster.SetActive(true);
    }
}
