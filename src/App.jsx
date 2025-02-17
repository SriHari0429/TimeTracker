import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png"; // Ensure the logo file is placed in the correct path
import "./styles.css";


const App = () => {
  const [team, setTeam] = useState([]);
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const addMember = () => {
    if (newMember.trim() !== "") {
      setTeam((prevTeam) => [
        ...prevTeam,
        { name: newMember, timeLeft: 65, warned: false, lastUpdated: Date.now() },
      ]);
      setNewMember("");
    }
  };

  const updateMember = (index) => {
    setTeam((prevTeam) =>
      prevTeam.map((member, i) =>
        i === index ? { ...member, timeLeft: 65, warned: false, lastUpdated: Date.now() } : member
      )
    );
  };

  const deleteMember = (index) => {
    setTeam((prevTeam) => prevTeam.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTeam((prevTeam) =>
        prevTeam.map((member) => {
          const newTimeLeft = Math.max(0, member.timeLeft - 1);
  
          // Check for 1 minute left and only trigger once
          if (newTimeLeft === 60 && !member.warned) {
            playSound();
            showNotification(`${member.name} has only 1 minute left!`);
            return { ...member, timeLeft: newTimeLeft, warned: true }; // Set warned to true to prevent further notifications
          }
  
          // Check for time reached 0 and only trigger once
          if (newTimeLeft === 0 && member.timeLeft > 0) {
            playSound();
            showNotification(`${member.name} needs an update NOW!`);
          }
  
          return { ...member, timeLeft: newTimeLeft };
        })
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  
  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⏳ Reminder", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
      });

      playSound();
    }
  };

  const playSound = () => {
    const audio = new Audio("notification.wav");
    audio.play();
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Company Logo" className="logo" />
        <h1>🕒 Team Update Tracker</h1>
      </div>

      {/* Input Section */}
      <div className="input-container">
        <input
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Enter Your Buddies Names"
        />
        <button onClick={addMember}>➕ Add</button>
      </div>

      <hr />

      {/* Team List */}
      <h2>Update Team Members</h2>
      {team.length === 0 ? (
        <p>No team members added yet.</p>
      ) : (
        <ul className="team-list">
          {team.map((member, index) => (
            <li key={index} className="team-member">
              <span>
                {member.name} -{" "}
                <span className="time-left">
                  {Math.floor(member.timeLeft / 60)}:
                  {(member.timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </span>
              <div className="buttons">
                <button onClick={() => updateMember(index)} className="update-btn">
                  ✅ Update
                </button>
                <button onClick={() => deleteMember(index)} className="delete-btn">
                  ❌ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
