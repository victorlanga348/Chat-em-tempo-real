import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Input({ type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full mb-4">
      <input
        className="w-full p-2 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500 pr-10 transition-all"
        type={inputType}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          tabIndex="-1"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}

export default Input;