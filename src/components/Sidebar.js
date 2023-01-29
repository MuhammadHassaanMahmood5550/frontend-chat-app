import React, { useEffect } from "react";
import { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import {addNotification, resetNotifications} from "../features/userSlice"
import "../css/sidebar.css"
function Sidebar() {
  // const rooms = ["first room", "second room", "third room"];
  const user = useSelector((state) => state.user);
 // console.log("main user=", user);
  const dispatch = useDispatch();
  const {socket, currentRoom, setCurrentRoom, members, 
    setMembers, messages, setMessages, primateMemberMsg, setPrimateMemberMsg, 
    rooms, setRooms,} = useContext(AppContext);

   function joinRoom(room, isPublic = true){
      if(!user){
        return alert("Please login");
      }

      socket.emit("join-room", room, currentRoom);
      setCurrentRoom(room);

      if(isPublic){
        setPrimateMemberMsg(null);
      }

      //dispatch for notifications
      dispatch(resetNotifications(room));
    }

          //we listen for an event
          socket.off('notifications').on("notifications", (room) => {
            if(currentRoom != room) dispatch(addNotification(room));
          })



    useEffect(() => {
      if(user){
        setCurrentRoom('general');
        getRooms();
        socket.emit("join-room", "general");
        socket.emit("new-user");
      }
    }, [])

  //we should on and off so it refresh otherwise it create error
  socket.off('new-user').on('new-user', (payload) => {
   // console.log("sidebar payload", payload);
    setMembers(payload);
  });
  
  if(!user){
    return <></>
  }

  function getRooms(){
    fetch('http://localhost:5001/rooms')
    .then((res) => res.json())
    .then((data) => setRooms(data));
  }

  function orderIds(id1, id2){
    if(id1 > id2){
      return id1 + "_" + id2;
    }else{
      return id2 + "_" + id1;
    }
  }

  function handlePrivateMemberMsg(member){
    setPrimateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);

  }
  return (
    <>
      <h2>Available rooms</h2>
      <ul class="list-group">
        {rooms.map((room, idx) => (
            <li className={room == currentRoom ? "list-group-item active" : "list-group-item"} key={idx} onClick={() => joinRoom(room)} active={room == currentRoom} style={{cursor: "pointer", display: 'flex', justifyContent: 'space-between'}}>
              {room} {currentRoom !== room && <span className="badge rounded-pill bg-primary">{user.newMessage[room]}</span>}
              </li>
        ))}
        <h2>Members</h2>
        {members.map((member) =>  (
          <ListGroup.Item KEY={member.id} style={{cursor: "pointer"}} className={primateMemberMsg?._id == member?._id ? "active" : ""} 
          disabled={member._id === user._id}
          onClick={() => handlePrivateMemberMsg(member)}
          >
            <div className="row">
              <div className="col-sm-2 member-status">
                <img src={member.picture} className="member-status-img" alt="" />
                {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
              </div>
              <div className="col-sm-9">
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status == "offline" && " (Offline)"}
              </div>
              <div className="col-sm-1">
                <span className="badge rounded-pill bg-primary">{user.newMessage[orderIds(member._id, user._id)]}</span>
              </div>
            </div>
          </ListGroup.Item>
        ))}

      </ul>
    </>
  );
}

export default Sidebar;
