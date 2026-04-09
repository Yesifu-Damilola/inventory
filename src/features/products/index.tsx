"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Edit2, Eye, AlertTriangle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ProductRow } from "@/types/products";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ProductFormSchema,
  type ProductFormData,
} from "@/schemas/productFormSchema";

import { useCreateProducts } from "@/hooks/products/useCreateProducts";
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";
import { useGetAllProducts } from "@/hooks/products/useGetAllProducts";
import { useGetLowStockProducts } from "@/hooks/products/useGetLowStockProducts";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import { useAuth } from "@/providers";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { useGetAllUnitsMeasures } from "@/hooks/unitsMeasure/useGetAllUnitsMeasures";
import { useGetAllSuppliers } from "@/hooks/suppliers/useGetAllSuppliers";

import type { CreateProductsPayload } from "@/types/products";
import { showToast } from "@/utils/toastConfig";
import Link from "next/link";
import { dateFormatter } from "@/utils/dateFormatter";

const SUPPLIER_NAMES_TO_HIDE = ["Olamide Sundat", "Gbenga Yesifu"];

const defaultFormValues: ProductFormData = {
  name: "",
  sku: "",
  description: "",
  category: "",
  unit: "",
  suppliers: [],
  cost_price: 0,
  reorder_level: 0,
  is_active: true,
};

const ALL_FILTER_VALUE = "__all__";
const DEFAULT_PER_PAGE = 10;

const Products = () => {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialPerPage = Number(searchParams.get("per_page"));
  const safeInitialPerPage =
    Number.isFinite(initialPerPage) && initialPerPage > 0
      ? initialPerPage
      : DEFAULT_PER_PAGE;

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    searchParams.get("category_id") ?? ALL_FILTER_VALUE,
  );
  const [selectedSupplierId, setSelectedSupplierId] = useState(
    searchParams.get("supplier_id") ?? ALL_FILTER_VALUE,
  );
  const [perPage, setPerPage] = useState(safeInitialPerPage);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showLowStockModal, setShowLowStockModal] = useState(false);

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProducts();

  const { categories, isPendingCategories } = useGetAllCategories();
  const { unitsMeasures, isLoadingUnitsMeasures } = useGetAllUnitsMeasures();
  const { suppliers, isPendingSuppliers } = useGetAllSuppliers();
  const { products: fetchedProducts, isPendingProducts } = useGetAllProducts({
    category_id:
      selectedCategoryId === ALL_FILTER_VALUE ? undefined : selectedCategoryId,
    supplier_id:
      selectedSupplierId === ALL_FILTER_VALUE ? undefined : selectedSupplierId,
    search: searchTerm.trim() || undefined,
    per_page: perPage,
  });

  const { lowStockProducts, isPendingLowStock } = useGetLowStockProducts({
    enabled: isAdmin && showLowStockModal,
  });

  const visibleSuppliers = suppliers.filter(
    (s) => !SUPPLIER_NAMES_TO_HIDE.includes(s.name),
  );

  // If everything is hidden (or the hide list becomes outdated), fall back to
  // showing all suppliers so users can still select at least one.
  const suppliersToSelect =
    visibleSuppliers.length > 0 ? visibleSuppliers : suppliers;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaultFormValues,
  });

  const handleOpenModal = (product?: ProductRow) => {
    if (product) {
      setEditingId(product.id);

      const categoryName =
        categories.find((c) => c.id === product.category_id)?.name ?? "";

      const unitName =
        unitsMeasures.find((u) => u.id === product.unit_id)?.name ?? "";

      reset({
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: categoryName,
        unit: unitName,
        // Keep supplier id even if it's hidden from the checkbox list.
        suppliers: [product.supplier_id],
        cost_price: product.cost,
        reorder_level: product.reorder_level,
        is_active: true,
      });
    } else {
      setEditingId(null);
      reset(defaultFormValues);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    reset(defaultFormValues);
  };

  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct(editingId ?? "", closeModal);
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct(deleteConfirm ?? "", () => setDeleteConfirm(null));

  const onSubmit = (formValues: ProductFormData) => {
    const categoryId =
      categories.find((c) => c.name === formValues.category)?.id || "";
    const unitId =
      unitsMeasures.find((u) => u.name === formValues.unit)?.id || "";
    const supplierIds = suppliers
      .filter((s) => formValues.suppliers.includes(s.id))
      .map((s) => s.id);

    if (!categoryId || !unitId || supplierIds.length === 0) {
      showToast({
        type: "ERROR",
        msg: "Select a valid Category, Unit, and at least one Supplier.",
      });
      return;
    }

    const payload: CreateProductsPayload = {
      name: formValues.name,
      sku: formValues.sku,
      description: formValues.description,
      category_id: categoryId,
      unit_of_measure_id: unitId,
      supplier_ids: supplierIds,
      reorder_level: formValues.reorder_level,
      cost_price: formValues.cost_price,
      is_active: formValues.is_active,
    };

    if (editingId) {
      updateProduct({
        name: formValues.name,
        sku: formValues.sku,
        description: formValues.description,
        category_id: categoryId,
        unit_of_measure_id: unitId,
        reorder_level: formValues.reorder_level,
        cost_price: formValues.cost_price,
        is_active: formValues.is_active,
        supplier_ids: supplierIds,
      });
      return;
    }

    createProduct(payload, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDeleteProduct = () => {
    if (!deleteConfirm) return;
    deleteProduct();
  };

  useEffect(() => {
    if (!isPendingProducts) setProducts(fetchedProducts);
  }, [fetchedProducts, isPendingProducts]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) params.set("search", trimmedSearch);
    else params.delete("search");

    if (selectedCategoryId !== ALL_FILTER_VALUE) {
      params.set("category_id", selectedCategoryId);
    } else {
      params.delete("category_id");
    }

    if (selectedSupplierId !== ALL_FILTER_VALUE) {
      params.set("supplier_id", selectedSupplierId);
    } else {
      params.delete("supplier_id");
    }

    if (perPage > 0 && perPage !== DEFAULT_PER_PAGE) {
      params.set("per_page", String(perPage));
    } else {
      params.delete("per_page");
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }
  }, [
    pathname,
    perPage,
    router,
    searchParams,
    searchTerm,
    selectedCategoryId,
    selectedSupplierId,
  ]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory products
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {isAdmin && (
            <Button
              type="button"
              variant="outline"
              className="border-amber-500/40 bg-amber-500/5 text-amber-900 hover:bg-amber-500/10 dark:text-amber-100"
              onClick={() => setShowLowStockModal(true)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" aria-hidden />
              Low stock
            </Button>
          )}
          <Button
            onClick={() => handleOpenModal()}
            disabled={!isAdmin}
            variant={!isAdmin ? "outline" : "default"}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="font-medium text-destructive">
            Access denied. You don't have permission.
          </p>
        </div>
      )}

      {/* TABLE */}
      {isAdmin && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSupplierId}
              onValueChange={setSelectedSupplierId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All Suppliers</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(perPage)}
              onValueChange={(value) => setPerPage(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">SKU</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Unit</th>
                  <th className="px-6 py-3 text-left font-semibold">Cost</th>

                  <th className="px-6 py-3 text-left font-semibold">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isPendingProducts
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-[min(100%,220px)] max-w-full" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-20" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-14" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-10" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
                            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
                          </div>
                        </td>
                      </tr>
                    ))
                  : products.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.sku}</td>
                        <td className="px-6 py-4">
                          {product.category_name || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {product.unit_name
                            ? `${product.unit_name}${product.unit_abbreviation ? ` (${product.unit_abbreviation})` : ""}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          ${product.cost.toFixed(2)}
                        </td>

                        <td className="px-6 py-4">{product.reorder_level}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              product.is_active ? "default" : "secondary"
                            }
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {dateFormatter(product.created_at)}
                        </td>

                        <td className="px-6 py-4 flex gap-2">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => handleOpenModal(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirm(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAdmin && showLowStockModal}
        onClose={() => setShowLowStockModal(false)}
        title="Low stock products"
        className="max-w-3xl"
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Products at or below reorder level. Restock these items first.
        </p>
        {isPendingLowStock ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : lowStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No low-stock products right now.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/80">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Product</th>
                  <th className="px-4 py-2 text-left font-semibold">SKU</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    On hand
                  </th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Reorder
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-4 py-2 font-medium">{row.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.sku}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {row.quantity_on_hand}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                      {row.reorder_level}
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/products/${row.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? "Edit Product" : "Add Product"}
        className="max-w-[725px]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Name" {...register("name")} />

          <Input placeholder="SKU" {...register("sku")} />

          <Textarea placeholder="Description" {...register("description")} />

          {/* CATEGORY */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category?.message && (
            <p className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}

          {/* UNIT */}
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>

                <SelectContent>
                  {unitsMeasures.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.unit?.message && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}

          {/* SUPPLIERS */}
          <Controller
            name="suppliers"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Suppliers</p>
                    <p className="text-xs text-muted-foreground">
                      Select at least one supplier.
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        field.onChange(suppliersToSelect.map((s) => s.id))
                      }
                      disabled={
                        isPendingSuppliers || suppliersToSelect.length === 0
                      }
                    >
                      Select all
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => field.onChange([])}
                      disabled={(field.value ?? []).length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {isPendingSuppliers ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-8 w-full" />
                    ))}
                  </div>
                ) : suppliersToSelect.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No suppliers available.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {suppliersToSelect.map((s) => {
                      const checked = (field.value ?? []).includes(s.id);

                      return (
                        <label key={s.id} className="flex gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(val) => {
                              const current = field.value ?? [];
                              const isChecked =
                                val === true || val === "indeterminate";

                              const next = isChecked
                                ? current.includes(s.id)
                                  ? current
                                  : [...current, s.id]
                                : current.filter((id) => id !== s.id);

                              field.onChange(next);
                            }}
                          />
                          <span className="leading-6">{s.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {(() => {
                  const selectedIds = field.value ?? [];
                  if (selectedIds.length === 0) return null;

                  const selectedNames = suppliers
                    .filter((s) => selectedIds.includes(s.id))
                    .map((s) => s.name);

                  if (selectedNames.length === 0) return null;

                  return (
                    <div className="flex flex-wrap gap-2">
                      {selectedNames.map((name) => (
                        <Badge key={name} variant="secondary">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          />
          {errors.suppliers?.message && (
            <p className="text-sm text-destructive">
              {errors.suppliers.message}
            </p>
          )}

          <Input
            type="number"
            placeholder="Cost Price"
            {...register("cost_price", { valueAsNumber: true })}
          />
          {errors.cost_price?.message && (
            <p className="text-sm text-destructive">
              {errors.cost_price.message}
            </p>
          )}

          <Input
            type="number"
            placeholder="Reorder Level"
            {...register("reorder_level", { valueAsNumber: true })}
          />
          {errors.reorder_level?.message && (
            <p className="text-sm text-destructive">
              {errors.reorder_level.message}
            </p>
          )}

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isCreatingProduct ||
                isUpdatingProduct ||
                isDeletingProduct ||
                isPendingCategories ||
                isLoadingUnitsMeasures ||
                isPendingSuppliers
              }
            >
              {editingId ? "Update" : "Create"}
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
                {products.find((p) => p.id === deleteConfirm)?.name ??
                  "this product"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeletingProduct}
                onClick={handleDeleteProduct}
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

export default Products;
