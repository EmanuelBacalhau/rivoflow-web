import { Service } from "./service";

export class ProjectService extends Service {
  static async create(
    name: string,
  ): Promise<ProjectService.CreateProjectResponse> {
    const response =
      await ProjectService.client.post<ProjectService.CreateProjectResponse>(
        "/projects",
        { name },
      );
    return response.data;
  }

  static async getAll(): Promise<ProjectService.GetAllProjectsResponse> {
    const response =
      await ProjectService.client.get<ProjectService.GetAllProjectsResponse>(
        "/projects",
      );
    return response.data;
  }

  static async get(id: string): Promise<ProjectService.GetProjectResponse> {
    const response =
      await ProjectService.client.get<ProjectService.GetProjectResponse>(
        `/projects/${id}`,
      );
    return response.data;
  }
}

export namespace ProjectService {
  export type Project = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  export type CreateProjectResponse = {
    project: Project;
  };

  export type GetAllProjectsResponse = {
    projects: Project[];
  };

  export type GetProjectResponse = {
    project: Project;
  };
}
