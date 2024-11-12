import React, { useState, useEffect } from 'react';
import './RankingSection.css';
import fetchRankingList from '../../../apis/apiRankingList';
import fetchRankingList2 from '../../../apis/apiRankingList2';

const RankingSection = React.forwardRef((props, ref) => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStage, setSelectedStage] = useState(1);

  const getRankingData = async (fetchFunction) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchFunction();
      setTopPlayers(data);
    } catch (err) {
      setError('랭킹 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRankingData(fetchRankingList);
  }, []);

  const handleStage1Click = () => {
    setSelectedStage(1);
    getRankingData(fetchRankingList);
  };

  const handleStage2Click = () => {
    setSelectedStage(2);
    getRankingData(fetchRankingList2);
  };

  return (
    <section ref={ref} className="ranking-section">
      <div className="ranking-content">
        <h2>랭킹 대시보드</h2>

        <div className="stage-buttons">
          <button
            className={`stage-button ${selectedStage === 1 ? 'active' : ''}`}
            onClick={handleStage1Click}
          >
            Stage1
          </button>
          <button
            className={`stage-button ${selectedStage === 2 ? 'active' : ''}`}
            onClick={handleStage2Click}
          >
            Stage2
          </button>
        </div>

        {loading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <table className="ranking-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>이름</th>
                <th>점수</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.length === 0 ? (
                <tr>
                  <td colSpan="4">아직 랭킹 데이터가 없습니다.</td>
                </tr>
              ) : (
                topPlayers.slice(0, 5).map((player, index) => (
                  <tr key={index}>
                    <td>{player.ranking}</td>
                    <td>{player.nickname}</td>
                    <td>{player.score}</td>
                    <td>{player.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
});

export default RankingSection;
