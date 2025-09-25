import React, { useState, useEffect } from "react";
import { useData } from '../context/DataContext';
import { Sector, Section } from "../types";
import SetorCard from "../components/estrutura/SetorCard";
import SecaoCard from "../components/estrutura/SecaoCard";
import SetorForm from "../components/estrutura/SetorForm";
import SecaoForm from "../components/estrutura/SecaoForm";
import EstruturaTree from "../components/estrutura/EstruturaTree";
import { BuildingIcon, LayersIcon, PlusCircleIcon } from '../components/icons';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }> = ({ children, className, ...props }) => (
  <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`} {...props}>
    {children}
  </button>
);

export default function Estrutura() {
  const { sectors: allSectors, sections: allSections, addSector, updateSector, addSection, updateSection } = useData();

  const [setores, setSetores] = useState<Sector[]>([]);
  const [secoes, setSecoes] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("visao-geral");
  
  const [showSetorForm, setShowSetorForm] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Sector | null>(null);
  
  const [showSecaoForm, setShowSecaoForm] = useState(false);
  const [editingSecao, setEditingSecao] = useState<Section | null>(null);

  useEffect(() => {
    loadData();
  }, [allSectors, allSections]);

  const loadData = () => {
    setIsLoading(true);
    setSetores(allSectors);
    setSecoes(allSections);
    setIsLoading(false);
  };

  const handleSetorSubmit = async (setorData: Omit<Sector, 'id' | 'sections' | 'ativo'>) => {
    try {
      if (editingSetor) {
        updateSector(editingSetor.id, setorData);
      } else {
        addSector(setorData);
      }
      
      setShowSetorForm(false);
      setEditingSetor(null);
    } catch (error) {
      console.error("Erro ao salvar setor:", error);
    }
  };

  const handleSecaoSubmit = async (secaoData: Omit<Section, 'id' | 'ativo'>) => {
    try {
      if (editingSecao) {
        updateSection(editingSecao.id, secaoData);
      } else {
        addSection(secaoData);
      }
      
      setShowSecaoForm(false);
      setEditingSecao(null);
    } catch (error) {
      console.error("Erro ao salvar seção:", error);
    }
  };

  const handleSetorDelete = async (setorId: string) => {
    const secoesDoSetor = secoes.filter(s => s.setor_id === setorId && s.ativo);
    
    if (secoesDoSetor.length > 0) {
      alert("Não é possível excluir este setor pois ele possui seções vinculadas.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este setor?")) {
      try {
        updateSector(setorId, { ativo: false });
      } catch (error) {
        console.error("Erro ao excluir setor:", error);
      }
    }
  };

  const handleSecaoDelete = async (secaoId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta seção?")) {
      try {
        updateSection(secaoId, { ativo: false });
      } catch (error) {
        console.error("Erro ao excluir seção:", error);
      }
    }
  };

  // FIX: Add handlers for edit actions to pass to child components.
  const handleSetorEdit = (setor: Sector) => {
    setEditingSetor(setor);
    setShowSetorForm(true);
  };

  const handleSecaoEdit = (secao: Section) => {
    setEditingSecao(secao);
    setShowSecaoForm(true);
  };

  const stats = {
    setores: setores.filter(s => s.ativo).length,
    secoes: secoes.filter(s => s.ativo).length,
    totalSetores: setores.length,
    totalSecoes: secoes.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Estrutura Organizacional</h2>
        <p className="text-brand-text-light mt-1">Gerencie setores e seções da loja</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Setores Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.setores}</p>
              </div>
              <BuildingIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Seções Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.secoes}</p>
              </div>
              <LayersIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Total Setores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSetores}</p>
              </div>
              <BuildingIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Total Seções</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSecoes}</p>
              </div>
              <LayersIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-brand-gray shadow-sm">
        <div className="p-2 border-b grid grid-cols-3 gap-2">
          <button onClick={() => setActiveTab('visao-geral')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'visao-geral' ? 'bg-blue-100 text-brand-blue' : 'hover:bg-gray-100'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('setores')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'setores' ? 'bg-blue-100 text-brand-blue' : 'hover:bg-gray-100'}`}>Setores</button>
          <button onClick={() => setActiveTab('secoes')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'secoes' ? 'bg-blue-100 text-brand-blue' : 'hover:bg-gray-100'}`}>Seções</button>
        </div>

        <div className="p-6">
        {activeTab === 'visao-geral' && (
          <EstruturaTree 
            setores={setores} 
            secoes={secoes}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'setores' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gerenciar Setores</h3>
              <Button 
                onClick={() => setShowSetorForm(true)}
                className="bg-brand-blue text-white hover:bg-brand-dark-blue px-4 py-2"
              >
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Novo Setor
              </Button>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i}><CardContent><div className="animate-pulse space-y-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></CardContent></Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setores.filter(s => s.ativo).map((setor) => (
                  <SetorCard
                    key={setor.id}
                    setor={setor}
                    secoes={secoes.filter(s => s.setor_id === setor.id && s.ativo)}
                    onEdit={handleSetorEdit}
                    onDelete={handleSetorDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'secoes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gerenciar Seções</h3>
              <Button 
                onClick={() => setShowSecaoForm(true)}
                className="bg-brand-blue text-white hover:bg-brand-dark-blue px-4 py-2"
                disabled={setores.filter(s => s.ativo).length === 0}
              >
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Nova Seção
              </Button>
            </div>

            {setores.filter(s => s.ativo).length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BuildingIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum setor encontrado</h3>
                  <p className="text-gray-500 mb-4">
                    Você precisa criar pelo menos um setor antes de adicionar seções
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveTab("setores");
                      setShowSetorForm(true);
                    }}
                    className="bg-brand-blue text-white hover:bg-brand-dark-blue px-4 py-2"
                  >
                    Criar Primeiro Setor
                  </Button>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}><CardContent><div className="animate-pulse space-y-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></CardContent></Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secoes.filter(s => s.ativo).map((secao) => (
                  <SecaoCard
                    key={secao.id}
                    secao={secao}
                    setores={setores}
                    onEdit={handleSecaoEdit}
                    onDelete={handleSecaoDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Forms */}
      {showSetorForm && (
        <SetorForm
          setor={editingSetor}
          onSubmit={handleSetorSubmit}
          onCancel={() => {
            setShowSetorForm(false);
            setEditingSetor(null);
          }}
        />
      )}

      {showSecaoForm && (
        <SecaoForm
          secao={editingSecao}
          setores={setores.filter(s => s.ativo)}
          onSubmit={handleSecaoSubmit}
          onCancel={() => {
            setShowSecaoForm(false);
            setEditingSecao(null);
          }}
        />
      )}
    </div>
  );
}