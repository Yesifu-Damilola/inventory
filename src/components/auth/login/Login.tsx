"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks/auth/useLogin";

const Login = () => {
  const { control, handleSubmit, onSubmit, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-xl border border-border p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="Enter your Email"
                  disabled={isPending}
                  {...field}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    disabled={isPending}
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isPending}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Login as</label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Please choose a role" }}
              render={({ field }) => {
                const { ref: _ref, ...fieldProps } = field;
                return (
                  <select
                    {...fieldProps}
                    disabled={isPending}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                );
              }}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Demo credentials:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
