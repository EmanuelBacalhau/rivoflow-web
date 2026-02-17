import axios from "axios";
import { env } from "@/env";

export abstract class Service {
  protected static client = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
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
