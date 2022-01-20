import { auth } from '../services/firebase';
import { logout } from '../../redux/features/user-profile-slice';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card } from '../Card';
import axios from 'axios';


const useProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth);
    dispatch(logout());
    navigate('/');
  }

  const quilMap = (quil) => {
    return quil?.filter(item => item.uid === auth.currentUser.uid)
                .map( item => <Card key = {item._id}
                write = {item.quil}
                name = {item.displayname}
                profileImg = {item.profileUrl}
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

  return [handleSignOut, quilMap]
}

export default useProfile;