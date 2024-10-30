import React from 'react';
import './RankingSection.css';

const RankingSection = React.forwardRef((props, ref) => {
  const topPlayers = [
    { rank: 1, name: 'PlayerOne', score: 12000 },
    { rank: 2, name: 'PlayerTwo', score: 11000 },
  ];

  return (
    <section ref={ref} className="ranking-section">
      <div className="ranking-content">
        <h2>랭킹 대시보드</h2>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player) => (
              <tr key={player.rank}>
                <td>{player.rank}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="stats">
          <h3>게임 통계</h3>
          <p>현재 총 참여자 수: 10,000명</p>
          <p>일일 평균 접속자 수: 500명</p>
        </div>
      </div>
    </section>
  );
});

export default RankingSection;
