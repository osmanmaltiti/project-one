import { auth } from "../../services/firebase";
import { logout } from '../../redux/features/user-profile-slice';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card } from '../Card';
import moment from 'moment';
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
                time = {`${item.date?.hour}:${item.date?.minute}`}
                date = {`${item.date?.day}-${item.date?.month}-${item.date?.year}`}
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
    />)
  }

  const getQuilAge = () => {
      const createdAt = '2021-12-1'
      const dates = new Date();
      let day = dates.getDate();
      let month = dates.getMonth() + 1;
      let year = dates.getFullYear();
      const currentDate = `${year}-${month}-${day}`;

      let start = moment(createdAt);
      let end = moment(currentDate);
      let difference = end.diff(start, 'days');

      let init = {
        num: difference, counter: 0,
        yearsCount: 0, firstmonthCount: 0,
        secondMonthCount: 0, daysCount: 0,
      }
      
      while(init.num > 0){
        if (init.num >= 365){
          init.yearsCount += 1;
          init.num -= 365;
        }
        else if(init.num >= 31 && init.counter < 7){
          init.secondMonthCount += 1;
          init.num -= 31;
        }
        else if(init.num >= 30 && init.counter >= 7){
          init.firstmonthCount += 1;
          init.num -= 30;
        }
        else{
          init.daysCount = init.num;
          init.num -= init.num;
        }
      }
      
      const months = init.firstmonthCount + init.secondMonthCount;
      const {yearsCount, daysCount} = init
      
      return `${yearsCount} years ${months} months ${daysCount} days`
  }

  return [handleSignOut, quilMap, getQuilAge]
}

export default useProfile;