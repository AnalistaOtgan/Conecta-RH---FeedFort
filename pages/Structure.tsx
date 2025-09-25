import React, { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { PlusCircleIcon, BuildingIcon, EditIcon, TrashIcon } from '../components/icons';
import { Sector, Section } from '../types';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 font-semibold rounded-md ${active ? 'bg-blue-100 text-brand-blue' : 'text-brand-text-light hover:bg-gray-100'}`}>
        {children}
    </button>
);

const SectorCard: React.FC<{ sector: Sector }> = ({ sector }) => (
    <Card className="!p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-lg flex items-center"><BuildingIcon className="w-5 h-5 mr-2 text-brand-blue"/>{sector.name}</h4>
                <p className="text-sm text-brand-text-light mt-1">{sector.description}</p>
            </div>
            <div className="flex space-x-1">
                <button className="p-2 text-brand-text-light hover:text-brand-blue"><EditIcon className="w-4 h-4"/></button>
                <button className="p-2 text-brand-text-light hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
        <p className="text-sm mt-4 text-brand-text-light">{sector.sections} seções ativas</p>
    </Card>
);

const SectionCard: React.FC<{ section: Section }> = ({ section }) => (
    <Card className="!p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold">{section.name}</h4>
                <p className="text-sm text-brand-text-light mt-1">{section.description}</p>
            </div>
            <div className="flex space-x-1">
                <button className="p-2 text-brand-text-light hover:text-brand-blue"><EditIcon className="w-4 h-4"/></button>
                <button className="p-2 text-brand-text-light hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
         <p className="text-xs mt-3 text-brand-text-light font-semibold bg-gray-100 px-2 py-1 rounded-full inline-block">Setor: {section.sector}</p>
    </Card>
);

const Structure: React.FC = () => {
  const { sectors, sections, addSector, addSection } = useData();
  const [activeTab, setActiveTab] = useState('Sectors');
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  // State for new sector modal
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorDesc, setNewSectorDesc] = useState('');

  // State for new section modal
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [selectedSectorForSection, setSelectedSectorForSection] = useState('');

  const handleAddSector = () => {
    if(newSectorName.trim() === '') return alert('O nome do setor é obrigatório.');
    addSector({ name: newSectorName, description: newSectorDesc });
    setNewSectorName('');
    setNewSectorDesc('');
    setIsSectorModalOpen(false);
  };
  
  const handleAddSection = () => {
    if(newSectionName.trim() === '') return alert('O nome da seção é obrigatório.');
    if(selectedSectorForSection === '') return alert('Selecione um setor.');
    addSection({ name: newSectionName, sector: selectedSectorForSection, description: newSectionDesc });
    setNewSectionName('');
    setNewSectionDesc('');
    setSelectedSectorForSection('');
    setIsSectionModalOpen(false);
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'General':
              const groupedSections = sections.reduce((acc, section) => {
                  if(!acc[section.sector]) acc[section.sector] = [];
                  acc[section.sector].push(section);
                  return acc;
              }, {} as {[key: string]: Section[]});

              return (
                <Card>
                    <h3 className="text-xl font-bold mb-4">Visão Geral da Estrutura</h3>
                    <div className="space-y-4">
                        {sectors.map(sector => (
                            <div key={sector.id}>
                                <h4 className="font-bold text-lg flex items-center"><BuildingIcon className="w-5 h-5 mr-2 text-brand-blue"/>{sector.name}</h4>
                                <ul className="list-disc pl-10 mt-2 space-y-1 text-brand-text">
                                    {(groupedSections[sector.name] || []).map(section => (
                                        <li key={section.id}>{section.name}</li>
                                    ))}
                                    {(groupedSections[sector.name] || []).length === 0 && <li className="text-gray-400">Nenhuma seção cadastrada</li>}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Card>
              );
          case 'Sectors':
              return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectors.map(s => <SectorCard key={s.id} sector={s} />)}
                 </div>
              );
          case 'Sections':
              return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map(s => <SectionCard key={s.id} section={s} />)}
                 </div>
              );
          default: return null;
      }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Estrutura Organizacional</h2>
        <p className="text-brand-text-light">Gerencie setores e seções da loja</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card> <p className="text-sm text-brand-text-light">Setores Ativos</p> <p className="text-2xl font-bold">{sectors.length}</p> </Card>
          <Card> <p className="text-sm text-brand-text-light">Seções Ativas</p> <p className="text-2xl font-bold">{sections.length}</p> </Card>
          <Card> <p className="text-sm text-brand-text-light">Total Setores</p> <p className="text-2xl font-bold">{sectors.length}</p> </Card>
          <Card> <p className="text-sm text-brand-text-light">Total Seções</p> <p className="text-2xl font-bold">{sections.length}</p> </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
                <TabButton active={activeTab === 'General'} onClick={() => setActiveTab('General')}>Visão Geral</TabButton>
                <TabButton active={activeTab === 'Sectors'} onClick={() => setActiveTab('Sectors')}>Setores</TabButton>
                <TabButton active={activeTab === 'Sections'} onClick={() => setActiveTab('Sections')}>Seções</TabButton>
            </div>
            { activeTab !== 'General' &&
              <button onClick={() => activeTab === 'Sectors' ? setIsSectorModalOpen(true) : setIsSectionModalOpen(true)} className="bg-brand-blue hover:bg-brand-dark-blue text-white font-bold py-2 px-4 rounded-lg flex items-center">
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  {activeTab === 'Sectors' ? 'Novo Setor' : 'Nova Seção'}
              </button>
            }
        </div>
        {renderContent()}
      </Card>
      
       <Modal isOpen={isSectorModalOpen} onClose={() => setIsSectorModalOpen(false)} title="Novo Setor">
         <div className="space-y-4">
            <input type="text" placeholder="Nome do Setor" className="w-full p-2 border rounded-md" value={newSectorName} onChange={(e) => setNewSectorName(e.target.value)} />
            <textarea placeholder="Descrição" className="w-full p-2 border rounded-md" rows={3} value={newSectorDesc} onChange={(e) => setNewSectorDesc(e.target.value)}></textarea>
             <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setIsSectorModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                <button onClick={handleAddSector} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
            </div>
         </div>
       </Modal>
       
       <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Nova Seção">
        <div className="space-y-4">
            <input type="text" placeholder="Nome da Seção" className="w-full p-2 border rounded-md" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} />
             <select className="w-full p-2 border rounded-md bg-white" value={selectedSectorForSection} onChange={(e) => setSelectedSectorForSection(e.target.value)}>
                <option value="">Selecione um setor</option>
                {sectors.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <textarea placeholder="Descrição" className="w-full p-2 border rounded-md" rows={3} value={newSectionDesc} onChange={(e) => setNewSectionDesc(e.target.value)}></textarea>
             <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setIsSectionModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                <button onClick={handleAddSection} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
            </div>
         </div>
       </Modal>

    </div>
  );
};

export default Structure;