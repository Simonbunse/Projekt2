import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToContacts = () => {
    navigate("/contacts");
  };

  const goToClassrooms = () => {
    navigate("/classrooms");
  };

  const goToModuls = () => {
    navigate("/moduls");
  };

  const goToCourses = () => {
    navigate("/courses");
  };

  return (
    <div>
      <div>
        <h2>Studieretninger</h2>
        <button onClick={goToContacts}>Studerende</button>
      </div>
      <div>
        <h2>Management</h2>
        <button onClick={goToClassrooms} style={{ marginRight: "20px"}}>Go To Classrooms</button>
        <button onClick={goToModuls}>Go To Moduls</button>
        <button onClick={goToCourses} style={{marginLeft: "20px" }}>Go To Courses</button>
      </div>
    </div>
  );
}

export default Home;
