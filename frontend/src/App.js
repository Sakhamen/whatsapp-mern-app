import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';
import Pusher from 'pusher-js';
import axios from './api';

import { PUSHER_CLUSTER, PUSHER_KEY } from './env';

// STATICS
import './App.css';
import Signin from './components/Signin/Signin';
function App() {
  // STATES
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  // HOOKS
  useEffect(() => {
    axios.get('/sync').then((res) => {
      const data = res.data;
      if (data.success) {
        setMessages(data.data);
      } else {
        alert(data.err);
      }
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (data) => setMessages([...messages, data]));

    // clean ups
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  // FUNCTIONS

  return (
    <div className="app">
      <div className="app__body">
        {user ? (
          <>
            <Sidebar photo={user.photo} />
            <Chat messages={messages} name={user.name} />
          </>
        ) : (
          <Signin setUser={setUser} />
        )}
      </div>
      {/* Chat component */}
    </div>
  );
}

export default App;
