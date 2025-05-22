import { ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

interface LoginProps {
  username: string;
  password: string;
  isLoading: boolean;
  errorMessage: string | null;
  onUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export function Login({ 
  username,
  password,
  isLoading,
  errorMessage,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onReset,
  onForgotPassword, 
  onRegister
}: LoginProps) {
  return (
    <Card className="w-[350px] border-gray-500 border-2 rounded-lg ">
      <CardHeader>
        <CardTitle >Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" role="form">
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username/Email
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={onUsernameChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={onPasswordChange}
              disabled={isLoading}
              required
            />
            <div className="text-center">
              <button 
                type="button" 
                className="text-xs text-accent hover:underline"
                onClick={onForgotPassword}
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 text-white bg-accent"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={onRegister}
              disabled={isLoading}
            >
              Register
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

