import React from "react";
import { useContext } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import '../css/MessageForm.css';
function MessageForm() {
    const user = useSelector((state) => state.user);

    const [message, setMessage] = useState("");
    const {socket, currentRoom, setMessages, messages, primateMemberMsg} = useContext(AppContext);
    const messageEndRef = useRef(null);

    useEffect(()=>{
        scrollToBottom();
    }, [messages]);

    function getFormattedDate(){
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : '0' + month;

        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + "/" + day + "/" + year;
    }

    function scrollToBottom(){
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const todayDate = getFormattedDate();

    socket.off('room-messages').on('room-messages', (roomMessages) => {
        console.log("room messages", roomMessages);
        setMessages(roomMessages);
    })


    const handleSubmit = (e) => {
        e.preventDefault();
        if(!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit('message-room', roomId, message, user, time, todayDate);
        setMessage("");
      }

  return (
    <>
  <div className="messages-output"> 
  {!user && <div className="alert alert-danger">Please login</div>}

  {user && !primateMemberMsg?._id && <div className="alert alert-info">You are in the {currentRoom} room</div>}
  {user && primateMemberMsg?._id && (
    <>
    <div className="alert alert-info conversation-info">
      <span>
        Your conversation with {primateMemberMsg.name} <img src={primateMemberMsg.picture} className="conversation-profile-picture" />
      </span>
    </div>
    </>
    )}
  {/* if user exist show date and for each date show their message */}
  {user && 
    messages.map(({ _id: date, messageByDate }, idx) => (
      <div key={idx}>
        <p className="alert alert-info text-center message-date-indicator">{date}</p>
        {messageByDate?.map(({ content, time, from: sender}, msgIdx) => (
            <div className={sender?.email == user?.email ? "message" : "incoming-message"} key={msgIdx}>
                <div className="message-inner">
                    <div className="d-flex align-items-center mb-3">
                        <img src={sender.picture} alt="" style={{width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
                        <p className="message-sender">{sender._id == user?._id ? "You" : sender.name}</p>
                    </div>
                    <p className="message-content">{content}</p>
                    <p className="message-timestamp-left">{time}</p>
                </div>
            </div>
        ))}
    </div>
  ))}
     <div ref={messageEndRef}/>
   </div>
    <form onSubmit={handleSubmit}>
        <div className="row mb-3">

            <div className="col-md-11">
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Your message" disabled={!user}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-1">
                <button className="btn btn-primary" type="submit" style={{width: "100%", backgroundColor: "orange"}} disabled={!user}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>

        </div>
    </form>
  </>
  );
}

export default MessageForm;
