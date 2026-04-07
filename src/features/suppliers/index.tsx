"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Edit2, Eye, Lock } from "lucide-react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { type Supplier } from "@/components/constant/suppliers";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers";
import {
  SupplierFormSchema,
  type SupplierFormData,
} from "@/schemas/supplierFormSchema";
import { useCreateSupplier } from "@/hooks/suppliers/useCreateSupplier";
import { useGetAllSuppliers } from "@/hooks/suppliers/useGetAllSuppliers";
import { useDeleteSupplier } from "@/hooks/suppliers/useDeleteSupplier";
import { useUpdateSupplier } from "@/hooks/suppliers/useUpateSupplier";

const defaultFormValues: SupplierFormData = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  is_active: true,
};

const Suppliers = () => {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { onSubmit, isPending } = useCreateSupplier();
  const { suppliers, isPendingSuppliers } = useGetAllSuppliers();
  const { onSubmit: onUpdateSupplier, isPending: isUpdatingSupplier } =
    useUpdateSupplier();
  const { onSubmit: onDeleteSupplier, isPending: isDeletingSupplier } =
    useDeleteSupplier();

  const skeletonRows = Array.from({ length: 5 });

  const handleDeleteSupplier = () => {
    if (!deleteConfirm) return;
    onDeleteSupplier(deleteConfirm);
    setDeleteConfirm(null);
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: defaultFormValues,
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingId(supplier.id);
      reset({
        name: supplier.name,
        contact_person: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        is_active: supplier.is_active,
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

  const handleValidSubmit = (formData: SupplierFormData) => {
    if (editingId) {
      onUpdateSupplier({
        id: editingId,
        name: formData.name,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        is_active: formData.is_active,
      });
    } else {
      onSubmit(formData);
    }

    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage supplier contacts and information
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Phone</th>
              <th className="px-6 py-3 text-left font-semibold">Address</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isPendingSuppliers &&
              skeletonRows.map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-36" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            {!isPendingSuppliers &&
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-t border-border hover:bg-secondary/50"
                >
                  <td className="px-6 py-4 font-medium">
                    <Link
                      href={`/suppliers/${supplier.id}`}
                      className="text-primary hover:underline"
                    >
                      {supplier.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{supplier.contact_person}</td>
                  <td className="px-6 py-4">{supplier.email}</td>
                  <td className="px-6 py-4">{supplier.phone}</td>
                  <td className="px-6 py-4">{supplier.address}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={supplier.is_active ? "default" : "secondary"}
                      className={cn(
                        !supplier.is_active &&
                          "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {supplier.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/suppliers/${supplier.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      {isAdmin ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModal(supplier)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(supplier.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
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
        onClose={closeModal}
        title={editingId ? "Edit Supplier" : "Add Supplier"}
        className="max-w-[725px]"
      >
        <form
          onSubmit={handleSubmit(handleValidSubmit)}
          className="space-y-4 max-h-96 overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              placeholder="Supplier name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="mt-2 text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Person
            </label>
            <Input
              placeholder="Contact person"
              aria-invalid={!!errors.contact_person}
              {...register("contact_person")}
            />
            {errors.contact_person?.message && (
              <p className="mt-2 text-sm text-destructive">
                {errors.contact_person.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Email address"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="mt-2 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              placeholder="Phone number"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone?.message && (
              <p className="mt-2 text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input
              placeholder="Street address"
              aria-invalid={!!errors.address}
              {...register("address")}
            />
            {errors.address?.message && (
              <p className="mt-2 text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xs text-muted-foreground">
                    Turn off to mark this supplier as inactive.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={cn(
                      "text-sm tabular-nums",
                      !field.value
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Inactive
                  </span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Supplier active status"
                  />
                  <span
                    className={cn(
                      "text-sm tabular-nums",
                      field.value
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Active
                  </span>
                </div>
              </div>
            )}
          />
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editingId ? isUpdatingSupplier : isPending}
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
            <p>Are you sure you want to delete this supplier?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeletingSupplier}
                onClick={handleDeleteSupplier}
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

export default Suppliers;
