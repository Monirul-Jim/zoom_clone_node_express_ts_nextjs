'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRegisterUserMutation } from '@/redux/api/authApi';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();
  const [registerUser, { isLoading,error }] = useRegisterUserMutation();

  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();
const [showPassword, setShowPassword] = useState(false);
let backendErrorMessage: string | undefined;

if (error && 'data' in error && typeof error.data === 'object' && error.data !== null) {
  const data = error.data as { message?: string };
  backendErrorMessage = data.message;
}

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await registerUser(data).unwrap();
      router.push('/login');
    } catch (error: any) {
      if (error?.status === 400 && error?.data?.errorSources) {
        error.data.errorSources.forEach(
          (err: { path: string; message: string }) => {
            setError(err.path as keyof FormData, { message: err.message });
          }
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6 border border-white/20"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h2>
        {backendErrorMessage && (
  <p className="text-red-600 text-sm text-center mb-4">{backendErrorMessage}</p>
)}


        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter first name"
            {...register('firstName', { required: 'First name is required' })}
            className={`w-full px-4 py-3 rounded-lg border text-sm transition ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter last name"
            {...register('lastName', { required: 'Last name is required' })}
            className={`w-full px-4 py-3 rounded-lg border text-sm transition ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
            className={`w-full px-4 py-3 rounded-lg border text-sm transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
    <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>
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
  {errors.password && (
    <p className="text-red-500 text-sm mt-1">
      {errors.password.message}
    </p>
  )}
</div>


        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
            isLoading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
