import {useQuery} from '@tanstack/react-query';
import http from './client';

export function getProductList(data: any, linkType: number) {
  return useQuery<any, any, any, any>({
    queryKey: [linkType],
    queryFn: async () => {
      if (linkType === -1) return {data: [], date: +new Date()};
      const res = (await http.post('/link/c_list', data)) as any;
      return {data: res, date: +new Date()};
    },
    initialData: [],
    retry: true,
  });
}
