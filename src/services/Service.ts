import axios, { isAxiosError } from "axios";
import { env } from "@/env";

export abstract class Service {
  private static refreshTokenId: number | null = null;

  protected static client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
  });

  static setAccessToken(token: string) {
    Service.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  static removeAccessToken() {
    delete Service.client.defaults.headers.common.Authorization;
  }

  static removeRefreshTokenHandler() {
    if (Service.refreshTokenId !== null) {
      Service.client.interceptors.response.eject(Service.refreshTokenId);
      Service.refreshTokenId = null;
    }
  }

  static setRefreshTokenHandler(refreshHandler: () => Promise<void>) {
    Service.removeRefreshTokenHandler();

    Service.refreshTokenId = Service.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          !isAxiosError(error) ||
          error.response?.status !== 401 ||
          !error.config ||
          error.config.url === "/auth/refresh"
        ) {
          return Promise.reject(error);
        }

        const config = error.config as typeof error.config & {
          _retry?: boolean;
        };

        if (config._retry) {
          return Promise.reject(error);
        }

        config._retry = true;

        await refreshHandler();

        return Service.client(config);
      },
    );
  }

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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
