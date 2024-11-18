using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class DisasterStage2 : MonoBehaviour
{
    private Dictionary<Collider, Coroutine> activeCoroutines = new Dictionary<Collider, Coroutine>();

    private void OnEnable()
    {
        // 초기화
        activeCoroutines.Clear();
    }

    private void OnTriggerEnter(Collider other)
    {
        if (!activeCoroutines.ContainsKey(other))
        {
            // 개별 객체마다 코루틴 시작
            Coroutine coroutine = StartCoroutine(ProcessColliderRepeatedly(other));
            activeCoroutines[other] = coroutine;
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (activeCoroutines.ContainsKey(other))
        {
            // 코루틴 중지 및 제거
            StopCoroutine(activeCoroutines[other]);
            activeCoroutines.Remove(other);
        }
    }

    private IEnumerator ProcessColliderRepeatedly(Collider other)
    {
        while (true)
        {
            // 객체가 null인지 확인
            if (other == null || other.gameObject == null)
            {
                // 코루틴 중지 및 제거
                if (activeCoroutines.ContainsKey(other))
                {
                    activeCoroutines.Remove(other);
                }
                yield break;
            }

            if (other.CompareTag("Unit") || other.CompareTag("Enemy"))
            {
                HPController hpController = other.GetComponentInParent<HPController>();
                if (hpController != null && !hpController.isQueenWorm)
                {
                    hpController.GetDamage(30);
                }
            }
            else if (other.CompareTag("Player"))
            {
                PlayerHPController playerHP = other.GetComponentInParent<PlayerHPController>();
                if (playerHP != null)
                {
                    playerHP.GetDamage(30);
                }
            }
            yield return new WaitForSeconds(0.2f); // 0.2초마다 반복
        }
    }
}
