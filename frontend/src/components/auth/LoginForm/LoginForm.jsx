import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import { Loader, Eye, EyeOff, User, Lock } from "lucide-react";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();

    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            toast.success("Welcome back! 🎉");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => {
            const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
            setErrors({ general: errorMessage });
        },
    });

    const validateForm = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        loginMutation({ 
            username: username.trim(), 
            password 
        });
    };

    const handleInputChange = (field, value) => {
        if (field === 'username') {
            setUsername(value);
            if (errors.username) {
                setErrors(prev => ({ ...prev, username: '' }));
            }
        } else if (field === 'password') {
            setPassword(value);
            if (errors.password) {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }
        
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm font-medium">{errors.general}</p>
                </div>
            )}

            {/* Username Field */}
            <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={`h-5 w-5 ${errors.username ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                        id="username"
                        type='text'
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-all duration-200 ${
                            errors.username 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-2 focus:outline-none`}
                        disabled={isLoading}
                    />
                </div>
                {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-all duration-200 ${
                            errors.password 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-2 focus:outline-none`}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                        Forgot password?
                    </a>
                </div>
            </div>

            {/* Submit Button */}
            <button 
                type='submit' 
                disabled={isLoading || !username.trim() || !password}
                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2'
            >
                {isLoading ? (
                    <>
                        <Loader className='w-5 h-5 animate-spin' />
                        <span>Signing In...</span>
                    </>
                ) : (
                    <span>Sign In</span>
                )}
            </button>
        </form>
    );
};

export default LoginForm;