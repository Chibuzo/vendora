import type {
  Notification,
  NotificationListData,
  NotificationListResponse,
  NotificationResponse
} from '@/shared/api/generated/model';

import { apiClient } from '../client';
import type { NotificationsListParams } from '../types';

export function getNotifications(params?: NotificationsListParams) {
  return apiClient.get<NotificationListResponse, NotificationListData>('/notifications', {
    params
  });
}

export function markNotificationAsRead(id: string) {
  return apiClient.patch<NotificationResponse, undefined, Notification>(
    `/notifications/${id}/read`
  );
}
