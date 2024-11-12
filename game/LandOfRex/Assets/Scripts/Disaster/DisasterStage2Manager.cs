using UnityEngine;

public class DisasterStage2Manager : MonoBehaviour
{
    public GameManager gameManager;
    public GameObject[] magmas;
    private int currentWave = 0;

    private void Update()
    {
        if(gameManager.currentWave < 4)
        {
            if(currentWave != gameManager.currentWave)
            {
                magmas[currentWave].SetActive(true);
                currentWave = gameManager.currentWave;

                if(currentWave == 3)
                {
                    magmas[currentWave].SetActive(true);
                }
            }
        }
    }
}
