using UnityEngine;

[RequireComponent(typeof(LineRenderer))]
public class RangeVisualizer : MonoBehaviour
{
    public float radius = 0.5f; // 원의 반지름
    public int segments = 50; // 원을 그릴 때 사용할 세그먼트 수
    private LineRenderer lineRenderer;

    void Start()
    {
        lineRenderer = GetComponent<LineRenderer>();
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
}
