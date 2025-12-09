import apiClient from "@/app/config/api";

export interface BackupResponse {
  backup_id: string;
  name: string;
  file_path: string;
  file_size: string;
  created_at: string;
  updated_at: string;
  creator: {
    user_id: string;
    username: string;
    fullname: string;
    email: string;
    avatar: string;
  };
}

export interface CreateBackupParams {
  name: string;
  created_by: number;
}

export interface CreateBackupResponse {
  backup_id: number;
  name: string;
  file_path: string;
  file_size: number;
  creator: {
    user_id: number;
    username: string;
    fullname: string;
    email: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBackupApiResponse {
  status: boolean;
  message: string;
  data: CreateBackupResponse;
  statusCode: number;
  timestamp: string;
}

export interface GetBackupsApiResponse {
  status: boolean;
  message: string;
  data: BackupResponse[] | GetBackupsResult;
  statusCode: number;
  timestamp: string;
}

export const createBackup = async (params: CreateBackupParams): Promise<CreateBackupResponse> => {
  try {
    const response = await apiClient.post<CreateBackupApiResponse>("/backup/create", params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể tạo backup");
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error?.message || "Không thể tạo backup";
    throw new Error(errorMessage);
  }
};

export interface GetBackupsParams {
  page?: number;
  limit?: number;
}

export interface GetBackupsResult {
  data: BackupResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

export const getBackups = async (params?: GetBackupsParams): Promise<BackupResponse[] | GetBackupsResult> => {
  try {
    const requestParams: Record<string, any> = {};
    
    if (params?.page) {
      requestParams.page = params.page;
    }
    if (params?.limit) {
      requestParams.limit = params.limit;
    }

    const response = await apiClient.get<GetBackupsApiResponse>("/backup", {
      params: requestParams,
    });

    if (response.data.status && response.data.data) {
      // Nếu có pagination (có page hoặc limit)
      if (params?.page || params?.limit) {
        // Response có thể là object với data, total, page, limit
        if (typeof response.data.data === 'object' && 'data' in response.data.data) {
          return response.data.data as GetBackupsResult;
        }
        // Hoặc là array nhưng có pagination info ở ngoài
        return {
          data: Array.isArray(response.data.data) ? response.data.data : [],
          total: (response.data as any).total,
          page: params?.page || 1,
          limit: params?.limit || 10,
        };
      }
      // Nếu không có pagination, trả về array
      return Array.isArray(response.data.data) ? response.data.data : [];
    }

    throw new Error(response.data.message || "Không thể lấy danh sách backup");
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error?.message || "Không thể lấy danh sách backup";
    throw new Error(errorMessage);
  }
};

