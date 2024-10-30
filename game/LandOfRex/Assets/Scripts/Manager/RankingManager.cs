using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Collections;
using System.Collections.Generic;


    // 랭킹 데이터 구조
    [Serializable]
    public class RankingData
    {
        public string nickname; // 사용자 닉네임
        public int score; // 총 점수
        public string created_at; // 랭킹 찍은 날짜
    }

    // 랭킹 응답 데이터
    [Serializable]
    public class RankingResponse
    {
        public bool success; // 성공 여부
        public List<RankingData> data;
        public string message; // reponse massage
    }

    // 게임 결과 데이터
    [Serializable]
    public class GameResultData
    {
        public float clear_time; // 클리어 시간. HH:MM:ss
        public int earn_gold; // 벌어들인 골드
        public int spend_gold; // 사용한 골드
        public int death_count; // 플레이어가 죽은 횟수
        public int score; // 위 요소들을 합산한 총 점수

        public GameResultData(float clearTime, int earnGold, int spendGold, int deathCount, int finalScore)
        {
            this.clear_time = clearTime;
            this.earn_gold = earnGold;
            this.spend_gold = spendGold;
            this.death_count = deathCount;
            this.score = finalScore;
        }
    }


public class RankingManager : MonoBehaviour
{
    // api 주소
    private string baseUrl = "https://your-backend-url.com/api/";

    // UI 관련
    [Header("UI References")]
    public Transform rankingContentParent; // 랭킹 항목들이 표시될 부모 Transform
    public GameObject rankingItemPrefab;   // 각 랭킹 항목의 프리팹

    // 최종 점수 계산
    public int CalculateFinalScore(float clearTime, int earnGold, int spendGold, int deathCount)
    {
        // 점수 계산 로직 (예시) -> 차후 수정
        int timeScore = Mathf.Max(10000 - Mathf.FloorToInt(clearTime) * 10, 0);
        int goldScore = (earnGold - spendGold) * 5;
        int deathPenalty = deathCount * -100;

        return timeScore + goldScore + deathPenalty;
    }

    // 게임 결과 전송
    public IEnumerator SendGameResult(float clearTime, int earnGold, int spendGold, int deathCount)
    {
        if (string.IsNullOrEmpty(UserData.Instance.token))
        {
            Debug.LogError("User not logged in!");
            yield break;
        }

        int finalScore = CalculateFinalScore(clearTime, earnGold, spendGold, deathCount);
        GameResultData resultData = new GameResultData(clearTime, earnGold, spendGold, deathCount, finalScore);
        string jsonData = JsonUtility.ToJson(resultData);

        // POST 방식으로 백엔드에 데이터 전송
        /* 예시
         * 
         *  POST https://your-backend-url.com/api/game-result
            Content-Type: application/json
            Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

            {
                "clear_time": 1234.5,
                "earn_gold": 1000,
                "spend_gold": 500,
                "death_count": 3,
                "score": 8500
            }
        
           // 성공시
            HTTP/1.1 200 OK
            {
                "success": true,
                "message": "Game result saved successfully"
            }

            // 실패시
            HTTP/1.1 400 Bad Request
            {
                "success": false,
                "message": "Invalid data format"
            }

         * 
         * 
         */
        using (UnityWebRequest www = new UnityWebRequest(baseUrl + "game-result", "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");
            www.SetRequestHeader("Authorization", "Bearer " + UserData.Instance.token);

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Game result sent successfully");
                // 결과 전송 후 랭킹 업데이트
                yield return StartCoroutine(GetRankings());
            }
            else
            {
                Debug.LogError("Failed to send game result: " + www.error);
            }
        }
        
    }

    // 랭킹 조회
    public IEnumerator GetRankings()
    {
        // 랭킹 데이터 가져 올 api 주소
        using (UnityWebRequest www = UnityWebRequest.Get(baseUrl + "rankings"))
        {
            www.SetRequestHeader("Content-Type", "application/json");
            if (!string.IsNullOrEmpty(UserData.Instance.token))
            {
                www.SetRequestHeader("Authorization", "Bearer " + UserData.Instance.token);
            }

            yield return www.SendWebRequest();

            // 응답 처리
            if (www.result == UnityWebRequest.Result.Success)
            {
                RankingResponse response = JsonUtility.FromJson<RankingResponse>(www.downloadHandler.text);
                if (response.success)
                {
                    UpdateRankingUI(response.data);
                }
                else
                {
                    Debug.LogError("Failed to get rankings: " + response.message);
                }
            }
            else
            {
                Debug.LogError("Error getting rankings: " + www.error);
            }
        }
    }

    // 랭킹 UI 업데이트
    private void UpdateRankingUI(List<RankingData> rankings)
    {
        // 기존 랭킹 항목들 제거
        foreach (Transform child in rankingContentParent)
        {
            Destroy(child.gameObject);
        }

        // 새로운 랭킹 항목들 생성
        for (int i = 0; i < rankings.Count; i++)
        {
            GameObject rankingItem = Instantiate(rankingItemPrefab, rankingContentParent);
            RankingItemUI itemUI = rankingItem.GetComponent<RankingItemUI>();

            if (itemUI != null)
            {
                itemUI.SetRankingData(i + 1, rankings[i]);
            }
        }
    }
}




// 랭킹 항목 UI 컴포넌트
public class RankingItemUI : MonoBehaviour
{
    public Text rankText; // 순위
    public Text nicknameText; // 닉네임
    public Text scoreText; // 점수
    public Text dateText; // 날짜

    public void SetRankingData(int rank, RankingData data)
    {
        rankText.text = rank.ToString();
        nicknameText.text = data.nickname;
        scoreText.text = data.score.ToString("N0");
        dateText.text = DateTime.Parse(data.created_at).ToString("yyyy-MM-dd HH:mm");
    }
}