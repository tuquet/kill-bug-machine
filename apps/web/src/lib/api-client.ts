import { createClient } from '@hey-api/client-fetch';
const client = createClient({});
import { toast } from 'sonner';

// Cấu hình cơ bản cho API Client
client.setConfig({
  baseUrl: 'http://localhost:8000', // Sẽ thay bằng ENV ở môi trường thực tế
});

// Interceptor cho Request: Tự động đính kèm Token
client.interceptors.request.use((request: any) => {
  const token = localStorage.getItem('kbm-auth-token');

  if (token && request.headers) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
});

// Interceptor cho Response: Xử lý lỗi tập trung
client.interceptors.response.use((response: any) => {
  if (!response.ok) {
    if (response.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      // Xử lý logic logout ở đây (ví dụ clear store/storage và redirect về /login)
    } else if (response.status >= 500) {
      toast.error('Lỗi máy chủ nội bộ. Đội ngũ kỹ thuật đã được thông báo.');
    } else {
      toast.error(`Lỗi: ${response.statusText}`);
    }
  }
  return response;
});

export { client };
