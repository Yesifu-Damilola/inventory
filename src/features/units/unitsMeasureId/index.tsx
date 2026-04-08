"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { useAuth } from "@/providers";
import Link from "next/link";
import { useGetUnitsMeasureById } from "@/hooks/unitsMeasure/useGetUnitsmeasureById";
import { useDeleteUnitsMeasure } from "@/hooks/unitsMeasure/useDeleteUnitsMeasure";
import { dateFormatter } from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetAllUnitsMeasuresData } from "@/types/unitsMeasure";

export default function UnitsMeasureDetails() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const unitsMeasureId = params.unitsMeasureId as string;

  const { unitsMeasure, isPending, error } =
    useGetUnitsMeasureById(unitsMeasureId);
  const { onSubmit: onDeleteSubmit, isPending: isDeleting } =
    useDeleteUnitsMeasure({
      onSuccess: () => router.push("/units"),
    });
  const unitData =
    (unitsMeasure as { data?: GetAllUnitsMeasuresData } | undefined)?.data ??
    (unitsMeasure as GetAllUnitsMeasuresData | undefined);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (unitData) {
      setFormData({
        name: unitData.name ?? "",
        abbreviation: unitData.abbreviation ?? "",
      });
    }
  }, [unitData]);

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

  if (!unitData) {
    return <div>Unit of measure not found</div>;
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.abbreviation.trim()) return;
    setIsSaving(true);
    try {
      // Mock update — wire to PUT /units-of-measure/{id} when available
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDeleteSubmit(unitsMeasureId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/units">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{unitData.name}</h1>
          <p className="text-muted-foreground mt-1">
            Unit ID: {unitData.id}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Abbreviation</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Unit name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Kilogram"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Abbreviation
                  </label>
                  <Input
                    value={formData.abbreviation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        abbreviation: e.target.value,
                      })
                    }
                    placeholder="e.g., kg"
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
              <p className="text-muted-foreground font-mono text-lg">
                {unitData.abbreviation}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Unit ID</p>
                <p className="font-mono text-foreground">{unitData.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Abbreviation</p>
                <p className="font-mono text-foreground">
                  {unitData.abbreviation}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Created date</p>
                <p className="text-foreground">
                  {unitData.created_at
                    ? dateFormatter(unitData.created_at)
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

          <div className="rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">
                  Products using this unit
                </p>
                <p className="text-3xl font-bold">
                  {(unitData as GetAllUnitsMeasuresData & {
                    products_count?: number;
                  }).products_count ?? 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  Stock value (products)
                </p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          title="Delete unit of measure"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this unit of measure? This action
              cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete unit"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
