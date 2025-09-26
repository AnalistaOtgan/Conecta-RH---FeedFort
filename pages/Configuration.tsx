import React, { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { Activity, Occurrence, OccurrenceCategory } from '../types';
import { PlusCircleIcon, StarIcon, AlertTriangleIcon, EditIcon, TrashIcon, ChevronDownIcon } from '../components/icons';
import ConfirmationDialog from '../components/ConfirmationDialog';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 font-semibold rounded-md ${active ? 'bg-blue-100 text-brand-blue' : 'text-brand-text-light hover:bg-gray-100'}`}>
        {children}
    </button>
);

const occurrenceTagColors: {[key in OccurrenceCategory]: string} = {
    [OccurrenceCategory.DesempenhoExcepcional]: 'bg-blue-100 text-blue-700',
    [OccurrenceCategory.PrecisaMelhorar]: 'bg-yellow-100 text-yellow-700',
    [OccurrenceCategory.Positivo]: 'bg-green-100 text-green-700',
    [OccurrenceCategory.ViolacaoPolitica]: 'bg-red-100 text-red-700',
}

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}
const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onEdit, onDelete }) => (
    <Card className="!p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold">{activity.name}</h4>
                <p className="text-sm text-brand-text-light mt-1">{activity.description}</p>
            </div>
            <div className="flex space-x-1">
                <button onClick={() => onEdit(activity)} className="p-2 text-brand-text-light hover:text-brand-blue"><EditIcon className="w-4 h-4"/></button>
                <button onClick={() => onDelete(activity.id)} className="p-2 text-brand-text-light hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
        <div className="mt-3 flex items-center space-x-2">
            <span className="text-xs font-semibold bg-gray-100 text-brand-text-light px-2 py-1 rounded-full">{activity.attribute}</span>
            <span className="text-xs font-semibold bg-gray-100 text-brand-text-light px-2 py-1 rounded-full">Peso: {activity.weight}</span>
        </div>
    </Card>
);


interface OccurrenceCardProps {
  occurrence: Occurrence;
  onEdit: (occurrence: Occurrence) => void;
  onDelete: (id: string) => void;
}
const OccurrenceCard: React.FC<OccurrenceCardProps> = ({ occurrence, onEdit, onDelete }) => (
    <Card className="!p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold">{occurrence.name}</h4>
                <p className="text-sm text-brand-text-light mt-1">{occurrence.description}</p>
            </div>
             <div className="flex space-x-1">
                <button onClick={() => onEdit(occurrence)} className="p-2 text-brand-text-light hover:text-brand-blue"><EditIcon className="w-4 h-4"/></button>
                <button onClick={() => onDelete(occurrence.id)} className="p-2 text-brand-text-light hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
         <div className="mt-3 flex items-center space-x-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${occurrenceTagColors[occurrence.category]}`}>
                {occurrence.category}
            </span>
            <span className={`text-xs font-bold ${occurrence.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Impacto: {occurrence.impact > 0 ? '+' : ''}{occurrence.impact}
            </span>
        </div>
    </Card>
);


const Configuration: React.FC = () => {
  const { 
      activities, 
      occurrences, 
      addActivity, 
      updateActivity, 
      deleteActivity, 
      addOccurrence, 
      updateOccurrence,
      deleteOccurrence
  } = useData();
  const [activeTab, setActiveTab] = useState('Activities');
  
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({ name: '', description: '', attribute: 'Comunicação', weight: 5 });

  const [isOccurrenceModalOpen, setOccurrenceModalOpen] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null);
  const [newOccurrence, setNewOccurrence] = useState<Omit<Occurrence, 'id'>>({ name: '', description: '', category: OccurrenceCategory.Positivo, impact: 0 });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ id: string, name: string, type: 'activity' | 'occurrence' } | null>(null);


  const handleNewActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewActivity(prev => ({ ...prev, [name]: name === 'weight' ? parseInt(value) : value }));
  };

  const handleNewOccurrenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewOccurrence(prev => ({ ...prev, [name]: name === 'impact' ? parseFloat(value) : value }));
  };
  
  const closeActivityModal = () => {
    setActivityModalOpen(false);
    setEditingActivity(null);
    setNewActivity({ name: '', description: '', attribute: 'Comunicação', weight: 5 });
  };

  const handleSaveActivity = () => {
    if (newActivity.name.trim() === '') return alert('O nome da atividade é obrigatório.');
    if (editingActivity) {
      updateActivity(editingActivity.id, newActivity);
    } else {
      addActivity(newActivity);
    }
    closeActivityModal();
  };

  const closeOccurrenceModal = () => {
    setOccurrenceModalOpen(false);
    setEditingOccurrence(null);
    setNewOccurrence({ name: '', description: '', category: OccurrenceCategory.Positivo, impact: 0 });
  }

  const handleSaveOccurrence = () => {
    if (newOccurrence.name.trim() === '') return alert('O nome da ocorrência é obrigatório.');
    if (editingOccurrence) {
      updateOccurrence(editingOccurrence.id, newOccurrence);
    } else {
      addOccurrence(newOccurrence);
    }
    closeOccurrenceModal();
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setNewActivity({
      name: activity.name,
      description: activity.description,
      attribute: activity.attribute,
      weight: activity.weight,
    });
    setActivityModalOpen(true);
  };

  const handleDeleteActivity = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if(activity) {
        setDeletingItem({ id, name: activity.name, type: 'activity' });
        setConfirmOpen(true);
    }
  };

  const handleEditOccurrence = (occurrence: Occurrence) => {
    setEditingOccurrence(occurrence);
    setNewOccurrence({
        name: occurrence.name,
        description: occurrence.description,
        category: occurrence.category,
        impact: occurrence.impact,
    });
    setOccurrenceModalOpen(true);
  };
  
  const handleDeleteOccurrence = (id: string) => {
      const occurrence = occurrences.find(o => o.id === id);
      if (occurrence) {
          setDeletingItem({ id, name: occurrence.name, type: 'occurrence' });
          setConfirmOpen(true);
      }
  };

  const confirmDelete = () => {
      if (!deletingItem) return;
      if (deletingItem.type === 'activity') {
          deleteActivity(deletingItem.id);
      } else {
          deleteOccurrence(deletingItem.id);
      }
      setConfirmOpen(false);
      setDeletingItem(null);
  };


  const renderContent = () => {
      switch(activeTab) {
          case 'Activities':
              return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map(a => <ActivityCard key={a.id} activity={a} onEdit={handleEditActivity} onDelete={handleDeleteActivity} />)}
                 </div>
              );
          case 'Occurrences':
              return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {occurrences.map(o => <OccurrenceCard key={o.id} occurrence={o} onEdit={handleEditOccurrence} onDelete={handleDeleteOccurrence} />)}
                 </div>
              );
          default: return null;
      }
  }

  const standardInputClasses = "block w-full px-3 py-2 bg-white border border-brand-gray rounded-lg shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
  const standardSelectClasses = "block w-full appearance-none rounded-lg border border-brand-gray bg-white px-3 py-2 pr-8 text-brand-text shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Configurações do Sistema</h2>
        <p className="text-brand-text-light">Configure atividades e ocorrências para feedback</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card> <p className="text-sm text-brand-text-light flex items-center"><StarIcon className="w-4 h-4 mr-2 text-yellow-500"/>Atividades Ativas</p> <p className="text-2xl font-bold">{activities.length}</p> </Card>
          <Card> <p className="text-sm text-brand-text-light flex items-center"><AlertTriangleIcon className="w-4 h-4 mr-2 text-red-500"/>Ocorrências Ativas</p> <p className="text-2xl font-bold">{occurrences.length}</p> </Card>
          <Card> <p className="text-sm text-brand-text-light flex items-center"><StarIcon className="w-4 h-4 mr-2 text-blue-500"/>Total Atividades</p> <p className="text-2xl font-bold">{activities.length}</p> </Card>
          <Card> <p className="text-sm text-brand-text-light flex items-center"><AlertTriangleIcon className="w-4 h-4 mr-2 text-red-500"/>Total Ocorrências</p> <p className="text-2xl font-bold">{occurrences.length}</p> </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
                <TabButton active={activeTab === 'Activities'} onClick={() => setActiveTab('Activities')}>Atividades Observadas</TabButton>
                <TabButton active={activeTab === 'Occurrences'} onClick={() => setActiveTab('Occurrences')}>Ocorrências</TabButton>
            </div>
            <button onClick={() => activeTab === 'Activities' ? setActivityModalOpen(true) : setOccurrenceModalOpen(true)} className="bg-brand-blue hover:bg-brand-dark-blue text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                {activeTab === 'Activities' ? 'Nova Atividade' : 'Nova Ocorrência'}
            </button>
        </div>
        {renderContent()}
      </Card>

        <Modal isOpen={isActivityModalOpen} onClose={closeActivityModal} title={editingActivity ? "Editar Atividade" : "Nova Atividade"}>
             <div className="space-y-4">
                <input type="text" name="name" placeholder="Nome da Atividade" value={newActivity.name} onChange={handleNewActivityChange} className={standardInputClasses}/>
                <textarea name="description" placeholder="Descrição" value={newActivity.description} onChange={handleNewActivityChange} className={standardInputClasses} rows={3}></textarea>
                <div className="relative">
                    <select name="attribute" value={newActivity.attribute} onChange={handleNewActivityChange} className={standardSelectClasses}>
                        <option value="Comunicação">Comunicação</option>
                        <option value="Iniciativa">Iniciativa</option>
                        <option value="Organização">Organização</option>
                        <option value="Trabalho em Equipe">Trabalho em Equipe</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Peso/Importância: {newActivity.weight}</label>
                    <input type="range" name="weight" min="1" max="10" value={newActivity.weight} onChange={handleNewActivityChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                </div>
                 <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={closeActivityModal} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                    <button onClick={handleSaveActivity} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
                </div>
             </div>
        </Modal>

        <Modal isOpen={isOccurrenceModalOpen} onClose={closeOccurrenceModal} title={editingOccurrence ? "Editar Ocorrência" : "Nova Ocorrência"}>
             <div className="space-y-4">
                <input type="text" name="name" placeholder="Nome da Ocorrência" value={newOccurrence.name} onChange={handleNewOccurrenceChange} className={standardInputClasses}/>
                <textarea name="description" placeholder="Descrição" value={newOccurrence.description} onChange={handleNewOccurrenceChange} className={standardInputClasses} rows={3}></textarea>
                 <div className="relative">
                    <select name="category" value={newOccurrence.category} onChange={handleNewOccurrenceChange} className={standardSelectClasses}>
                        {Object.values(OccurrenceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Impacto na Pontuação: {newOccurrence.impact}</label>
                    <input type="range" name="impact" min="-5" max="5" step="0.5" value={newOccurrence.impact} onChange={handleNewOccurrenceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                </div>
                 <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={closeOccurrenceModal} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                    <button onClick={handleSaveOccurrence} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
                </div>
             </div>
        </Modal>

        {deletingItem && (
            <ConfirmationDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={`Confirmar Exclusão de ${deletingItem.type === 'activity' ? 'Atividade' : 'Ocorrência'}`}
                description={`Tem certeza que deseja excluir "${deletingItem.name}"? Esta ação não pode ser desfeita.`}
            />
        )}

    </div>
  );
};

export default Configuration;