import { ChangeEvent, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

export function Login({ onLogin, onForgotPassword, onRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <Card className="w-[350px] border-gray-500 border-2 rounded-lg ">
      <CardHeader>
        <CardTitle >Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <div className="text-center">
              <button 
                type="button" 
                className="text-xs text-accent hover:underline"
                onClick={onForgotPassword}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 text-white bg-accent">
              Login
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={onRegister}
            >
              Register
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

