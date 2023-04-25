import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ListGroup, Badge } from "react-bootstrap";
import "styles/views/FinalLeaderboard.scss";
import MockData from '../../mockData/leaderboardScreenDataMock.json'
import { FaMedal } from 'react-icons/fa';
import {api, handleError} from "../../helpers/api";



const FinalLeaderboard = ({ leaderboardData }) => {

  const getLeaderboardData = async () => {
    try {
      const response = await api.get('/ratings');
      const ratings = response.data;
      const users = {};
      for (let rating of ratings) {
        const userId = rating.user.id;
        const points = rating.rating;
        if (!users[userId]) {
          users[userId] = { username: rating.user.username, score: 0 };
        }
        users[userId].score += points;
      }
      const leaderboardData = Object.values(users)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      return leaderboardData;
    } catch {
      alert("Couldn't fetch ratings");
      return [];
    }
  };

  const [leaderboardData, setLeaderboardData] = useState([]);


  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const data = await getLeaderboardData();
      setLeaderboardData(data);
    };
    fetchLeaderboardData();
  }, []);

  const firstPlace = leaderboardData[0];
  const secondPlace = leaderboardData[1];
  const thirdPlace = leaderboardData[2];

  const history = useHistory();
  const backToMainScreen = () => {
    history.push('/');
  };


  return (
    <div className="final-leaderboard-container">
      <div className="podium">
        <div className="second-place">
          <span className="rank">2nd</span>
          <span className="username">{secondPlace.username}</span>
          <span className="score">{secondPlace.score} points</span>
        </div>
        <div className="first-place">
        <FaMedal size={32} color="black" />
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
      <button className="back-to-main-screen" onClick={backToMainScreen}>Back to main screen</button>
    </div>
  );
};

export default FinalLeaderboard;

