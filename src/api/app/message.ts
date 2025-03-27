import {useMutation, useQuery} from '@tanstack/react-query';
import http from '../client';

export function getMessageList() {
  return useQuery<any, any, any>({
    queryKey: ['messageList'],
    queryFn: async () => http.post('/letter/user/record'),
    // refetchInterval: 1000 * 60,
  });
}

export function fetchReadMessage() {
  return useMutation({
    mutationFn: async (data: any) =>
      http.post('/letter/user/read_platform', {...data, status: 2}),
  });
}

export function getCommonMessageList() {
  return useQuery({
    queryKey: ['commonMessageList'],
    queryFn: async () =>
      http.post('message/list', {platform: 2, page: 1, pageSize: 20}),
    initialData: [],
  });
}
