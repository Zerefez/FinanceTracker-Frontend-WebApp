import React, { ChangeEvent, useState } from "react";
import { authService } from "../services/authService";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        if (!fullName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!password.trim()) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (hourlyRate.trim() && isNaN(Number(hourlyRate))) {
            setError('Hourly rate must be a number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess(false);
        
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await authService.register(email, password, hourlyRate, fullName);
            if (response.success) {
                setSuccess(true);
                // Reset form
                setEmail('');
                setPassword('');
                setHourlyRate('');
                setFullName('');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-[350px] border-gray-500 border-2 rounded-lg ">
            <CardHeader>
                <CardTitle >Register</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            {error && <div className="text-red-500 px-6 pb-2">{error}</div>}
            {success && <div className="text-green-500 px-6 pb-2">Registration successful! You can now log in.</div>}
            
            {!success ? (
                <form className="space-y-4 px-6 pb-6" onSubmit={handleSubmit}>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label htmlFor="hourlyRate" className="block text-sm">Hourly rate (optional)</label>
                    <input
                        id="hourlyRate"
                        type="text"
                        placeholder="Enter your hourly rate"
                        value={hourlyRate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setHourlyRate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-accent text-white p-2 rounded hover:bg-accent/80 transition-colors"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
            ) : (
                <div className="px-6 pb-6">
                    <button 
                        onClick={() => setSuccess(false)}
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                    >
                        Register Another Account
                    </button>
                </div>
            )}
        </Card>
    );
}

