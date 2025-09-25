import React from "react";
import Card from "../Card";
import { Sector, Section } from "../../types";
import { EditIcon, TrashIcon, BuildingIcon, LayersIcon } from "../icons";

interface SetorCardProps {
  setor: Sector;
  secoes: Section[];
  onEdit: (setor: Sector) => void;
  onDelete: (id: string) => void | Promise<void>;
}

export default function SetorCard({ setor, secoes, onEdit, onDelete }: SetorCardProps) {
  return (
    <Card className="shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-5 h-5 text-blue-500" />
            {/* FIX: Use 'name' property from Sector type. */}
            <h3 className="text-lg font-semibold">{setor.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" onClick={() => onEdit(setor)} aria-label="Editar Setor">
              <EditIcon className="w-4 h-4" />
            </button>
            <button className="p-2 text-red-500 hover:bg-red-100 rounded-full" onClick={() => onDelete(setor.id)} aria-label="Excluir Setor">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        {/* FIX: Use 'description' property from Sector type. */}
        <p className="text-sm text-gray-600 mb-4 h-10">{setor.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <LayersIcon className="w-4 h-4" />
          <span>{secoes.length} seções ativas</span>
        </div>
      </div>
    </Card>
  );
}