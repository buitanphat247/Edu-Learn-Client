import apiClient from "@/app/config/api";

export interface CreateEventParams {
  title: string;
  description: string;
  start_event_date: string;
  end_event_date: string;
  location: string;
  created_by: number;
}

export interface CreateEventResponse {
  status: boolean;
  message: string;
  data: any;
  statusCode: number;
  timestamp: string;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface EventResponse {
  event_id: number;
  title: string;
  description: string;
  start_event_date: string;
  end_event_date: string;
  location: string;
  created_by: number;
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

export interface GetEventsResult {
  events: EventResponse[];
  total: number;
  page: number;
  limit: number;
}

export const getEvents = async (params?: GetEventsParams): Promise<GetEventsResult> => {
  try {
    const requestParams: Record<string, any> = {
      page: params?.page || 1,
      limit: params?.limit || 10,
    };

    if (params?.search && params.search.trim()) {
      requestParams.search = params.search.trim();
    }

    const response = await apiClient.get("/events", {
      params: requestParams,
    });

    const data = response.data.data || response.data;

    // Handle array response
    if (Array.isArray(data)) {
      return {
        events: data,
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };
    }

    // Handle paginated response
    return {
      events: data.data || data.events || [],
      total: data.total || data.totalCount || data.pagination?.total || 0,
      page: data.page || data.pagination?.page || params?.page || 1,
      limit: data.limit || data.pagination?.limit || params?.limit || 10,
    };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Không thể lấy danh sách sự kiện";
    throw new Error(errorMessage);
  }
};

export const createEvent = async (params: CreateEventParams): Promise<CreateEventResponse> => {
  try {
    const response = await apiClient.post("/events", params);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Không thể tạo sự kiện";
    throw new Error(errorMessage);
  }
};

export const getEventById = async (eventId: number | string): Promise<EventResponse> => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    
    if (response.data.status && response.data.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Không thể lấy thông tin sự kiện";
    throw new Error(errorMessage);
  }
};

