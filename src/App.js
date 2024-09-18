import './App.scss';
import React, { useState } from 'react';
import Login from './pages/login';
import Message from './pages/message';
import { useSelector } from 'react-redux';

const App = () => {
  const [userId, setUserId] = useState(useSelector(state=>state.user.user.userId));
  const handleSubmit = () => {
    console.log("This is switch")
    setUserId("23123")
  }
  const handleLogout = () => {
    setUserId(null);
  }
  return (
    <div className="App">
      {
        !!userId ?
          (
            <Message onLogout={handleLogout}/>
          )
            :
          (
                <Login onSubmitt={handleSubmit}  />
          )
      }
    </div>
  );
}

export default App;
