import React from "react";
import Card from "../Card";
import { Section, Sector } from "../../types";
import { EditIcon, TrashIcon, LayersIcon } from "../icons";

interface SecaoCardProps {
  secao: Section;
  setores: Sector[];
  onEdit: (secao: Section) => void;
  onDelete: (id: string) => void | Promise<void>;
}

const SecaoCard: React.FC<SecaoCardProps> = ({ secao, setores, onEdit, onDelete }) => {
  const setor = setores.find(s => s.id === secao.setor_id);

  return (
    <Card className="shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <LayersIcon className="w-5 h-5 text-green-500" />
            {/* FIX: Use 'name' property from Section type. */}
            <h3 className="text-lg font-semibold">{secao.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" onClick={() => onEdit(secao)} aria-label="Editar Seção">
              <EditIcon className="w-4 h-4" />
            </button>
            <button className="p-2 text-red-500 hover:bg-red-100 rounded-full" onClick={() => onDelete(secao.id)} aria-label="Excluir Seção">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow">
        {/* FIX: Use 'description' property from Section type. */}
        <p className="text-sm text-gray-600 mb-4 h-10">{secao.description}</p>
        <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
          {/* FIX: Use 'name' property from Sector type. */}
          Setor: {setor?.name || 'N/A'}
        </span>
      </div>
    </Card>
  );
};

export default SecaoCard;
