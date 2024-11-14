using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public AudioSource bgmSource; // 배경음 전용 AudioSource
    public AudioSource sfxSource; // 효과음 전용 AudioSource

    public AudioClip defaultBGM; // 기본 배경음 클립
    public AudioClip[] bgmClips; // 상황별 배경음 클립들
    public AudioClip[] sfxClips; // 효과음 클립들

    private bool isPlayingDefaultBGM = true; // 기본 배경음 상태 확인

    void Start()
    {
        PlayDefaultBGM(); // 시작 시 기본 배경음 재생
    }

    // 기본 배경음을 재생하는 메서드
    public void PlayDefaultBGM()
    {
        if (defaultBGM != null)
        {
            bgmSource.clip = defaultBGM;
            bgmSource.loop = true;
            bgmSource.Play();
            isPlayingDefaultBGM = true;
        }
    }

    // 상황에 맞는 배경음으로 전환하는 메서드
    public void ChangeBGM(int clipIndex)
    {
        if (clipIndex >= 0 && clipIndex < bgmClips.Length)
        {
            bgmSource.clip = bgmClips[clipIndex];
            bgmSource.loop = true;
            bgmSource.Play();
            isPlayingDefaultBGM = false;
        }
    }

    // 상황이 끝나고 기본 배경음으로 돌아가는 메서드
    public void ResetToDefaultBGM()
    {
        if (!isPlayingDefaultBGM)
        {
            PlayDefaultBGM();
        }
    }

    // 효과음 재생 메서드
    public void PlaySFX(int clipIndex)
    {
        if (clipIndex >= 0 && clipIndex < sfxClips.Length)
        {
            sfxSource.PlayOneShot(sfxClips[clipIndex]);
        }
    }
}