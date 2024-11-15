using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Audio;

public class OptionsMenu : MonoBehaviour
{
    public Slider masterVolumeSlider;
    public Slider bgmVolumeSlider;
    public Slider sfxVolumeSlider;

    public GameObject masterVolumeIcon;   // 마스터 볼륨 아이콘 (일반)
    public GameObject masterMuteIcon;     // 마스터 음소거 아이콘
    public GameObject bgmVolumeIcon;      // BGM 볼륨 아이콘 (일반)
    public GameObject bgmMuteIcon;        // BGM 음소거 아이콘
    public GameObject sfxVolumeIcon;      // SFX 볼륨 아이콘 (일반)
    public GameObject sfxMuteIcon;        // SFX 음소거 아이콘

    public AudioMixer audioMixer;   // 마스터 오디오 믹서

    private const string masterVolumeKey = "MasterVolume";
    private const string bgmVolumeKey = "BGMVolume";
    private const string sfxVolumeKey = "SFXVolume";

    private const float minVolume = -40f;
    private const float maxVolume = 0f;
    private const float muteVolume = -80f;

    private float lastMasterVolume = 0f;
    private float lastBgmVolume = 0f;
    private float lastSfxVolume = 0f;

    void Start()
    {
        // 볼륨 값 로드 및 슬라이더 값 적용
        LoadVolume(masterVolumeSlider, masterVolumeKey, "Master", ref lastMasterVolume);
        LoadVolume(bgmVolumeSlider, bgmVolumeKey, "BGM", ref lastBgmVolume);
        LoadVolume(sfxVolumeSlider, sfxVolumeKey, "SFX", ref lastSfxVolume);

        // 슬라이더 값 변경시마다 볼륨 설정
        masterVolumeSlider.onValueChanged.AddListener(delegate { SetVolume(masterVolumeSlider, masterVolumeKey, "Master", ref lastMasterVolume); });
        bgmVolumeSlider.onValueChanged.AddListener(delegate { SetVolume(bgmVolumeSlider, bgmVolumeKey, "BGM", ref lastBgmVolume); });
        sfxVolumeSlider.onValueChanged.AddListener(delegate { SetVolume(sfxVolumeSlider, sfxVolumeKey, "SFX", ref lastSfxVolume); });

        // 아이콘 초기화
        UpdateMuteIcons(masterVolumeSlider, masterVolumeIcon, masterMuteIcon);
        UpdateMuteIcons(bgmVolumeSlider, bgmVolumeIcon, bgmMuteIcon);
        UpdateMuteIcons(sfxVolumeSlider, sfxVolumeIcon, sfxMuteIcon);

        // 음소거 버튼 클릭 리스너 추가
        masterVolumeIcon.GetComponent<Button>().onClick.AddListener(delegate { ToggleMute(masterVolumeSlider, masterVolumeKey, "Master", masterVolumeIcon, masterMuteIcon, ref lastMasterVolume); });
        masterMuteIcon.GetComponent<Button>().onClick.AddListener(delegate { ToggleMute(masterVolumeSlider, masterVolumeKey, "Master", masterVolumeIcon, masterMuteIcon, ref lastMasterVolume); });

        bgmVolumeIcon.GetComponent<Button>().onClick.AddListener(delegate { ToggleMute(bgmVolumeSlider, bgmVolumeKey, "BGM", bgmVolumeIcon, bgmMuteIcon, ref lastBgmVolume); });
        bgmMuteIcon.GetComponent<Button>().onClick.AddListener(delegate { ToggleMute(bgmVolumeSlider, bgmVolumeKey, "BGM", bgmVolumeIcon, bgmMuteIcon, ref lastBgmVolume); });

        sfxVolumeIcon.GetComponent<Button>().onClick.AddListener(delegate { ToggleMute(sfxVolumeSlider, sfxVolumeKey, "SFX", sfxVolumeIcon, sfxMuteIcon, ref lastSfxVolume); });
        sfxMuteIcon.GetComponent<Button>().onClick.AddListener(delegate { ToggleMute(sfxVolumeSlider, sfxVolumeKey, "SFX", sfxVolumeIcon, sfxMuteIcon, ref lastSfxVolume); });
    }

    // 볼륨 로드 및 슬라이더 값 설정
    void LoadVolume(Slider slider, string key, string mixerParam, ref float lastVolume)
    {
        if (PlayerPrefs.HasKey(key))
        {
            float savedVolume = PlayerPrefs.GetFloat(key);
            slider.value = ConvertToLinear(savedVolume);
            SetVolume(slider, key, mixerParam, ref lastVolume);
        }
        else
        {
            float currentVolume;
            audioMixer.GetFloat(mixerParam, out currentVolume);
            slider.value = ConvertToLinear(currentVolume);
            lastVolume = currentVolume;
        }
    }

    // 볼륨 설정 함수
    void SetVolume(Slider slider, string key, string mixerParam, ref float lastVolume)
    {
        float volume = ConvertToLogarithmic(slider.value);
        audioMixer.SetFloat(mixerParam, volume);
        PlayerPrefs.SetFloat(key, volume);
        PlayerPrefs.Save();

        // 음소거 상태가 아니라면 마지막 볼륨을 저장
        if (volume != muteVolume)
        {
            lastVolume = volume;
        }

        // 아이콘 업데이트
        UpdateMuteIcons(slider, GetVolumeIconByParam(mixerParam), GetMuteIconByParam(mixerParam));
    }

    // 음소거 상태 전환 함수
    void ToggleMute(Slider slider, string key, string mixerParam, GameObject volumeIcon, GameObject muteIcon, ref float lastVolume)
    {
        if (slider.value > 0f)
        {
            // 현재 볼륨이 0이 아니면 음소거 (볼륨을 0으로 설정)
            audioMixer.SetFloat(mixerParam, muteVolume);
            slider.value = 0f;
        }
        else
        {
            // 음소거 해제 (이전 볼륨으로 복원)
            slider.value = ConvertToLinear(lastVolume);
            audioMixer.SetFloat(mixerParam, lastVolume);
        }

        // 아이콘 업데이트
        UpdateMuteIcons(slider, volumeIcon, muteIcon);

        // 변경 사항 저장
        SetVolume(slider, key, mixerParam, ref lastVolume);
    }

    // 음소거 상태에 따라 아이콘 업데이트 (두 개의 아이콘을 활성화/비활성화)
    void UpdateMuteIcons(Slider slider, GameObject volumeIcon, GameObject muteIcon)
    {
        if (slider.value == 0f)
        {
            volumeIcon.SetActive(false);
            muteIcon.SetActive(true);
        }
        else
        {
            volumeIcon.SetActive(true);
            muteIcon.SetActive(false);
        }
    }

    // 믹서 파라미터에 따른 볼륨 아이콘 가져오기
    GameObject GetVolumeIconByParam(string mixerParam)
    {
        if (mixerParam == "Master")
            return masterVolumeIcon;
        else if (mixerParam == "BGM")
            return bgmVolumeIcon;
        else
            return sfxVolumeIcon;
    }

    // 믹서 파라미터에 따른 음소거 아이콘 가져오기
    GameObject GetMuteIconByParam(string mixerParam)
    {
        if (mixerParam == "Master")
            return masterMuteIcon;
        else if (mixerParam == "BGM")
            return bgmMuteIcon;
        else
            return sfxMuteIcon;
    }

    // 로그 변환 함수
    private float ConvertToLogarithmic(float linearValue)
    {
        return linearValue <= 0.0001f ? muteVolume : Mathf.Lerp(minVolume, maxVolume, linearValue);
    }

    private float ConvertToLinear(float mixerValue)
    {
        return mixerValue <= muteVolume ? 0f : Mathf.InverseLerp(minVolume, maxVolume, mixerValue);
    }
}
