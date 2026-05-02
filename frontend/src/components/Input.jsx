import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Input({ type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full mb-2">
      <input
        className="w-full p-3 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 pr-10 transition-all placeholder:text-slate-500"
        type={inputType}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          tabIndex="-1"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}

export default Input;