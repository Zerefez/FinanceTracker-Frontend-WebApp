import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await authService.register(email, password, fullName);
      if (response.success) {
        setSuccess(true);
        // Reset form
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[350px] rounded-lg border-2 border-gray-500">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      {error && <div className="px-6 pb-2 text-red-500">{error}</div>}
      {success && (
        <div className="px-6 pb-2 text-green-500">Registration successful! You can now log in.</div>
      )}

      {!success ? (
        <form className="space-y-4 px-6 pb-6" onSubmit={handleSubmit}>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            className="w-full rounded border p-2"
            required
          />

          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
          <Button type="submit" variant="submit" disabled={isSubmitting} className="w-full items-center justify-center">
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      ) : (
        <div className="flex justify-between gap-2 px-6 pb-6">
          <Button onClick={() => setSuccess(false)} type="button" variant="outline">
            Register Another Account
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="w-full rounded bg-accent p-2 text-white transition-colors hover:bg-accent/80"
          >
            Login
          </Button>
        </div>
      )}
    </Card>
  );
}
