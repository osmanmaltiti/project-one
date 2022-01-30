import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; 
import { storage, auth } from '../../services/firebase';
import axios from 'axios';

const useSettings = () => {
  const updateCredentials = async(data) => {
    const update = await axios.patch('/user/update', {
      fullname: data.fullname,
      displayname: data.displayname,
      number: data.number,
      uid: auth.currentUser.uid
    });
    console.log(update.data);
  }

  const updateProfilePicture = (data) => {
    if(data.type === 'image/jpeg' || data.type === 'image/png'){
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile`);
        const upload = uploadBytesResumable(storageRef, data);
        upload.on("state_changed", () => {}, 
          (err) => console.log(err), 
          () => {
                getDownloadURL(upload.snapshot.ref)
                .then(async url => {
                      await axios.patch(`/user/${auth.currentUser.uid}`, { profileUrl: url });
                    })
          })
    }
  }

  return { updateCredentials, updateProfilePicture }
}
export default useSettings;