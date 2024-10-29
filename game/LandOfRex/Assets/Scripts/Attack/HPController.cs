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
                Transform rootParent = GetRootParent(transform);
                rootParent.gameObject.SetActive(false);
            }
            else
            {
                // 최상위 부모를 찾아서 파괴
                Transform rootParent = GetRootParent(transform);
                Destroy(rootParent.gameObject);
            }
        }
    }

    // 루트 부모 찾기 (자기 자신이 루트 오브젝트라면 자기 자신을 반환)
    private Transform GetRootParent(Transform current)
    {
        // 부모가 없다면, 현재 오브젝트가 루트 오브젝트이므로 그 자신을 반환
        while (current.parent != null)
        {
            current = current.parent;
        }
        return current;
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
