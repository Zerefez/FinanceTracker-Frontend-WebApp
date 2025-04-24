
import { ChangeEvent, useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { authService } from "../services/authService";
import React from "react";
export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [fullName, setFullName] = useState('');


    useEffect(() => {
        authService.register(email, password, hourlyRate, fullName)
    }, [])

    return (
        <Card className="w-[350px] border-gray-500 border-2 rounded-lg ">
            <CardHeader>
                <CardTitle >Register</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <form className="space-y-4">

                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700"> Full Name</label>
                <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                    required
                >
                </input >

                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                >
                </input >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                >

                </input>
                <label htmlFor="hourlyRate" className="block text-sm">Hourly rate</label>
                <input
                    id="hourlyRate"
                    type="text"
                    placeholder="Enter your hourly rate"
                    value={hourlyRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setHourlyRate(e.target.value)}
                >
                </input>
                <button type="submit">
                    Submit
                </button>

            </form>

        </Card>
    );
}

