using System.Collections;
using UnityEngine;

public class DisasterStage1Before : MonoBehaviour
{
    public DisasterStage1Manager manager;

    private void OnDestroy()
    {
        manager.Disaster();
    }
}
