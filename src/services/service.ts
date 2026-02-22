import axios, { isAxiosError } from "axios";
import { env } from "@/env";

const SKIP_REFRESH_URLS = ["/auth/refresh-token"];

export abstract class Service {
  private static refreshTokenInterceptorId: number | null = null;

  protected static client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  static async uploadPresignedPOST({
    uploadSignature,
    file,
  }: Service.UploadPresignedPOSTParams) {
    const { url, fields } = JSON.parse(
      Buffer.from(uploadSignature, "base64").toString("utf-8"),
    ) as Service.DecodedUploadSignature;

    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("file", file);

    await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  static removeRefreshTokenHandler() {
    if (Service.refreshTokenInterceptorId !== null) {
      Service.client.interceptors.response.eject(
        Service.refreshTokenInterceptorId,
      );
      Service.refreshTokenInterceptorId = null;
    }
  }

  static setRefreshTokenHandler(onRefresh: () => Promise<void>) {
    Service.removeRefreshTokenHandler();

    let refreshPromise: Promise<void> | null = null;

    Service.refreshTokenInterceptorId =
      Service.client.interceptors.response.use(
        (response) => response,
        async (error) => {
          const config = error.config;

          const shouldSkip =
            !isAxiosError(error) ||
            error.response?.status !== 401 ||
            !config ||
            SKIP_REFRESH_URLS.some((url) => config.url === url);

          if (shouldSkip) {
            return Promise.reject(error);
          }

          if (!refreshPromise) {
            refreshPromise = onRefresh().finally(() => {
              refreshPromise = null;
            });
          }

          try {
            await refreshPromise;
            return Service.client(config);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        },
      );
  }
}

export namespace Service {
  export type UploadPresignedPOSTParams = {
    uploadSignature: string;
    file: File;
  };

  export type DecodedUploadSignature = {
    url: string;
    fields: Record<string, string>;
  };
}
