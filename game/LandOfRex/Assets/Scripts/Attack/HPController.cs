using System;
using UnityEngine;
using UnityEngine.UI;

public class HPController : MonoBehaviour
{
    public int health; // 현재 체력
    public bool isBuilding; // 건물 여부
    public Slider hpBarSlider;  // HP 바 슬라이더 참조

    private int maxHealth; // 최대 체력

    public static event Action<Transform> OnEntityDestroyed;

    private void Start()
    {
        maxHealth = health;

        if (hpBarSlider != null)
        {
            hpBarSlider.maxValue = maxHealth;
            hpBarSlider.value = health;
            hpBarSlider.gameObject.SetActive(false); // 초기에는 HP 바 숨기기
        }
    }

    void Update()
    {
        if (health < maxHealth && hpBarSlider != null && !hpBarSlider.gameObject.activeSelf)
        {
            hpBarSlider.gameObject.SetActive(true); // 체력이 깎이면 HP 바 보이기
        }

        if (health <= 0) // 체력이 0 이하일 때
        {
            OnEntityDestroyed?.Invoke(transform);

            if (isBuilding)
            {
                Transform rootParent = GetRootParent(transform);
                rootParent.gameObject.SetActive(false);
            }
            else
            {
                Transform rootParent = GetRootParent(transform);
                Destroy(rootParent.gameObject);
            }
        }

        if (hpBarSlider != null)
        {
            hpBarSlider.value = health; // 체력에 따라 슬라이더 값 업데이트
        }
    }

    private Transform GetRootParent(Transform current)
    {
        while (current.parent != null)
        {
            current = current.parent;
        }
        return current;
    }

    public void GetDamage(int damage)
    {
        health -= damage;

        if (hpBarSlider != null)
        {
            hpBarSlider.value = health; // 슬라이더 값 업데이트
        }
    }

    public void ReviveBuilding()
    {
        health = maxHealth;
        gameObject.SetActive(true);

        if (hpBarSlider != null)
        {
            hpBarSlider.value = health;
            hpBarSlider.gameObject.SetActive(false); // 체력이 최대일 때 HP 바 숨기기
        }
    }
}
