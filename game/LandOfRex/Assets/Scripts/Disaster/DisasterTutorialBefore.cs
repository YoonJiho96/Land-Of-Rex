using UnityEngine;

public class DisasterTutorialBefore : MonoBehaviour
{
    public GameObject afterDisaster;

    private void OnDestroy()
    {
        afterDisaster.SetActive(true);
    }
}
