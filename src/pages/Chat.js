import React from 'react'
import MessageForm from '../components/MessageForm'
import Sidebar from '../components/Sidebar'

function Chat() {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
           <Sidebar/>
          </div>
          <div className="col-md-8">
           <MessageForm/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
