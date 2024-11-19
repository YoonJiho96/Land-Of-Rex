using UnityEngine;

public class Billboard : MonoBehaviour
{
    private Transform mainCamera;

    private void Start()
    {
        mainCamera = Camera.main.transform; // 메인 카메라 참조 가져오기
    }

    private void LateUpdate()
    {
        // 카메라를 바라보도록 설정
        transform.LookAt(transform.position + mainCamera.rotation * Vector3.forward, mainCamera.rotation * Vector3.up);
    }
}
