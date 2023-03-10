import {createSlice} from '@reduxjs/toolkit';
import appApi from '../services/appApi';

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    //reducers = functions
    reducers: {
        addNotification: (state, {payload}) => {
            if(state.newMessage[payload]){
                state.newMessage[payload] = state.newMessage[payload] + 1
            }else{
                state.newMessage[payload] = 1;
            }
        },
        resetNotifications: (state, {payload}) => {
            delete state.newMessage[payload];
        },
    },
    
    // extraReducers are more than just a reducer bcz it also save sate
    extraReducers: (builder) => {
        //save user after signup
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, {payload}) => payload);
        // save user after login
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
        // logout: destroy user session
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    },
});

//userSlice.actions = reducers only reducer can change state 
export const {addNotification, resetNotifications} = userSlice.actions;
export default userSlice.reducer;