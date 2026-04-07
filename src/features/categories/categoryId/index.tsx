"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { useAuth } from "@/providers";
import Link from "next/link";
import { useGetCategoryById } from "@/hooks/categories/useGetCategoryById";
import { dateFormatter } from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryDetails() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const categoryId = params.categoryId as string;

  // Get Category by Id
  const { category, isPending, error } = useGetCategoryById(categoryId);
  const categoryData = category?.data ?? category;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (categoryData) {
      setFormData({
        name: categoryData.name ?? "",
        description: categoryData.description ?? "",
      });
    }
  }, [categoryData]);

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="rounded-lg border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSaving(true);
    try {
        // Mock update - replace with your API call
        // PUT /api/v1/categories/{id}
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Mock delete - replace with your API call
      // DELETE /api/v1/categories/{id}
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push("/categories");
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/categories">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{categoryData.name}</h1>
          <p className="text-muted-foreground mt-1">
            Category ID: {categoryData.id}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
        {!isAdmin && (
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Admin only</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Category description"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {categoryData.description}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Category ID</p>
                <p className="font-mono text-foreground">{categoryData.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Created Date</p>
                <p className="text-foreground">
                  {categoryData.created_at
                    ? dateFormatter(categoryData.created_at)
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <span className="px-2 py-1 bg-green-900/30 text-green-200 rounded text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Product Count Card */}
          <div className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">
                  Products in Category
                </p>
                <p className="text-3xl font-bold">
                  {categoryData.products_count ?? 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Stock Value</p>
                <p className="text-2xl font-bold">$4,250</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Category"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Category
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
