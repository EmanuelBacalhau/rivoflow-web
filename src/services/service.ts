import axios, { type InternalAxiosRequestConfig, isAxiosError } from "axios";
import { env } from "@/env";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const SKIP_REFRESH_URLS = ["/auth/refresh", "/auth/sign-out"];

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

    Service.refreshTokenInterceptorId =
      Service.client.interceptors.response.use(
        (response) => response,
        async (error) => {
          const config = error.config as RetryableConfig | undefined;

          const shouldSkip =
            !isAxiosError(error) ||
            error.response?.status !== 401 ||
            !config ||
            config._retry ||
            SKIP_REFRESH_URLS.some((url) => config.url === url);

          if (shouldSkip) return Promise.reject(error);

          config._retry = true;

          await onRefresh();
          return Service.client(config);
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
