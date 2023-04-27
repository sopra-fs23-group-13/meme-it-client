import React, { useEffect, useState } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import "styles/views/Leaderboard.scss";
import { FaMedal } from 'react-icons/fa';
import MockData from '../../mockData/leaderboardScreenDataMock.json'
import TimerProgressBar from "components/ui/TimerProgressBar";


const Leaderboard = ({ leaderboardData }) => {
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    setLeaderboard(leaderboardData);
  }, [leaderboardData]);

  return (
    <div className="leaderboard-container">
      <ListGroup>
        {/* Neue Zeile für Überschriften hinzufügen */}
        <ListGroup.Item as="li" className="leaderboard-header">
          <div className="leaderboard-rank">Rank</div>
          <div className="leaderboard-name">Playername</div>
          <div className="leaderboard-score">Points</div>
          <div className="leaderboard-meme">Meme</div>
        </ListGroup.Item>

        <TimerProgressBar
          delay={delay}
          now={now}
          max={loadedGameData?.roundDuration * 1000}
          callbackFunc={() => handleNextRound()}
          isPlaying={isPlaying}
          />

        {/* Spielerliste */}
        {leaderboardData.map((player, index) => (
          <ListGroup.Item
            as="li"
            key={index}
            className={`d-flex justify-content-between align-items-center leaderboard-item ${index === 0 ? 'leaderboard-gold' : index === 1 ? 'leaderboard-silver' : index === 2 ? 'leaderboard-bronze' : ''}`}
          >
            <div className="leaderboard-rank">
              {index === 0 && (
                <FaMedal size={32} color="#d7b912" />
              )}
              {index === 1 && (
                <FaMedal size={32} color="#a1a1a1" />
              )}
              {index === 2 && (
                <FaMedal size={32} color="#cd7f32" />
              )}
              {index > 2 && <span className="leaderboard-rank-number">{index + 1}</span>}
            </div>
            <div className="leaderboard-name">{player.username}</div>
            <div className="leaderboard-score">
              <Badge className="leaderboard-score-badge">
                {player.score}
              </Badge>
            </div>
            <div className="leaderboard-meme">{player.meme}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Leaderboard;
