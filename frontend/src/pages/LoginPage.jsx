import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import logo from "../assets/chime2.png"
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {

    const { login, isLoggingIn } = useAuthStore();   
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email");
        if (!formData.password) return toast.error("Password is required");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const loggedIn = validateForm();
        if (loggedIn === true) login(formData);
    }



    return (
        <div className="h-screen grid lg:grid-cols-2">
            {/*Left side*/}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md sapce-y-8">

                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
                                <img src={logo} alt="Chime Logo" className="size-30 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back!</h1>
                            <p className="text-base-content/60">Sign in to your account</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-base-content/40"></Mail>
                                </div>

                                <input 
                                    type="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="your@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/40"></Lock>
                                </div>

                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="******"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value})} 
                                />

                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-base-content/40"></EyeOff>
                                    ) : (
                                        <Eye className="h-5 w-5 text-base-content/40"></Eye>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin"></Loader2>
                                    Loading...
                                </>                         
                            ) : "Log In"}
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <p className="text-base-content/60">
                            Don't have an account?{" "}
                            <Link to="/signup" className="link link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <AuthImagePattern
                title={"Welcome back!"}
                subtitle={"Sign in to continue your conversations and catch up with your messages."}
            />
        </div>
    )
};

export default LoginPage;