import { signOut } from "firebase/auth";
import { logout } from "../../redux/features/user-profile-slice"
import { Card } from "../Card";
import axios from "axios";
import { auth } from "../services/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const useHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuil = async(write, reset, e) => {
    e.preventDefault();
    reset();
    try{
     await axios.patch('/user', {
         uid: auth.currentUser.uid, 
         quils: write
        });
    }
    catch(err){ console.log(err); }
  };

  const logOut = () => {
    signOut(auth);
    dispatch(logout());
    navigate('/');
  };

  const quilMap = (quil) => {
    return quil?.map(item => <Card key = {item._id}
      write = {item.quil}
      name = {item.displayname}
      profileImg = {item.profileUrl}
      delete = {async() => {
          axios.delete(`/user/quil/${item._id}`)
      }}
      like = {item.likes.length}
      unlike = {item.unlikes.length}
      likeMe = { async() => {
          await axios.patch(`/user/quil/like/${item._id}`, {
              uid: auth.currentUser.uid
          });} }
      unlikeMe = { async() => {
          await axios.patch(`/user/quil/unlike/${item._id}`, {
              uid: auth.currentUser.uid
          });} }
      />)
  }
  return [ handleQuil, logOut, quilMap]
}
export default useHome;