'use client';

import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/redux/api/authApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import verifyToken from '@/utils/verifyToken/verifyToken';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/feature/authSlice';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm =()=> {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues:{
        email:"monirul@gmail.com",
        password:'12345678'
    }
  });
 const dispatch = useAppDispatch();
  const [login, { isLoading,error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
let backendErrorMessage: string | undefined;

if (error && 'data' in error && typeof error.data === 'object' && error.data !== null) {
  const data = error.data as { message?: string };
  backendErrorMessage = data.message;
}

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login(data).unwrap();
        const user = verifyToken(response.data.accessToken);

      dispatch(setUser({user: user, token: response.data.accessToken}));
     
      router.push('/');
    } catch (error: any) {
      if (error?.status === 400 && error?.data?.errorSources) {
        error.data.errorSources.forEach((err: { path: string; message: string }) => {
          setError(err.path as keyof LoginFormInputs, { message: err.message });
        });
      } else {
        setError('email', { message: 'Invalid email or password' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">

 <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
     {backendErrorMessage && (
  <p className="text-red-600 text-sm text-center mb-4">{backendErrorMessage}</p>
)}
      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          {...register('email', { required: 'Email is required' })}
          className={`w-full px-4 py-3 rounded-lg border text-sm transition ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
            className={`w-full px-4 py-3 pr-12 rounded-lg border text-sm transition ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
            tabIndex={-1}
          >
                {showPassword ? <EyeOff /> :<Eye /> }
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    </div>
   
  );
}
export default LoginForm;