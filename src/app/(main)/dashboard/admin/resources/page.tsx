"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useResources } from "@/features/resources/hooks";

export default function AdminResourcesPage() {
  const [type, setType] = useState<string>();
  const { data: resources, isLoading } = useResources({ type });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Ressources</h1>
        <Button>Ajouter une ressource</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant={!type ? "default" : "outline"} onClick={() => setType(undefined)}>
          Tous
        </Button>
        <Button variant={type === "driver" ? "default" : "outline"} onClick={() => setType("driver")}>
          Chauffeurs
        </Button>
        <Button variant={type === "vehicle" ? "default" : "outline"} onClick={() => setType("vehicle")}>
          Véhicules
        </Button>
        <Button variant={type === "staff" ? "default" : "outline"} onClick={() => setType("staff")}>
          Personnel
        </Button>
      </div>

      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources?.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.status === "available"
                          ? "bg-green-100 text-green-800"
                          : resource.status === "busy"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
