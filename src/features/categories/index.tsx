"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Lock, Loader2, Eye } from "lucide-react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers";
import { useCreateCategory } from "@/hooks/categories/useCreateCategory";
import { CategoryFormData } from "@/schemas/categorySchema";
import { dateFormatter } from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { useUpdateCategory } from "@/hooks/categories/useUpdateCategory";
import { useDeleteCategory } from "@/hooks/categories/useDeleteCategory";
import type { Category } from "@/types/categories";
import Link from "next/link";

const Categories = () => {
  const { isAdmin } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create Category
  const { isPending, onSubmit } = useCreateCategory();
  // Get All Categories
  const { categories: fetchedCategories, isPendingCategories } =
    useGetAllCategories();

  // Update Category
  const { onSubmit: onUpdateCategory, isPending: isUpdatingCategory } =
    useUpdateCategory();

  // Delete Category
  const { onSubmit: onDeleteCategory, isPending: isDeletingCategory } =
    useDeleteCategory();

  useEffect(() => {
    if (!isDeletingCategory) {
      setDeletingId(null);
    }
  }, [isDeletingCategory]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
    } else {
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeFormModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSave = (formData: CategoryFormData) => {
    if (editingId) {
      onUpdateCategory({
        id: editingId,
        name: formData.name,
        description: formData.description,
      });
    } else {
      onSubmit(formData);
    }

    closeFormModal();
  };

  const handleDeleteCategory = (id: string) => {
    setDeletingId(id);
    onDeleteCategory(id);
    setDeleteConfirm(null);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Created", accessor: "created_at" },
  ] as const;
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          {!isAdmin && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Lock className="w-4 h-4" /> Admin access required to manage
              categories
            </p>
          )}
        </div>
        <Button onClick={() => handleOpenModal()} disabled={!isAdmin}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-6 py-3 text-left font-semibold"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isPendingCategories && (
              <>
                {skeletonRows.map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-border">
                    {columns.map((col, colIndex) => (
                      <td key={col.accessor} className="px-6 py-4">
                        <Skeleton
                          className={`h-4 ${
                            colIndex === 0
                              ? "w-32"
                              : colIndex === 1
                                ? "w-52"
                                : "w-28"
                          }`}
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
            {fetchedCategories?.map((category) => (
              <tr
                key={category.id}
                className="border-t border-border hover:bg-secondary/50"
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-6 py-4">
                    {col.accessor === "created_at"
                      ? dateFormatter(category.created_at)
                      : category[col.accessor]}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/categories/${category.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    {isAdmin ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled={isUpdatingCategory}
                          size="sm"
                          onClick={() => handleOpenModal(category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(category.id)}
                          className="text-destructive"
                          disabled={isDeletingCategory}
                        >
                          {isDeletingCategory && deletingId === category.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Admin only
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeFormModal}
        title={editingId ? "Edit Category" : "Add Category"}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;
            handleSave({ name, description });
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              placeholder="Category name"
              disabled={isPending}
              name="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Input
              placeholder="Description"
              disabled={isPending}
              name="description"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={closeFormModal}
              type="button"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {fetchedCategories?.find((c) => c.id === deleteConfirm)?.name ??
                  "this category"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeletingCategory}
                onClick={() =>
                  deleteConfirm && handleDeleteCategory(deleteConfirm)
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;
