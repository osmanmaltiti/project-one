import { configureStore } from '@reduxjs/toolkit';
import userprofile from '../features/user-profile-slice';
const store = configureStore({
  reducer: {
    user: userprofile
  }
});

export default store;