import { createSlice } from "@reduxjs/toolkit";

const init = {}
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: { data: init, interactions: init },
  reducers: {
    userprofile: (state, action) => {
      const { payload } = action;
      state.data = payload;
    },
    totalLikes: (state, action) => {
      const { payload } = action;
      state.interactions = payload;
    },
    logout: (state) => {
      state.data = init;
      state.interactions = init
    }
  }
});

export const { userprofile, totalLikes, logout } = userProfileSlice.actions;
export default userProfileSlice.reducer;