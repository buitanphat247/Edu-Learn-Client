import apiClient from "@/app/config/api";

export interface AssignmentCreator {
  user_id: number | string;
  username: string;
  fullname: string;
  email: string;
  avatar?: string | null;
}

export interface AssignmentClass {
  class_id: number | string;
  name: string;
  code: string;
}

export interface AssignmentResponse {
  assignment_id: number | string;
  class_id: number | string;
  title: string;
  description: string;
  due_at: string | null;
  created_by?: number | string;
  created_at: string;
  creator?: AssignmentCreator;
  class?: AssignmentClass;
}

export interface GetAssignmentsByClassParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetAssignmentsByClassResult {
  data: AssignmentResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAssignmentsByClassApiResponse {
  status: boolean;
  message: string;
  data: GetAssignmentsByClassResult;
  statusCode: number;
  timestamp: string;
}

export const getAssignmentsByClass = async (
  classId: number | string,
  params?: GetAssignmentsByClassParams
): Promise<GetAssignmentsByClassResult> => {
  try {
    const numericClassId = typeof classId === "string" ? Number(classId) : classId;
    
    if (isNaN(numericClassId)) {
      throw new Error("ID lớp học không hợp lệ");
    }

    const response = await apiClient.get<GetAssignmentsByClassApiResponse>(
      `/assignments/by-class/${numericClassId}`,
      {
        params: {
          page: params?.page,
          limit: params?.limit,
          search: params?.search,
        },
      }
    );

    const result = response.data?.data;
    
    if (!result) {
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };
    }

    return {
      data: result.data || [],
      total: result.total || 0,
      page: result.page || params?.page || 1,
      limit: result.limit || params?.limit || 10,
    };
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error?.message || "Không thể lấy danh sách bài tập";
    throw new Error(errorMessage);
  }
};

