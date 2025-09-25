import React from "react";
import Card from "../Card";
import { BuildingIcon, LayersIcon } from "../icons";
import { Sector, Section } from "../../types";

interface EstruturaTreeProps {
  setores: Sector[];
  secoes: Section[];
  isLoading: boolean;
}

export default function EstruturaTree({ setores, secoes, isLoading }: EstruturaTreeProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Visão Geral da Estrutura</h3>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </div>
      </Card>
    );
  }

  const activeSetores = setores.filter(s => s.ativo);

  return (
    <Card className="shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Visão Geral da Estrutura</h3>
        {activeSetores.length === 0 ? (
          <p>Nenhum setor cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {activeSetores.map(setor => (
              <div key={setor.id}>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <BuildingIcon className="w-5 h-5 text-blue-600" />
                  {/* FIX: Use 'name' property from Sector type. */}
                  <h3 className="font-semibold text-blue-800">{setor.name}</h3>
                </div>
                <div className="pl-8 pt-2 space-y-2 border-l-2 border-gray-200 ml-4">
                  {secoes.filter(s => s.setor_id === setor.id && s.ativo).length > 0 ?
                    secoes.filter(s => s.setor_id === setor.id && s.ativo).map(secao => (
                      <div key={secao.id} className="flex items-center gap-2">
                        <LayersIcon className="w-4 h-4 text-green-600" />
                        {/* FIX: Use 'name' property from Section type. */}
                        <p>{secao.name}</p>
                      </div>
                    )) :
                    <p className="text-sm text-gray-500 italic">Nenhuma seção ativa</p>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}