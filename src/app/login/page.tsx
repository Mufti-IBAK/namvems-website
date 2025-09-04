'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa' // FaGoogle is now used
import { z, ZodIssue } from 'zod'

// --- Validation Schemas ---
const sharedSchema = {
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
};
const signUpSchema = z.object({
  ...sharedSchema,
  fullName: z.string().min(2, { message: "Full name is required" }),
  university: z.string().min(3, { message: "University is required" }),
  level: z.string().min(2, { message: "Level of study is required" }),
});
const signInSchema = z.object(sharedSchema);

// --- Type Definitions for Form Props (Fixes 'any' type errors) ---
interface FormInputProps {
    label: string;
    id: string;
    name: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const FormInput = ({ label, id, name, type, placeholder, value, onChange, error }: FormInputProps) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary sm:text-sm ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
            />
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
    </div>
);

const PasswordInput = ({ label, id, name, value, onChange, error }: Omit<FormInputProps, 'type' | 'placeholder'>) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 relative">
                <input id={id} name={name} type={isVisible ? 'text' : 'password'} value={value} onChange={onChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary sm:text-sm ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button type="button" onClick={() => setIsVisible(!isVisible)} className="text-gray-500 hover:text-gray-700">
                        {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '', university: '', level: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { supabase, user, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (userRole === 'admin') router.push('/admin');
            else router.push('/');
        }
    }, [user, userRole, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setMessage(null);

        const schema = isSignUp ? signUpSchema : signInSchema;
        const result = schema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue: ZodIssue) => {
                const key = typeof issue.path[0] === 'string' ? issue.path[0] : undefined;
                if (key) fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                 const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });
                if (signUpError) throw signUpError;
                if (!signUpData.user) throw new Error("Sign up successful, but no user data returned.");
                const { error: profileError } = await supabase.from('profiles').insert({
                    id: signUpData.user.id,
                    full_name: formData.fullName,
                    university: formData.university,
                    level_of_study: formData.level,
                });
                if (profileError) throw profileError;
                setMessage('Success! Please check your email to confirm your account, then sign in below.');
                setIsSignUp(false);
                setFormData(prev => ({ ...prev, password: '', fullName: '', university: '', level: '' }));
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                // The useEffect will handle the redirect
            }
        } catch (error: unknown) {
            setErrors({ form: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            setErrors({ form: error.message });
            setLoading(false);
        }
    };

    // JSX is now correctly using all state and handler functions
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">{isSignUp ? 'Create your account' : 'Sign in to your account'}</h2>
                <p className="mt-2 text-center text-sm text-gray-600">Welcome to the <span className="font-medium text-primary">NAMVEMS</span> Portal</p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    {errors.form && <div className="mb-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.form}</div>}
                    {message && <div className="mb-4 text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</div>}
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {isSignUp && (
                            <>
                                <FormInput label="Full Name" id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} {...(errors.fullName ? { error: errors.fullName } : {})} />
                                <FormInput label="University" id="university" name="university" type="text" value={formData.university} onChange={handleChange} {...(errors.university ? { error: errors.university } : {})} />
                                <FormInput label="Level of Study" id="level" name="level" type="text" placeholder="e.g., 200L" value={formData.level} onChange={handleChange} {...(errors.level ? { error: errors.level } : {})} />
                            </>
                        )}
                        <FormInput label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} {...(errors.email ? { error: errors.email } : {})} />
                        <PasswordInput label="Password" id="password" name="password" value={formData.password} onChange={handleChange} {...(errors.password ? { error: errors.password } : {})} />
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors">
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
                        </div>
                        <div className="mt-6">
                            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                                <FaGoogle className="h-5 w-5 mr-2" />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-sm">
                        <button onClick={() => { setIsSignUp(!isSignUp); setErrors({}); setMessage(null); }} className="font-medium text-accent hover:text-green-600 transition-colors">
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}