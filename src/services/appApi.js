import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

//you can go to redux toolkit page and see how to crewate app api, It is a very nice way to create and call api without using anything like axios

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001'
    }),

    endpoints: (builder) => ({
        //mutation means post, delete & update request 
        //creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/user",
                method: "POST",
                body: user, 
            })
        }),

        //login the user
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/user/login",
                method: "POST",
                body: user, 
            })
        }),

        //logout the user
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload, 
            })
        }),

    }),

});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation} = appApi;


export default appApi;