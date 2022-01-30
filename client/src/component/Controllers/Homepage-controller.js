import { signOut } from "firebase/auth";
import { logout, otherUser } from "../../redux/features/user-profile-slice"
import { Card } from "../Card";
import axios from "axios";
import { auth } from "../../services/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const useHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createdAt = () => {
    const dates = new Date()
    let day = dates.getDate();
    let month = dates.getMonth() + 1;
    let year = dates.getFullYear();
    let hour = dates.getHours();
    let minute = dates.getMinutes();
   return {day, month, year, hour, minute};
  }

  const handleQuil = async(write, reset, e) => {
    e.preventDefault();
    reset();
    try{
     await axios.patch('/user', {
         uid: auth.currentUser.uid, 
         quils: write,
         createdAt: createdAt()
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
      uid = {item.uid}
      name = {item.displayname}
      profileImg = {item.profileUrl}
      time = {`${item.date?.hour}:${item.date?.minute}`}
      date = {`${item.date?.day}-${item.date?.month}-${item.date?.year}`}
      delete = {async() => {
          axios.delete(`/user/quil/${auth.currentUser.uid}/${item._id}`)
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
      likeState = {
        item.likes.includes(auth.currentUser.uid) && 'green'
      }
      unLikeState = {
        item.unlikes.includes(auth.currentUser.uid) && 'red'
      }
      profile = {
        () => {
          if(item.uid === auth.currentUser.uid){
            navigate('/home/profile')
          }
          else{
            dispatch(otherUser(item.uid));
            navigate('/home/explore/followingprofile');
          }
        }
      }
      />)
  }
  
  return [ handleQuil, logOut, quilMap, createdAt ]
}
export default useHome;