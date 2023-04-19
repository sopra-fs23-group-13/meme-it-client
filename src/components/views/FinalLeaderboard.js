import React, { useEffect, useState } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import "styles/views/FinalLeaderboard.scss";
import { FaMedal } from 'react-icons/fa';
import MockData from '../../mockData/leaderboardScreenDataMock.json'



const FinalLeaderboard = ({ leaderboardData }) => {
  const firstPlace = leaderboardData[0];
  const secondPlace = leaderboardData[1];
  const thirdPlace = leaderboardData[2];

  return (
    <div className="final-leaderboard-container">
      <div className="podium">
        <div className="second-place">
          <span className="rank">2nd</span>
          <span className="username">{secondPlace.username}</span>
          <span className="score">{secondPlace.score} points</span>
        </div>
        <div className="first-place">
          <span className="rank">1st</span>
          <span className="username">{firstPlace.username}</span>
          <span className="score">{firstPlace.score} points</span>
        </div>
        <div className="third-place">
          <span className="rank">3rd</span>
          <span className="username">{thirdPlace.username}</span>
          <span className="score">{thirdPlace.score} points</span>
        </div>
      </div>
      <hr className="separator" />
      <div className="highest-voted-memes">
        <h2>Highest voted memes</h2>
        <div className="highest-voted-memes__item">{leaderboardData[0].score} Votes by {leaderboardData[0].username}</div>
        <div className="highest-voted-memes__item">{leaderboardData[1].score} Votes by {leaderboardData[1].username}</div>
        <div className="highest-voted-memes__item">{leaderboardData[2].score} Votes by {leaderboardData[2].username}</div>
      </div>
      <button className="back-to-main-screen">Back to main screen</button>
    </div>
  );
};

export default FinalLeaderboard;

