// src/redux/features/auth/authApi.js
import { apiSlice } from "@/redux/api/apiSlice";
import { userLoggedIn } from "./authSlice";
import Cookies from "js-cookie";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ─── Registration ──────────────────────────
    sendRegistrationOTP: builder.mutation({
      query: (data) => ({
        url: "users/send-otp",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    verifyOTPAndRegister: builder.mutation({
      query: ({ email, otp }) => ({
        url: "users/verify-otp",
        method: "POST",
        credentials: "include",
        body: { email, otp },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("verifyOTPAndRegister error:", err);
        }
      },
    }),

    // ─── Login / Session ───────────────────────
    loginUser: builder.mutation({
      query: ({ identifier, password }) => ({
        url: "users/login",
        method: "POST",
        credentials: "include",
        body: { identifier, password },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set(
            "userInfo",
            JSON.stringify({ user: data.user }),
            { expires: 0.5 }
          );
          dispatch(userLoggedIn({ accessToken: data.token, user: data.user }));
        } catch (err) {
          console.error("loginUser error:", err);
        }
      },
    }),
    requestLoginOTP: builder.mutation({
      query: ({ email }) => ({
        url: "users/login/otp/request",
        method: "POST",
        credentials: "include",
        body: { email },
      }),
    }),
    verifyLoginOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: "users/login/otp/verify",
        method: "POST",
        credentials: "include",
        body: { email, otp },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set(
            "userInfo",
            JSON.stringify({ user: data.user }),
            { expires: 0.5 }
          );
          dispatch(userLoggedIn({ accessToken: data.token, user: data.user }));
        } catch (err) {
          console.error("verifyLoginOTP error:", err);
        }
      },
    }),
    getSessionInfo: builder.query({
      query: ({ userId }) => ({
        url: `users/${userId}/session`,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.session.user }));
        } catch (err) {
          console.error("getSessionInfo error:", err);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: ({ userId }) => ({
        url: `users/logout/${userId}`,
        method: "POST",
        credentials: "include",
      }),
    }),

    // ─── **NEW**: Update Profile ───────────────
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,          // matches your GET /:userId route for update
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // Optionally update auth state if backend returns updated user
          dispatch(userLoggedIn({ user: data }));
        } catch (err) {
          console.error("updateProfile error:", err);
        }
      },
    }),
  }),
});

// Export hooks for all endpoints, including the new updateProfile
export const {
  useSendRegistrationOTPMutation,
  useVerifyOTPAndRegisterMutation,
  useLoginUserMutation,
  useRequestLoginOTPMutation,
  useVerifyLoginOTPMutation,
  useGetSessionInfoQuery,
  useLogoutUserMutation,
  useUpdateProfileMutation,     // ← now available!
} = authApi;
