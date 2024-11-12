using UnityEngine;
using System;
using System.Text;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;

[Serializable]
public class StageInfoRequest
{
    public float clearTime;
    public int earnGold;
    public int spendGold;
    public int deathCount;
    public int score;
    public int stage;
}

[Serializable]
public class RankingData
{
    public string nickname;
    public int score;
    public int ranking;
    public string createdAt;
}

[Serializable]
public class RankingResponse
{
    public bool success;
    public List<RankingData> data;
    public string message;
}

public class RankingManager : MonoBehaviour
{
    private const string BASE_URL = "https://k11e102.p.ssafy.io";
    private const string SUBMIT_SCORE_ENDPOINT = "/api/v1/rankings";
    private const string GET_RANKINGS_ENDPOINT = "/api/v1/rankings/";

    public delegate void OnRankingsUpdated(List<RankingData> rankings);
    public event OnRankingsUpdated onRankingsUpdated;

    // 랭킹 데이터 요청
    public void FetchRankings(int stage)
    {
        StartCoroutine(FetchRankingsCoroutine(stage));
    }

    private IEnumerator FetchRankingsCoroutine(int stage)
    {
        using (UnityWebRequest www = UnityWebRequest.Get(BASE_URL + GET_RANKINGS_ENDPOINT + stage))
        {
            www.SetRequestHeader("Content-Type", "application/json");
            yield return www.SendWebRequest();

            if (www.responseCode == 200)
            {
                RankingResponse response = JsonUtility.FromJson<RankingResponse>(www.downloadHandler.text);
                if (response.success)
                {
                    // 이벤트를 통해 랭킹 데이터를 전달
                    onRankingsUpdated?.Invoke(response.data);
                }
                else
                {
                    Debug.LogError($"Failed to fetch rankings: {response.message}");
                }
            }
            else
            {
                Debug.LogError($"Error fetching rankings: {www.error}");
            }
        }
    }

    // 스테이지 클리어 점수 제출
    public void SubmitScore(StageInfoRequest request)
    {
        StartCoroutine(SubmitScoreCoroutine(request));
    }

    private IEnumerator SubmitScoreCoroutine(StageInfoRequest request)
    {
        string json = JsonUtility.ToJson(request);

        using (UnityWebRequest www = new UnityWebRequest(BASE_URL + SUBMIT_SCORE_ENDPOINT, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.responseCode == 200)
            {
                RankingResponse response = JsonUtility.FromJson<RankingResponse>(www.downloadHandler.text);
                if (response.success)
                {
                    Debug.Log("Score submitted successfully!");
                    // 점수 제출 후 해당 스테이지의 랭킹 업데이트
                    FetchRankings(request.stage);
                }
                else
                {
                    Debug.LogError($"Score submission failed: {response.message}");
                }
            }
            else
            {
                Debug.LogError($"Error submitting score: {www.error}");
            }
        }
    }

    // 게임 클리어 시 호출되는 메서드
    public void OnStageClear(float clearTime, int earnGold, int spendGold, int deathCount, int score, int stage)
    {
        StageInfoRequest request = new StageInfoRequest
        {
            clearTime = clearTime,
            earnGold = earnGold,
            spendGold = spendGold,
            deathCount = deathCount,
            score = score,
            stage = stage
        };

        SubmitScore(request);
    }
}