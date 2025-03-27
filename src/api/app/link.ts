import {useMutation, useQuery} from '@tanstack/react-query';
import http from '../client';

export function getLinkList() {
  return useQuery({
    queryKey: ['linkList'],
    queryFn: async () => http.post('/link/c_list'),
  });
}

export function fetchAddCoin() {
  return useMutation({
    mutationFn: async data => http.post('/gainCoin/gain', data),
  });
}
