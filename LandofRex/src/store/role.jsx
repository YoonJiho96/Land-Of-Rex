import { create } from 'zustand';

export const useRoleStore = create((set) => ({
  role: null, // 초기 상태
  setRole: (newRole) => set({ role: newRole }), // 역할 업데이트 함수
}));
