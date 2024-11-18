using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

public class AssignAudioMixer : MonoBehaviour
{
    public AudioMixerGroup masterMixerGroup; // Master 오디오 믹서 그룹
    public AudioMixerGroup bgmMixerGroup;    // BGM 오디오 믹서 그룹
    public AudioMixerGroup sfxMixerGroup;    // SFX 오디오 믹서 그룹
    public float defaultVolume = 0.7f;       // 통일할 기본 볼륨 값
    public float defaultPitch = 1.0f;        // 통일할 기본 피치 값

    void Start()
    {
        if (masterMixerGroup == null || bgmMixerGroup == null || sfxMixerGroup == null)
        {
            Debug.LogError("오디오 믹서 그룹이 지정되지 않았습니다!");
            return;
        }

        // 씬 내 모든 게임 오브젝트 탐색 (비활성화된 오브젝트 포함)
        GameObject[] allGameObjects = GetAllGameObjectsInScene();

        foreach (GameObject obj in allGameObjects)
        {
            AudioSource audioSource = obj.GetComponent<AudioSource>();
            if (audioSource != null)
            {
                // BGM 태그를 가진 오브젝트에는 BGM 오디오 믹서 그룹 할당
                if (obj.CompareTag("BGM"))
                {
                    if (audioSource.outputAudioMixerGroup != bgmMixerGroup)
                    {
                        audioSource.outputAudioMixerGroup = bgmMixerGroup;
                        Debug.Log($"AudioSource '{audioSource.gameObject.name}'에 BGM 그룹이 할당되었습니다.");
                    }
                }
                // 그 외의 오브젝트에는 SFX 오디오 믹서 그룹 할당
                else
                {
                    if (audioSource.outputAudioMixerGroup != sfxMixerGroup)
                    {
                        audioSource.outputAudioMixerGroup = sfxMixerGroup;
                        Debug.Log($"AudioSource '{audioSource.gameObject.name}'에 SFX 그룹이 할당되었습니다.");
                    }
                }

                // 기본 볼륨 및 피치 통일 (spatialBlend는 유지)
                audioSource.volume = defaultVolume;
                audioSource.pitch = defaultPitch;

                Debug.Log($"AudioSource '{audioSource.gameObject.name}'의 볼륨과 피치가 통일되었습니다.");
            }
        }
    }

    // 씬 내 모든 게임 오브젝트를 재귀적으로 찾는 함수
    GameObject[] GetAllGameObjectsInScene()
    {
        List<GameObject> allObjects = new List<GameObject>();
        foreach (GameObject root in GetRootObjectsInScene())
        {
            AddChildObjectsToList(root.transform, allObjects);
        }
        return allObjects.ToArray();
    }

    // 씬 내 루트 오브젝트들을 찾는 함수
    GameObject[] GetRootObjectsInScene()
    {
        List<GameObject> rootObjects = new List<GameObject>();
        foreach (GameObject root in UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects())
        {
            rootObjects.Add(root);
        }
        return rootObjects.ToArray();
    }

    // 자식 오브젝트들을 재귀적으로 탐색해서 리스트에 추가하는 함수
    void AddChildObjectsToList(Transform parent, List<GameObject> allObjects)
    {
        allObjects.Add(parent.gameObject);
        foreach (Transform child in parent)
        {
            AddChildObjectsToList(child, allObjects);
        }
    }
}
