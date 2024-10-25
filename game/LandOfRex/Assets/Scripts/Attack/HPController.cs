using System;
using UnityEngine;

public class HPController : MonoBehaviour
{
    public int health;
    public bool isBuilding;

    private int maxHealth;

    public static event Action<Transform> OnEntityDestroyed;

    private void Start()
    {
        maxHealth = health;
    }

    void Update()
    {
        if(health <= 0)
        {
            OnEntityDestroyed?.Invoke(transform);

            if (isBuilding)
            {
                gameObject.SetActive(false);
            }
            else
            {
                Destroy(gameObject);
            }
        }
    }

    public void GetDamage(int damage)
    {
        health -= damage;
    }

    public void ReviveBuilding()
    {
        health = maxHealth;
        gameObject.SetActive(true);
    }
}
