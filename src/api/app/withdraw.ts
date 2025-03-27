import {useMutation, useQuery} from '@tanstack/react-query';
import http from '../client';

export function getWithdrawList(data: any) {
  return useQuery({
    queryKey: ['withdrawList'],
    queryFn: async () => http.post('/withdrawal/c_list', data),
    initialData: {
      result: [],
      total: 0,
      page: 1,
    },
  });
}

export function fetchRequestWithdraw() {
  return useMutation({
    mutationFn: async (data: any) => http.post('/withdrawal/carry', data),
  });
}

export function fetchCancelWithdraw() {
  return useMutation({
    mutationFn: async (data: any) => http.post('/withdrawal/cancel', data),
  });
}

export function fetchGetCoin() {
  return useMutation({
    mutationFn: async (data: any) => http.post('/gainCoin/gain', data),
  });
}
