using UnityEngine;

public class AttackController : MonoBehaviour
{
    public float speed = 20f;
    public int damage = 10;
    public Transform target;
    public float closeDistance = 3f;

    public void Initialize(Transform enemy, int damage)
    {
        target = enemy;
        this.damage = damage;
    }

    private void Update()
    {
        if (target == null || target.tag == "DeadPlayer")
        {
            Destroy(gameObject); // 목표 적이 없어졌다면 공격을 제거
            return;
        }

        // 적을 향하도록 회전
        Vector3 direction = (target.position - transform.position).normalized;
        Quaternion lookRotation = Quaternion.LookRotation(direction);
        transform.rotation = Quaternion.Slerp(transform.rotation, lookRotation, Time.deltaTime * 10);

        // 적 방향으로 이동
        transform.position += transform.forward * speed * Time.deltaTime;

        // 목표 적에 가까워지면 충돌로 간주하고 공격을 제거
        if (Vector3.Distance(transform.position, target.position) < closeDistance)
        {
            // 적에게 피해를 입히는 코드 (적 스크립트에 맞게 조정)
            if (target.CompareTag("Player"))
            {
                target.GetComponent<PlayerHPController>().GetDamage(damage);
            }
            else
            {
                target.GetComponent<HPController>().GetDamage(damage); // 예: 10만큼 피해를 줌
            }

            Destroy(gameObject);
        }
    }
}
