import { Store } from '@tanstack/store';

export type Role = 'GUEST' | 'USER' | 'ADMIN';

export interface AuthState {
  role: Role;
  token: string | null;
}

export const authStore = new Store<AuthState>({
  role: 'GUEST',
  token: localStorage.getItem('kbm-auth-token'),
});

export const authActions = {
  setAuth: (role: Role, token: string | null) => {
    if (token) localStorage.setItem('kbm-auth-token', token);
    authStore.setState(() => ({ role, token }));
  },
  logout: () => {
    localStorage.removeItem('kbm-auth-token');
    authStore.setState(() => ({ role: 'GUEST', token: null }));
  },
};
