"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateUnitsMeasure } from "@/hooks/unitsMeasure/useCreateUnitsMeasure";
import { useGetAllUnitsMeasures } from "@/hooks/unitsMeasure/useGetAllUnitsMeasures";

import {
  UnitMeasureFormSchema,
  type UnitMeasureFormData,
} from "@/schemas/unitMeasureSchema";
import { dateFormatter } from "@/utils/dateFormatter";
import { GetAllUnitsMeasuresData } from "@/types/unitsMeasure";
import { useUpdateUnitMeasure } from "@/hooks/unitsMeasure/useUpdateUnitMeasure";
import { useDeleteUnitsMeasure } from "@/hooks/unitsMeasure/useDeleteUnitsMeasure";

const Units = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { onSubmit, isPending } = useCreateUnitsMeasure();
  const { unitsMeasures: fetchedUnitsMeasures, isLoadingUnitsMeasures } =
    useGetAllUnitsMeasures();
  const { onSubmit: onUpdateSubmit, isPending: isUpdating } =
    useUpdateUnitMeasure();
  const { onSubmit: onDeleteSubmit, isPending: isDeletingUnitsMeasure } =
    useDeleteUnitsMeasure();

  useEffect(() => {
    if (!isDeletingUnitsMeasure) {
      setDeletingId(null);
    }
  }, [isDeletingUnitsMeasure]);

  const form = useForm<UnitMeasureFormData>({
    resolver: zodResolver(UnitMeasureFormSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
    },
  });

  const handleOpenModal = (unit?: GetAllUnitsMeasuresData) => {
    if (unit) {
      setEditingId(unit.id);
      form.reset({
        name: unit.name,
        abbreviation: unit.abbreviation,
      });
    } else {
      setEditingId(null);
      form.reset({ name: "", abbreviation: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    form.reset({ name: "", abbreviation: "" });
  };

  const handleDeleteUnitsMeasure = (id: string) => {
    setDeletingId(id);
    onDeleteSubmit(id);
    setDeleteConfirm(null);
  };

  const handleValidSubmit = (data: UnitMeasureFormData) => {
    if (editingId) {
      onUpdateSubmit({ id: editingId, ...data });
    } else {
      onSubmit(data);
    }
    closeModal();
  };

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Abbreviation", accessor: "abbreviation" as const },
    { header: "Created", accessor: "created_at" as const },
  ];
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Units of Measure</h1>
          <p className="text-muted-foreground">
            Manage measurement units for products
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
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
            {isLoadingUnitsMeasures && (
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
                                ? "w-16"
                                : "w-28"
                          }`}
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
            {fetchedUnitsMeasures?.map((unit) => (
              <tr
                key={unit.id}
                className="border-t border-border hover:bg-secondary/50"
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-6 py-4">
                    {col.accessor === "created_at"
                      ? dateFormatter(unit.created_at)
                      : unit[col.accessor]}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/units/${unit.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(unit)}
                      disabled={isUpdating}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDeletingUnitsMeasure}
                      onClick={() => setDeleteConfirm(unit.id)}
                      className="text-destructive"
                    >
                      {isDeletingUnitsMeasure && deletingId === unit.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
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
        title={editingId ? "Edit Unit" : "Add Unit"}
      >
        <form
          onSubmit={form.handleSubmit(handleValidSubmit)}
          className="space-y-4"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Kilogram"
              disabled={isPending}
              {...form.register("name")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Abbreviation
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., kg"
              disabled={isPending}
              {...form.register("abbreviation")}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUpdating}>
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
            <p>Are you sure you want to delete this unit?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeletingUnitsMeasure}
                onClick={() =>
                  deleteConfirm && handleDeleteUnitsMeasure(deleteConfirm)
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

export default Units;
