"use client";


import Link from "next/link";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSignUp } from "@/hooks/auth/useSignUp";

const Register = () => {
  const { control, handleSubmit, onSubmit, isPending, errors } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-xl border border-border p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Create a new account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Full Name"
                  disabled={isPending}
                  aria-invalid={!!errors.name}
                  {...field}
                />
              )}
            />
            {errors.name?.message ? (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="you@example.com"
                  disabled={isPending}
                  aria-invalid={!!errors.email}
                  {...field}
                />
              )}
            />
            {errors.email?.message ? (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a Password"
                    disabled={isPending}
                    className="pr-10"
                    aria-invalid={!!errors.password}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isPending}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
            {errors.password?.message ? (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    disabled={isPending}
                    className="pr-10"
                    aria-invalid={!!errors.confirmPassword}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={isPending}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            />
            {errors.confirmPassword?.message ? (
              <p className="text-sm text-destructive mt-1">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Register as
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => {
                const { ref: _ref, ...fieldProps } = field;
                return (
                  <select
                    {...fieldProps}
                    disabled={isPending}
                    aria-invalid={!!errors.role}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                );
              }}
            />
            {errors.role?.message ? (
              <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Creating account...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
