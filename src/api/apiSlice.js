import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const REACT_APP_API_URL = "https://api-rohi.codelab.pk/public/api";
// const REACT_APP_API_URL = "https://dev-rohi-backend.codelab.pk/public/api";
// const REACT_APP_API_URL = "http://192.168.1.17:8000/api";
const API_URL = REACT_APP_API_URL;

// Helper function to download blob
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const contentType = result.meta?.response?.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return result;
  } else if (
    contentType?.includes("application/octet-stream") ||
    contentType?.includes("application/pdf")
  ) {
    return { data: result.meta.response };
  } else {
    throw new Error("Unexpected content type received.");
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["KeyName"],
  endpoints: (builder) => ({
    get: builder.query({
      query: ({ path, params }) => ({
        url: path,
        method: "GET",
        params,
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: (result, error, { path }) =>
        result ? [{ type: "KeyName", id: path }] : ["KeyName"],
      transformResponse: async (response, meta) => {
        const contentType = meta.response.headers.get("content-type");
        if (contentType?.includes("application/octet-stream")) {
          return;
        } else if (contentType?.includes("application/json")) {
          return response;
        } else {
          throw new Error("Unexpected content type received");
        }
      },
    }),

    post: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "POST",
        body,
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["KeyName"],
    }),

    // PDF Download endpoint
    postWithPdfDownload: builder.mutation({
      queryFn: async ({ path, body, filename }, api) => {
        try {
          const state = api.getState();
          const token = state.auth?.token;

          const response = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/pdf, application/octet-stream",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
              error: {
                status: response.status,
                data: errorData,
              },
            };
          }

          const contentType = response.headers.get("content-type");

          if (
            contentType?.includes("application/pdf") ||
            contentType?.includes("application/octet-stream")
          ) {
            const blob = await response.blob();

            const contentDisposition = response.headers.get(
              "content-disposition",
            );
            let finalFilename = filename || "challan.pdf";

            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
              );
              if (filenameMatch && filenameMatch[1]) {
                finalFilename = filenameMatch[1].replace(/['"]/g, "");
              }
            }

            downloadBlob(blob, finalFilename);

            return {
              data: {
                success: true,
                filename: finalFilename,
                message: "PDF downloaded successfully",
              },
            };
          } else {
            const jsonData = await response.json();
            return { data: jsonData };
          }
        } catch (error) {
          console.error("PDF Download Error:", error);
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ["KeyName"],
    }),

    // Challan Download endpoint - GET method only
    downloadChallan: builder.mutation({
      queryFn: async (
        { path, params, filename },
        api,
        extraOptions,
        baseQuery,
      ) => {
        try {
          const state = api.getState();
          const token = state.auth?.token;

          // Build query string from params
          const queryString = params
            ? "?" +
              Object.keys(params)
                .map(
                  (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                      params[key],
                    )}`,
                )
                .join("&")
            : "";

          const response = await fetch(`${API_URL}${path}${queryString}`, {
            method: "GET",
            headers: {
              Accept: "application/pdf, application/octet-stream",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
              error: {
                status: response.status,
                data: errorData,
              },
            };
          }

          const contentType = response.headers.get("content-type");

          if (
            contentType?.includes("application/pdf") ||
            contentType?.includes("application/octet-stream")
          ) {
            const blob = await response.blob();

            const contentDisposition = response.headers.get(
              "content-disposition",
            );
            let finalFilename = filename || "challan.pdf";

            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
              );
              if (filenameMatch && filenameMatch[1]) {
                finalFilename = filenameMatch[1].replace(/['"]/g, "");
              }
            }

            downloadBlob(blob, finalFilename);

            return {
              data: {
                success: true,
                filename: finalFilename,
                message: "Challan downloaded successfully",
              },
            };
          } else {
            const jsonData = await response.json();
            return { data: jsonData };
          }
        } catch (error) {
          console.error("Challan Download Error:", error);
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message,
            },
          };
        }
      },
    }),

    put: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PUT",
        body,
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["KeyName"],
    }),

    delete: builder.mutation({
      query: ({ path }) => ({
        url: path,
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["KeyName"],
    }),

    patch: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PATCH",
        body,
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["KeyName"],
    }),

    // Upload Challan endpoint - PATCH with FormData
    uploadChallan: builder.mutation({
      queryFn: async ({ path, formData }, api, extraOptions, baseQuery) => {
        try {
          const state = api.getState();
          const token = state.auth?.token;

          // Debug: Log FormData contents
          console.log("Uploading to path:", `${API_URL}${path}`);
          for (let pair of formData.entries()) {
            console.log("FormData entry:", pair[0], pair[1]);
          }

          const response = await fetch(`${API_URL}${path}`, {
            method: "POST", // Changed to PATCH
            headers: {
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
              // IMPORTANT: Don't set Content-Type for FormData
              // Browser will automatically set it with the correct boundary
            },
            body: formData, // Send FormData directly
          });

          console.log("Response status:", response.status);
          console.log(
            "Response headers:",
            Object.fromEntries(response.headers.entries()),
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({
              message: "Upload failed",
            }));
            console.error("Upload error response:", errorData);
            return {
              error: {
                status: response.status,
                data: errorData,
              },
            };
          }

          const jsonData = await response.json();
          console.log("Upload success response:", jsonData);
          return { data: jsonData };
        } catch (error) {
          console.error("Challan Upload Error:", error);
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ["KeyName"],
    }),
  }),
});

export const {
  useGetQuery,
  usePostMutation,
  usePostWithPdfDownloadMutation,
  useDownloadChallanMutation,
  useUploadChallanMutation,
  usePutMutation,
  useDeleteMutation,
  usePatchMutation,
} = apiSlice;

export default apiSlice.reducer;
