"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Lock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import { useAuth } from "@/providers";

import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";
import { useGetProductById } from "@/hooks/products/useGetProductById";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";

import { dateFormatter } from "@/utils/dateFormatter";
import { showToast } from "@/utils/toastConfig";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const productId = params.productId as string;

  const { product, isPending, error } = useGetProductById(productId);
  const productData =
    (product as { data?: unknown } | undefined)?.data ?? product;
  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct(productId, () => setIsEditing(false));
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct(productId, () => {
      setShowDeleteModal(false);
      router.push("/products");
    });

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    reorder_level: 0,
    cost_price: 0,
    is_active: true,
  });

  useEffect(() => {
    if (productData) {
      const p = productData as {
        name?: string;
        sku?: string;
        description?: string;
        reorder_level?: string | number;
        cost_price?: string | number;
        is_active?: boolean;
      };
      setFormData({
        name: p.name ?? "",
        sku: p.sku ?? "",
        description: p.description ?? "",
        reorder_level: Number(p.reorder_level) || 0,
        cost_price: Number(p.cost_price) || 0,
        is_active: p.is_active ?? true,
      });
    }
  }, [productData]);

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-3 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>

            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="space-y-4 rounded-lg border border-border p-6">
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

  if (
    !productData ||
    typeof productData !== "object" ||
    !("id" in productData)
  ) {
    return <div>Product not found</div>;
  }

  const p = productData as {
    id: string;
    name: string;
    sku: string;
    description: string;
    category?: { id: string; name: string; description?: string };
    unit_of_measure?: { id: string; name: string; abbreviation?: string };
    reorder_level: string | number;
    cost_price: string | number;
    is_active: boolean;
    stock_level?: { quantity_on_hand?: string; last_updated_at?: string };
    suppliers?: {
      id: string;
      name: string;
      contact_person?: string;
      email?: string;
    }[];
  };

  const qty = Number(p.stock_level?.quantity_on_hand) || 0;
  const costNum = Number(p.cost_price) || 0;

  const handleUpdate = () => {
    const categoryId = p.category?.id;
    const unitId = p.unit_of_measure?.id;

    if (!categoryId || !unitId) {
      showToast({
        type: "ERROR",
        msg: "Product category and unit are required for update.",
      });
      return;
    }

    updateProduct({
      name: formData.name,
      sku: formData.sku,
      description: formData.description,
      category_id: categoryId,
      unit_of_measure_id: unitId,
      reorder_level: formData.reorder_level,
      cost_price: formData.cost_price,
      is_active: formData.is_active,
      supplier_ids: (p.suppliers ?? []).map((s) => s.id),
    });
  };

  const handleDelete = () => {
    deleteProduct();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="mt-1 text-muted-foreground">SKU: {p.sku}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
        {!isAdmin && (
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Admin only</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Description</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Product name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Reorder level
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.reorder_level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reorder_level: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Cost price
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cost_price: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <span className="text-sm font-medium">Active</span>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate} disabled={isUpdatingProduct}>
                    {isUpdatingProduct ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {p.description || "No description."}
              </p>
            )}
          </div>

          {(p.suppliers?.length ?? 0) > 0 && (
            <div className="rounded-lg border border-border p-6">
              <h3 className="mb-4 text-lg font-semibold">Suppliers</h3>
              <ul className="space-y-2 text-sm">
                {(p.suppliers ?? []).map((s) => (
                  <li key={s.id} className="flex flex-col rounded-md border border-border/60 px-3 py-2">
                    <span className="font-medium">{s.name}</span>
                    {s.email ? <span className="text-muted-foreground">{s.email}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Product relations</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-muted-foreground">category</p>
                <p className="text-foreground">{p.category?.name || "—"}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">stock_level</p>
                <p className="text-foreground">
                  {p.stock_level?.quantity_on_hand ?? "0.000"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">suppliers</p>
                <p className="text-foreground">
                  {(p.suppliers ?? []).length > 0
                    ? (p.suppliers ?? []).map((s) => s.name).join(", ")
                    : "—"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">unit_of_measure</p>
                <p className="text-foreground">
                  {p.unit_of_measure
                    ? `${p.unit_of_measure.name}${p.unit_of_measure.abbreviation ? ` (${p.unit_of_measure.abbreviation})` : ""}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-muted-foreground">Product ID</p>
                <p className="font-mono text-foreground">{p.id}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Category</p>
                <p className="text-foreground">
                  {p.category?.name && p.category.name !== "—"
                    ? p.category.name
                    : p.category?.id
                      ? `ID: ${p.category.id}`
                      : "—"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Unit</p>
                <p className="text-foreground">
                  {p.unit_of_measure
                    ? `${p.unit_of_measure.name}${p.unit_of_measure.abbreviation ? ` (${p.unit_of_measure.abbreviation})` : ""}`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Cost price</p>
                <p className="text-foreground">
                  $
                  {costNum.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Reorder level</p>
                <p className="text-foreground">{String(p.reorder_level)}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Status</p>
                <span
                  className={
                    p.is_active
                      ? "rounded bg-green-900/30 px-2 py-1 text-xs font-medium text-green-200"
                      : "rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                  }
                >
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Statistics</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-muted-foreground">Quantity on hand</p>
                <p className="text-3xl font-bold">{qty}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Stock value (est.)</p>
                <p className="text-2xl font-bold">
                  $
                  {(qty * costNum).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Last stock update</p>
                <p className="text-foreground">
                  {p.stock_level?.last_updated_at != null &&
                  p.stock_level.last_updated_at !== ""
                    ? (dateFormatter(String(p.stock_level.last_updated_at)) ??
                      "—")
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <Modal
          isOpen
          onClose={() => setShowDeleteModal(false)}
          title="Delete product"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? "Deleting..." : "Delete product"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
