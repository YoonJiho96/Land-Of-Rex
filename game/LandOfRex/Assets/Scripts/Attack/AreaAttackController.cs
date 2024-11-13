using UnityEngine;
using System.Collections.Generic;

public class AreaAttackController : MonoBehaviour
{
    public float speed = 20f;
    public int damage = 10;
    public float radius = 10f; // 폭발 범위
    public Vector3 targetPosition;
    public float explosionDelay = 0.5f; // 폭발까지의 지연 시간
    public GameObject explosionEffectPrefab; // 폭발 이펙트 프리팹

    private float travelTime = 0f;
    private bool hasExploded = false;

    public void Initialize(Vector3 target, int damage)
    {
        targetPosition = target;
        this.damage = damage;
    }

    private void Update()
    {
        if (hasExploded) return;

        travelTime += Time.deltaTime;

        // 목표 지점으로 이동
        Vector3 direction = (targetPosition - transform.position).normalized;
        transform.position += direction * speed * Time.deltaTime;

        // 목표 지점에 도달하거나 지연 시간이 지나면 폭발
        if (Vector3.Distance(transform.position, targetPosition) <= 0f || travelTime >= explosionDelay)
        {
            Explode();
        }
    }

    private void Explode()
    {
        if (hasExploded) return;
        hasExploded = true;

        // 폭발 범위 내의 모든 적에게 데미지
        Collider[] hitColliders = Physics.OverlapSphere(transform.position, radius);
        foreach (var hitCollider in hitColliders)
        {
            if (hitCollider.CompareTag("Enemy"))
            {
                var hpController = hitCollider.GetComponent<HPController>();
                if (hpController != null)
                {
                    hpController.GetDamage(damage);
                }
            }
        }

        // 폭발 이펙트 생성
        if (explosionEffectPrefab != null)
        {
            Instantiate(explosionEffectPrefab, transform.position, Quaternion.identity);
        }

        // 폭발 후 오브젝트 제거
        Destroy(gameObject, 0.1f);
    }

    private void OnDrawGizmos()
    {
        // 폭발 범위를 시각적으로 표시
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, radius);
    }
}