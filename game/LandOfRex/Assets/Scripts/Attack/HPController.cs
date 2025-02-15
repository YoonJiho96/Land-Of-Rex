using NUnit.Framework;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using UnityEngine.UI;

public class HPController : MonoBehaviour
{
    public int health; // 현재 체력
    public bool isBuilding; // 건물 여부
    public bool isUnit; // 유닛 여부
    public bool isEnemy; // 적 여부
    public bool isHidden; // 히든 여부
    public bool isQueenWorm = false;
    public Slider hpBarSlider;  // HP 바 슬라이더 참조
    public DataManager dataManager;
    public GateManager gateManager;

    private int maxHealth; // 최대 체력
    private bool isDead; // 사망 여부 확인

    public static event Action<Transform> OnEntityDestroyed;

    public GameObject damageEffectPrefab;   // 피격 이펙트
    public Transform effectSpawnPoint;  // 피격 포인트 위치

    public GameObject deadEffectPrefab; // 사망 이펙트
    public Transform deadEffectSpawnPoint;

    public GameObject reviveEffectPrefab;   // 부활 이펙트
    public Transform reviveEffectSpawnPoint;

    private void Awake()
    {
        dataManager = GameObject.Find("DataManager").GetComponent<DataManager>();
        gateManager = GameObject.Find("GateManager").GetComponent<GateManager>();
    }

    private void Start()
    {
        maxHealth = health;
        isDead = false; // 초기 상태에서는 살아 있음

        if (hpBarSlider != null)
        {
            hpBarSlider.maxValue = maxHealth;
            hpBarSlider.value = health;
            hpBarSlider.gameObject.SetActive(false); // 초기에는 HP 바 숨기기
        }
    }

    private void OnEnable()
    {
        if(dataManager != null)
        {
            if (isBuilding)
            {
                if (!dataManager.buildings.Contains(transform))
                {
                    dataManager.buildings.Add(transform);
                }
            }
            else if(isEnemy)
            {
                if(isHidden)
                {
                    if(!gateManager.hiddens.Contains(transform))
                    {
                        gateManager.hiddens.Add(transform);
                        gateManager.isStart = true;
                    }
                }
                else
                {
                    if(!dataManager.enemys.Contains(transform))
                    {
                        dataManager.enemys.Add(transform);
                    }
                }
            }
        }
    }

    private void OnDestroy()
    {
        if (dataManager != null)
        {
            if (isBuilding)
            {
                dataManager.buildings.Remove(transform);
            }
            else if(isUnit && !isHidden)
            {
                foreach(int bootCamp in dataManager.units.Keys)
                {
                    dataManager.units[bootCamp].Remove(GetRootParent(transform));
                }
            }
            else if(isEnemy)
            {
                if(isHidden)
                {
                    gateManager.hiddens.Remove(transform);
                }
                else
                {
                    dataManager.enemys.Remove(transform);
                }
            }
        }
    }

    void Update()
    {
        if (health < maxHealth && hpBarSlider != null && !hpBarSlider.gameObject.activeSelf)
        {
            hpBarSlider.gameObject.SetActive(true); // 체력이 깎이면 HP 바 보이기
        }

        if (health <= 0 && !isDead) // 체력이 0 이하이고 아직 죽지 않은 상태일 때만
        {
            isDead = true; // 사망 상태로 변경하여 이후 호출 방지
            OnEntityDestroyed?.Invoke(transform);

            if (isBuilding)
            {
                StartCoroutine(PlayBuildingDeathEffect());
            }
            else
            {
                PlayDeathSequence();
            }
        }

        if (hpBarSlider != null)
        {
            hpBarSlider.value = health; // 체력에 따라 슬라이더 값 업데이트
        }
    }

    private IEnumerator PlayBuildingDeathEffect()
    {
        // 사망 이펙트 생성
        GameObject deathEffectInstance = null;
        if (deadEffectPrefab != null)
        {
            deathEffectInstance = Instantiate(deadEffectPrefab, deadEffectSpawnPoint != null ? deadEffectSpawnPoint.position : transform.position, Quaternion.identity, transform);
        }

        // 이펙트의 지속 시간 동안 대기
        if (deathEffectInstance != null)
        {
            ParticleSystem particleSystem = deathEffectInstance.GetComponent<ParticleSystem>();
            if (particleSystem != null)
            {
                yield return new WaitForSeconds(particleSystem.main.duration);
            }
            else
            {
                yield return new WaitForSeconds(2.0f); // 기본 대기 시간 (애니메이션 등 다른 경우)
            }
        }

        // 빌딩 비활성화
        Transform rootParent = GetRootParent(transform);
        rootParent.gameObject.SetActive(false);
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

        // 피격 이펙트 출력
        if (damageEffectPrefab != null)
        {
            Instantiate(damageEffectPrefab, effectSpawnPoint != null ? effectSpawnPoint.position : transform.position, Quaternion.identity, transform);
        }
    }

    public void ReviveBuilding()
    {
        health = maxHealth;
        isDead = false; // 부활 시 다시 살아 있는 상태로 변경

        Transform rootParent = GetRootParent(transform);
        rootParent.gameObject.SetActive(true);

        if (hpBarSlider != null)
        {
            hpBarSlider.value = health;
            hpBarSlider.gameObject.SetActive(false); // 체력이 최대일 때 HP 바 숨기기
        }

        // 부활 이펙트 출력
        if (reviveEffectPrefab != null)
        {
            Instantiate(reviveEffectPrefab, reviveEffectSpawnPoint != null ? reviveEffectSpawnPoint.position : transform.position, Quaternion.identity, transform);
        }
    }

    private void PlayDeathSequence()
    {
        // 사망 이펙트 생성
        if (deadEffectPrefab != null)
        {
            Instantiate(deadEffectPrefab, deadEffectSpawnPoint != null ? deadEffectSpawnPoint.position : transform.position, Quaternion.identity);
        }

        // 부모 객체 가져오기
        Transform parent = GetRootParent(transform);

        // 부모 오브젝트 삭제
        Destroy(parent.gameObject);
    }
}
