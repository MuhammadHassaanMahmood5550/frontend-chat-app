import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Singup from './pages/Singup';
import Chat from './pages/Chat';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket} from './context/appContext';

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [primateMemberMsg, setPrimateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const user = useSelector((state) => state.user);
  return (
    <div className="App">
    <AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, 
      setMembers, messages, setMessages, primateMemberMsg, setPrimateMemberMsg, 
      rooms, setRooms, newMessages, setNewMessages }}>
      <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>
        {!user && 
        <> 
        <Route path="/login" element={<Login />}>
        </Route>
        <Route path="/signup" element={<Singup />}>
        </Route>
        </>
        }
        <Route path="/chat" element={<Chat />}>
        </Route>
      </Routes>
      </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
