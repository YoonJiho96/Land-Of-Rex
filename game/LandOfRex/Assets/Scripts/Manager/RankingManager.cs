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
    public string securityKey;
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
    public RankingData[] data;
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
    //private const string BASE_URL = "http://localhost:8080/api/v1/rankings";
    //private long userId;  // 실제 구현 시에는 로그인 시스템에서 받아와야 함

    public void Initialize(long userId)
    {
        //this.userId = userId;
    }


    // 스테이지 클리어 데이터 전송
    public void SubmitScore(float clearTime, long userId, int earnGold, int spendGold, int deathCount, int score, int stage, string securityKey)
    {
        var request = new StageInfoRequest
        {
            userId = userId,
            clearTime = clearTime,
            earnGold = earnGold,
            spendGold = spendGold,
            deathCount = deathCount,
            score = score,
            stage = stage,
            securityKey = "parkyhAndleehj"
        };

        StartCoroutine(SubmitScoreCoroutine(request));
    }

    // 전체 랭킹 조회
    public void GetRankings(int stage, System.Action<List<RankingData>> onSuccess = null, System.Action<string> onError = null)
    {
        StartCoroutine(GetRankingsCoroutine(stage, onSuccess, onError));
    }

    // 개인 랭킹 조회
    public void GetPersonalRanking(int stage, long userId, System.Action<RankingData> onSuccess = null, System.Action<string> onError = null)
    {
        //Debug.Log($"Requesting personal ranking with userId: {userId}");  // RankingManager에서
        StartCoroutine(GetPersonalRankingCoroutine(stage, userId, onSuccess, onError));
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
                        // 배열을 List로 변환하여 전달
                        var rankingList = new List<RankingData>(response.data);
                        onSuccess?.Invoke(rankingList);
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

    private IEnumerator GetPersonalRankingCoroutine(int stage, long userId, System.Action<RankingData> onSuccess, System.Action<string> onError)
    {
        string url = $"{BASE_URL}/{stage}/personal?userId={userId}";

        //Debug.Log(url);

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
                Debug.LogError($"Error: {www.error}");
                Debug.LogError($"Response Code: {www.responseCode}");
                Debug.LogError($"Response Text: {www.downloadHandler?.text}");
                onError?.Invoke(www.error);
            }
        }
    }
}