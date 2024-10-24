using UnityEngine;

public class PlayerBuildingCollider : MonoBehaviour
{
    public BuildingController nearestBuilding;

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Building"))
        {
            BuildingController currentBuilding = other.GetComponent<BuildingController>();
            if (currentBuilding != null)
            {
                // 기존 건물 프리뷰 숨기기
                if (nearestBuilding != null)
                {
                    nearestBuilding.HidePreview();
                }

                // nearestBuilding 업데이트
                nearestBuilding = currentBuilding;
                nearestBuilding.ShowPreview();
            }
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Building"))
        {
            BuildingController currentBuilding = other.GetComponent<BuildingController>();
            if (currentBuilding != null && nearestBuilding == currentBuilding)
            {
                nearestBuilding.HidePreview();
                nearestBuilding = null; // 최근 건물도 제거
            }
        }
    }

    private void OnTriggerStay(Collider other)
    {
        if (other.CompareTag("Building"))
        {
            BuildingController currentBuilding = other.GetComponent<BuildingController>();
            if (currentBuilding != null)
            {
                // 거리 계산
                float distanceToCurrentBuilding = Vector3.Distance(transform.position, currentBuilding.transform.position);

                // 가장 가까운 건물로 업데이트
                if (nearestBuilding == null || distanceToCurrentBuilding < Vector3.Distance(transform.position, nearestBuilding.transform.position))
                {
                    if (nearestBuilding != null && nearestBuilding != currentBuilding)
                    {
                        nearestBuilding.HidePreview(); // 이전 건물 미리보기를 숨김
                    }

                    nearestBuilding = currentBuilding; // 최근 건물로 업데이트
                    nearestBuilding.ShowPreview(); // 새로운 건물 미리보기 표시
                }
            }
        }
    }
}
