using System;
using System.Collections;
using UnityEngine;

public class PlayerHPController : MonoBehaviour
{
    public int health;
    public float respawnTime = 3f;

    public bool isDead = false;

    private int maxHealth;

    public GameObject deadBodyPrefeb;
    private GameObject deadBody;

    public static event Action<Transform> OnEntityDestroyed;

    public Material deadMaterial;
    public Material[] liveMaterials;
    public Renderer[] renderers;

    private void Start()
    {
        maxHealth = health;
    }

    void Update()
    {
        if (health <= 0 && !isDead)
        {
            OnEntityDestroyed?.Invoke(transform);
            tag = "DeadPlayer";
            isDead = true;
            deadBody = Instantiate(deadBodyPrefeb, transform.position, transform.rotation);
            StartCoroutine(Respawn());
        }
    }

    IEnumerator Respawn()
    {
        foreach(Renderer renderer in renderers)
        {
            renderer.material = deadMaterial;
        }

        yield return new WaitForSeconds(respawnTime);

        Destroy(deadBody);
        RevivePlayer();
    }

    public void GetDamage(int damage)
    {
        health -= damage;
    }

    public void RevivePlayer()
    {
        health = maxHealth;
        tag = "Player";
        isDead = false;

        for(int i=0; i<renderers.Length; i++)
        {
            renderers[i].material = liveMaterials[i];
        }
    }
}
