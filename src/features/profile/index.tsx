"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers";
import { User, Mail, Shield } from "lucide-react";
import { ProfileSchema, ProfileSchemaType } from "@/schemas/profileSchema";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";

export default function ProfilePage() {
  const auth = useAuth();
  const user = auth.user;
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { onSubmit, isPending } = useUpdateProfile();

  const hasInitializedRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    if (hasInitializedRef.current) return;

    reset({ name: user.name, email: user.email });
    hasInitializedRef.current = true;
  }, [reset, user]);

  const handleCancel = () => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
    setIsEditing(false);
    setMessage(null);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/20 text-green-200 border border-green-900/30"
              : "bg-red-900/20 text-red-200 border border-red-900/30"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing && (
            <form
              className="space-y-4 pt-6 border-t border-border"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Your full name"
                      disabled={isPending}
                      aria-invalid={!!errors.name}
                      {...field}
                    />
                  )}
                />
                {errors.name?.message && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      disabled={isPending}
                      aria-invalid={!!errors.email}
                      {...field}
                    />
                  )}
                />
                {errors.email?.message && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
