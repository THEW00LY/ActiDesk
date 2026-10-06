"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createProject } from "@/app/actions/projects";

interface ClientOption {
  id: string;
  name: string;
}

interface CreateProjectDialogProps {
  clients: ClientOption[];
}

export function CreateProjectDialog({ clients }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      //appel server action
      await createProject(formData);
      //on ferme la boite de dialog et on reset le formulaire
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Une errreur est survenue lors de la création du projet.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Nouveau projet
        </DialogTrigger>

        <DialogContent className="sm:max-w-106.25 bg-white">
          <DialogHeader>
            <DialogTitle>Créer un projet</DialogTitle>
            <DialogDescription>Associez ce projet à un de vos clients.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom du projet *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ex: Refonte application Next.js"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="clientId" className="text-sm font-medium text-gray-700">
                Client associé *
              </label>
              <select
                id="clientId"
                name="clientId"
                required
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Sélectionnez un client
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="budget" className="text-sm font-medium text-gray-700">
                  Budget (€)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="numder"
                  step="50"
                  placeholder="2500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                  Échéance
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Création..." : "Créer le projet"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
