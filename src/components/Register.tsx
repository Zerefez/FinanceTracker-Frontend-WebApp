
import { ChangeEvent, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import React from "react";
export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    return (
        <Card className="w-[350px] border-gray-500 border-2 rounded-lg ">
            <CardHeader>
                <CardTitle >Register</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <form className="space-y-4">
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                >
                </input >
                <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                >

                </input>
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

