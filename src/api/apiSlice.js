// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { downloadBlob } from "./fileDownload";
// import {
//   setWarning,
//   setError,
//   setValidSession,
// } from "../features/error/errorSlice";

// const REACT_APP_API_URL = "http://192.168.1.54:8000/api";

// const API_URL = REACT_APP_API_URL;

// const handleBlobDownload = async (response, filename) => {
//   const reader = response.body.getReader();
//   const stream = new ReadableStream({
//     start(controller) {
//       function push() {
//         reader.read().then(({ done, value }) => {
//           if (done) {
//             controller.close();
//             return;
//           }
//           controller.enqueue(value);
//           push();
//         });
//       }

//       push();
//     },
//   });

//   const blob = await new Response(stream).blob();
//   downloadBlob(blob, filename, "application/octet-stream");
// };

// const baseQuery = fetchBaseQuery({
//   baseUrl: API_URL,
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().auth.token;
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     headers.set("Accept", "application/json"); // Add Accept header
//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
//   console.log("result", result);

//   const contentType = result.meta?.response?.headers.get("content-type");
//   console.log("contentType", contentType);

//   if (contentType && contentType.includes("application/json")) {
//     return result;
//   } else if (contentType && contentType.includes("application/octet-stream")) {
//     return { data: result.meta.response };
//   } else {
//     throw new Error("Expected JSON response but received non-JSON response.");
//   }
// };

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: baseQueryWithReauth,
//   endpoints: (builder) => ({
//     get: builder.query({
//       query: ({ path, params, showLoader }) => ({
//         url: path,
//         method: "GET",
//         params,
//       }),
//       transformResponse: async (response, meta) => {
//         const contentType = meta.response.headers.get("content-type");

//         if (contentType.includes("application/octet-stream")) {
//           if (params && params.filename) {
//             await handleBlobDownload(meta.response, params.filename);
//           }
//           return;
//         } else if (contentType.includes("application/json")) {
//           return response;
//         } else {
//           throw new Error("Unexpected content type received");
//         }
//       },
//     }),
//     post: builder.mutation({
//       query: ({ path, body }) => ({
//         url: path,
//         method: "POST",
//         body,
//       }),
//     }),
//     put: builder.mutation({
//       query: ({ path, body }) => ({
//         url: path,
//         method: "PUT",
//         body,
//       }),
//     }),
//     delete: builder.mutation({
//       query: ({ path }) => ({
//         url: path,
//         method: "DELETE",
//       }),
//     }),
//     patch: builder.mutation({
//       query: ({ path, body }) => ({
//         url: path,
//         method: "PATCH",
//         body,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetQuery,
//   usePostMutation,
//   usePutMutation,
//   useDeleteMutation,
//   usePatchMutation,
// } = apiSlice;

// export default apiSlice.reducer;s

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { downloadBlob } from './fileDownlroad';
// const REACT_APP_API_URL = "https://api-rohi.codelab.pk/public/api";
const REACT_APP_API_URL = "http://192.168.1.63:8000/api";

const API_URL = REACT_APP_API_URL;
// const handleBlobDownload = async (response, filename) => {
//   const reader = response.body.getReader();
//   const stream = new ReadableStream({
//     start(controller) {
//       function push() {
//         reader.read().then(({ done, value }) => {
//           if (done) {
//             controller.close();
//             return;
//           }
//           controller.enqueue(value);
//           push();
//         });
//       }
//       push();
//     },
//   });
//   const blob = await new Response(stream).blob();
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   link.click();
// };
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const contentType = result.meta?.response?.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return result;
  } else if (contentType?.includes("application/octet-stream")) {
    return { data: result.meta.response };
  } else {
    throw new Error("Unexpected content type received.");
  }
};
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["KeyName"], // Dynamic tag management
  endpoints: (builder) => ({
    // GET endpoint
    get: builder.query({
      query: ({ path, params }) => ({
        url: path,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { path }) =>
        result ? [{ type: "KeyName", id: path }] : ["KeyName"],
      transformResponse: async (response, meta) => {
        const contentType = meta.response.headers.get("content-type");
        if (contentType.includes("application/octet-stream")) {
          // if (params && params.filename) {
          //   await handleBlobDownload(meta.response, params.filename);
          // }
          return;
        } else if (contentType?.includes("application/json")) {
          return response;
        } else {
          throw new Error("Unexpected content type received");
        }
      },
    }),
    // POST endpoint
    post: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "POST",
        body,
      }),
      invalidatesTags: ["KeyName"],
    }),
    // PUT endpoint
    put: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["KeyName"],
    }),
    // DELETE endpoint
    delete: builder.mutation({
      query: ({ path }) => ({
        url: path,
        method: "DELETE",
      }),
      invalidatesTags: ["KeyName"],
    }),
    // PATCH endpoint
    patch: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["KeyName"],
    }),
  }),
});
export const {
  useGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
  usePatchMutation,
} = apiSlice;
export default apiSlice.reducer;
