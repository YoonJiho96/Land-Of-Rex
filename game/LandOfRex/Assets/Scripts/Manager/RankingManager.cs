using UnityEngine;
using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.Networking;

[Serializable]
public class StageInfoRequest
{
    public long userId;
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

[Serializable]
public class PersonalRankingResponse
{
    public bool success;
    public RankingData data;
    public string message;
}

public class RankingManager : MonoBehaviour
{
    private const string BASE_URL = "https://k11e102.p.ssafy.io/api/v1/rankings";
    private long userId;  // 실제 구현 시에는 로그인 시스템에서 받아와야 함

    public void Initialize(long userId)
    {
        this.userId = userId;
    }

    // 스테이지 클리어 데이터 전송
    public void SubmitScore(float clearTime, int earnGold, int spendGold, int deathCount, int score, int stage)
    {
        var request = new StageInfoRequest
        {
            userId = userId,
            clearTime = clearTime,
            earnGold = earnGold,
            spendGold = spendGold,
            deathCount = deathCount,
            score = score,
            stage = stage
        };

        StartCoroutine(SubmitScoreCoroutine(request));
    }

    // 전체 랭킹 조회
    public void GetRankings(int stage, System.Action<List<RankingData>> onSuccess = null, System.Action<string> onError = null)
    {
        StartCoroutine(GetRankingsCoroutine(stage, onSuccess, onError));
    }

    // 개인 랭킹 조회
    public void GetPersonalRanking(int stage, System.Action<RankingData> onSuccess = null, System.Action<string> onError = null)
    {
        StartCoroutine(GetPersonalRankingCoroutine(stage, onSuccess, onError));
    }

    private IEnumerator SubmitScoreCoroutine(StageInfoRequest request)
    {
        string jsonData = JsonUtility.ToJson(request);

        using (UnityWebRequest www = new UnityWebRequest(BASE_URL, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<RankingResponse>(www.downloadHandler.text);
                Debug.Log($"Score submitted successfully: {response.message}");
            }
            else
            {
                Debug.LogError($"Error submitting score: {www.error}");
            }
        }
    }

    private IEnumerator GetRankingsCoroutine(int stage, System.Action<List<RankingData>> onSuccess, System.Action<string> onError)
    {
        string url = $"{BASE_URL}/{stage}";

        using (UnityWebRequest www = UnityWebRequest.Get(url))
        {
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<RankingResponse>(www.downloadHandler.text);
                if (response.success)
                {
                    onSuccess?.Invoke(response.data);
                }
                else
                {
                    onError?.Invoke(response.message);
                }
            }
            else
            {
                onError?.Invoke(www.error);
            }
        }
    }

    private IEnumerator GetPersonalRankingCoroutine(int stage, System.Action<RankingData> onSuccess, System.Action<string> onError)
    {
        string url = $"{BASE_URL}/{stage}/personal?userId={userId}";

        using (UnityWebRequest www = UnityWebRequest.Get(url))
        {
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<PersonalRankingResponse>(www.downloadHandler.text);
                if (response.success && response.data != null)
                {
                    onSuccess?.Invoke(response.data);
                }
                else
                {
                    onError?.Invoke(response.message);
                }
            }
            else
            {
                onError?.Invoke(www.error);
            }
        }
    }
}