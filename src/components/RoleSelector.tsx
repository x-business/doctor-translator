'use client';

import { Role } from '@/types';
import { Stethoscope, User } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-inner">
      <button
        onClick={() => onRoleChange('doctor')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
          currentRole === 'doctor'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
        }`}
      >
        <Stethoscope className="w-5 h-5" />
        <span>Doctor</span>
      </button>
      <button
        onClick={() => onRoleChange('patient')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
          currentRole === 'patient'
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30'
            : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Patient</span>
      </button>
    </div>
  );
}
