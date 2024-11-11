using System.Collections.Generic;
using UnityEngine;

public class GateManager : MonoBehaviour
{
    public List<Transform> hiddens = new List<Transform>();
    public int rewardCount;
    public GameObject rewardPrefab;
    public Transform rewardSpawnPoint;
    public bool isStart = false;

    private void Update()
    {
        if(isStart && hiddens.Count == 0)
        {
            for(int i=0; i<rewardCount; i++)
            {
                Instantiate(rewardPrefab, rewardSpawnPoint.position, Quaternion.identity);
            }

            isStart = false;
        }
    }
}
