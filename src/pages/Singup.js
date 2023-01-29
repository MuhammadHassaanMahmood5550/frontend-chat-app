import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignupUserMutation } from '../services/appApi';
import {} from '../'


function Singup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const [signpUser, { isLoading, error }] = useSignupUserMutation();

    //image upload states
    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    //my functions
    
const validateImg = (e) => {
  console.log('====================================');
  console.log("e=", e , "e.target", e.target.files[0]);
  console.log('====================================');
  const file = e.target.files[0];
  if(file.size > 1048576){
   return alert("Max file size is 1mb");
  }else{
   setImage(file);
   setImagePreview(URL.createObjectURL(file));
  }
}

const uploadImage = async () => {
  const data = new FormData();
  data.append('file', image);
  //preset tell that its accually you who is uploading image to cloudinary, for preset we have to create it 
  data.append('upload_preset', 'e3fna7zo');
   try{
  setUploadingImg(true);
  let res = await fetch('https://api.cloudinary.com/v1_1/ddnfdcsqi/image/upload', {
    method: 'post',
    body: data
  });
  const urlData = await res.json();
  setUploadingImg(false);
  return urlData.url
 }catch(err){
    setUploadingImg(false);
  console.log("upload image to cloudinary error", err);
 }
}

const handleSignup = async (e) => {
 e.preventDefault();
 if(!image) return alert("Please upload your profile picture");
 const url = await uploadImage(image);
 console.log("the url", url);
 //sign up user
 signpUser({name, email, password, picture: url}).then(({data}) => {
  if(data){
    console.log("signup user data", data);
    navigate("/Chat");
  }
 })
}

  return (
 <div className="main_signup">
   <div className="container">
      <div className="row  align-items-center ">
        <div className="col-md-5 mx-auto">
          <form onSubmit={ (e) => handleSignup(e)}>
            <h1 className='text-center'>Create account</h1>

            <div className="img_container text-center ">
              <img src={imagePreview || require('../images/bot.jpeg')} className="rounded-circle border border-2 border-secondary-subtle" style={{height: 130, width: 130}} alt="" />
              {/* <i className='fas fa-plus-circle add_picture_icon text-success'></i> */}
              {/* <input type="file" id="image_upload"  accept='image/png, image/jpeg' onClick={(e) => validateImg()} /> */}
              <label for="file-input" style={{cursor: "pointer"}}>
              <i className='fas fa-plus-circle add_picture_icon text-success'></i>
                <input id="file-input" type="file" accept='image/png, image/jpeg' onChange={(e) => validateImg(e)} style={{visibility: 'hidden', position: 'absolute'}} />
              </label>

            </div>



          <div className="form-group">
              <label htmlFor="">Name</label>
              <input type="text" className='form-control' placeholder='Your name' required
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="">Email address</label>
              <input type="email" className='form-control' placeholder='user@example.com' required
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
              <small className='text-muted pb-0 mb-0'>we'll never share your email with anyone else.</small>
            </div>
            <div className="form-group mt-2">
              <label htmlFor="">Password</label>
              <input type="password" className='form-control' required
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button className='btn btn-primary mt-3' type='submit'>
              {uploadingImg ? "Signing you up..." : "Sign up"}
            </button>
            <p className='mt-3'>Already have an account ? <Link to="/login">Login</Link> </p>
          </form>
        </div>
        <div className="col-md-5 login_bg"></div>
      </div>

    </div>
 </div>
  )
}

export default Singup
