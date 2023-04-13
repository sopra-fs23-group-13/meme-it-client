import React, { useEffect, useState } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import "styles/views/Leaderboard.scss";
import MockData from '../../mockData/leaderboardScreenDataMock.json'


const Leaderboard = ({ leaderboardData }) => {

  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    setLeaderboard(leaderboardData);
  }, [leaderboardData]);

  return (
    <ListGroup>
      {leaderboard &&
        leaderboard.map((player, index) => (
          <ListGroup.Item
            as="li"
            key={index}
            className="d-flex justify-content-between align-items-center leaderboard-item"
          >
            <div className="leaderboard-rank">
              {index === 0 && (
                <span className="leaderboard-gold">#1</span>
              )}
              {index === 1 && (
                <span className="leaderboard-silver">#2</span>
              )}
              {index === 2 && (
                <span className="leaderboard-bronze">#3</span>
              )}
              {index > 2 && <span className="leaderboard-rank-number">{index + 1}</span>}
            </div>
            <div className="leaderboard-name">{player.username}</div>
            <div className="leaderboard-score">
              <Badge className="leaderboard-score-badge">
                {player.score}
              </Badge>
            </div>
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
};


export default Leaderboard;
