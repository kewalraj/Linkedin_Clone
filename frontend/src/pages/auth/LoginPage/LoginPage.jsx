import { Link } from "react-router-dom"
import LoginForm from "../../../components/auth/LoginForm/LoginForm"
import { ArrowRight, Users, Briefcase, TrendingUp } from "lucide-react"

const LoginPage = () => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Section - Hero */}
                <div className="lg:w-1/2 flex items-center justify-center p-8">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <img className='mx-auto h-16 w-auto mb-6' src='/logo.svg' alt='LinkedIn' />
                            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                                Welcome back
                            </h1>
                            <p className="text-lg text-gray-600">
                                Connect with your professional network
                            </p>
                        </div>

                        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                            <LoginForm />
                            
                            <div className='mt-6'>
                                <div className='relative'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <div className='w-full border-t border-gray-300'></div>
                                    </div>
                                    <div className='relative flex justify-center text-sm'>
                                        <span className='px-4 bg-white text-gray-500 font-medium'>
                                            New to LinkedIn?
                                        </span>
                                    </div>
                                </div>
                                <div className='mt-6'>
                                    <Link
                                        to='/signup'
                                        className='w-full flex justify-center items-center space-x-2 py-3 px-4 border-2 border-blue-600 rounded-xl text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 group'
                                    >
                                        <span>Join now</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Features */}
                <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex items-center justify-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10 max-w-md text-white">
                        <h2 className="text-3xl font-bold mb-8">
                            Connect with professionals worldwide
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Build Your Network</h3>
                                    <p className="text-blue-100 leading-relaxed">
                                        Connect with colleagues, industry leaders, and professionals in your field.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Advance Your Career</h3>
                                    <p className="text-blue-100 leading-relaxed">
                                        Discover opportunities and showcase your professional achievements.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
                                    <p className="text-blue-100 leading-relaxed">
                                        Get insights from industry experts and stay updated with trends.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <p className="text-sm text-blue-100">
                                "LinkedIn has transformed how professionals connect and grow their careers worldwide."
                            </p>
                            <p className="text-xs text-blue-200 mt-2 font-medium">
                                — Professional Community
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage