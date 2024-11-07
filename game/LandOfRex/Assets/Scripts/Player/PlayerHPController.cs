using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

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

    public Slider hpSlider; // HP 슬라이더 참조

    private void Start()
    {
        maxHealth = health;

        if (hpSlider != null)
        {
            hpSlider.maxValue = maxHealth;
            hpSlider.value = health;
            hpSlider.gameObject.SetActive(false); // 초기에는 HP 바 숨기기
        }
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

        if (hpSlider != null)
        {
            // 체력이 최대 체력보다 낮아지면 HP 바 보이기
            hpSlider.gameObject.SetActive(health < maxHealth);
            hpSlider.value = health; // 슬라이더 값 업데이트
        }
    }

    IEnumerator Respawn()
    {
        foreach (Renderer renderer in renderers)
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
        if (hpSlider != null)
        {
            // 체력이 줄어들면 HP 바 보이기
            hpSlider.gameObject.SetActive(health < maxHealth);
            hpSlider.value = health; // 슬라이더 값 업데이트
        }
    }

    public void RevivePlayer()
    {
        health = maxHealth;
        tag = "Player";
        isDead = false;

        for (int i = 0; i < renderers.Length; i++)
        {
            renderers[i].material = liveMaterials[i];
        }

        if (hpSlider != null)
        {
            hpSlider.value = health; // 체력 복구 시 슬라이더 최대값으로 설정
            hpSlider.gameObject.SetActive(false); // 최대 체력에서는 HP 바 숨기기
        }
    }
}
