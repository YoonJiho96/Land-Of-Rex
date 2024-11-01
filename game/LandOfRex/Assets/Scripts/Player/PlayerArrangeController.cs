using System.Collections.Generic;
using UnityEngine;
using System.Linq;

[RequireComponent(typeof(LineRenderer))]
public class PlayerArrangeController : MonoBehaviour
{
    public float radius = 2f; // 원의 반지름
    public int segments = 50; // 원을 그릴 때 사용할 세그먼트 수
    private LineRenderer lineRenderer;
    public Collider arrangeCollider;
    public List<Transform> unitList = new List<Transform>();

    private string[] unitType = { "", "Infantry", "Archer", "Spearman", "Mage", "Cavalry", ""};

    void Start()
    {
        lineRenderer = GetComponent<LineRenderer>();
        arrangeCollider = GetComponent<Collider>();
        lineRenderer.positionCount = segments + 1; // 원의 시작점과 끝점 연결
        lineRenderer.useWorldSpace = false; // 로컬 좌표 사용

        DrawCircle();
    }

    void DrawCircle()
    {
        float angle = 0f;

        for (int i = 0; i <= segments; i++)
        {
            float x = Mathf.Sin(Mathf.Deg2Rad * angle) * radius;
            float z = Mathf.Cos(Mathf.Deg2Rad * angle) * radius;

            lineRenderer.SetPosition(i, new Vector3(x, 0, z));
            angle += 360f / segments;
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Unit"))
        {
            Transform unit = other.transform.parent;

            if(!unit.GetComponent<UnitController>().isFollowingPlayerSub)
            {
                unitList.Add(unit);
                unit.GetComponent<UnitController>().SetFollowPlayer(true);
            }
        }
    }

    public void StartArrange()
    {
        gameObject.SetActive(true);
    }

    public void FinishArrange()
    {
        foreach(Transform unit in unitList)
        {
            if (unit != null)
            {
                unit.GetComponent<UnitController>().SetFollowPlayer(false);
            }
        }

        unitList.Clear();

        arrangeCollider.enabled = true;
        gameObject.SetActive(false);
    }

    public void StartArrange2(int num)
    {
        StartArrange();
        FinishArrange();

        StartArrange();
        arrangeCollider.enabled = false;

        GameObject[] allGameObjects = Resources.FindObjectsOfTypeAll<GameObject>();
        GameObject[] units = allGameObjects
            .Where(obj => obj.name.StartsWith(unitType[num] + "(Clone)"))
            .ToArray();

        foreach(var unit in units)
        {
            if (!unit.GetComponent<UnitController>().isFollowingPlayerSub)
            {
                unitList.Add(unit.transform);
                unit.GetComponent<UnitController>().SetFollowPlayer(true);
            }
        }
    }
}
