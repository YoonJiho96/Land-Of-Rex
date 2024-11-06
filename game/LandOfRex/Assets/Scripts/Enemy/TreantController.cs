using UnityEngine;

public class TreantController : MonoBehaviour
{
    public GameObject[] enemys;
    public Transform[] spawnPoints;
    public float spawnInterval = 5f;
    public Transform destination;

    private float timer = 0f;

    private void Start()
    {
        destination = GetComponent<EnemyController>().destination;
    }

    void Update()
    {
        timer += Time.deltaTime;
        
        if(timer >= spawnInterval)
        {
            SpawnEnemy();
            timer = 0f;
        }
    }
    void SpawnEnemy()
    {
        int enemyIndex = Random.Range(0, 5);
        int spawnPointIndex = Random.Range(0, 4);

        GameObject enemy = Instantiate(enemys[enemyIndex], spawnPoints[spawnPointIndex].position, Quaternion.identity);
        enemy.transform.Find("Body").GetComponent<EnemyController>().destination = destination;
    }
}
