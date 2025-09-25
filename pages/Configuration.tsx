import React, { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { Activity, Occurrence, OccurrenceCategory } from '../types';
import { PlusCircleIcon, StarIcon, AlertTriangleIcon, EditIcon, TrashIcon } from '../components/icons';

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

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
    <Card className="!p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold">{activity.name}</h4>
                <p className="text-sm text-brand-text-light mt-1">{activity.description}</p>
            </div>
            <div className="flex space-x-1">
                <button className="p-2 text-brand-text-light hover:text-brand-blue"><EditIcon className="w-4 h-4"/></button>
                <button className="p-2 text-brand-text-light hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
        </div>
        <div className="mt-3 flex items-center space-x-2">
            <span className="text-xs font-semibold bg-gray-100 text-brand-text-light px-2 py-1 rounded-full">{activity.attribute}</span>
            <span className="text-xs font-semibold bg-gray-100 text-brand-text-light px-2 py-1 rounded-full">Peso: {activity.weight}</span>
        </div>
    </Card>
);

const OccurrenceCard: React.FC<{ occurrence: Occurrence }> = ({ occurrence }) => (
    <Card className="!p-4">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold">{occurrence.name}</h4>
                <p className="text-sm text-brand-text-light mt-1">{occurrence.description}</p>
            </div>
             <div className="flex space-x-1">
                <button className="p-2 text-brand-text-light hover:text-brand-blue"><EditIcon className="w-4 h-4"/></button>
                <button className="p-2 text-brand-text-light hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
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
  const { activities, occurrences, addActivity, addOccurrence } = useData();
  const [activeTab, setActiveTab] = useState('Activities');
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [isOccurrenceModalOpen, setOccurrenceModalOpen] = useState(false);
  
  const [newActivity, setNewActivity] = useState({ name: '', description: '', attribute: 'comunicacao', weight: 5 });
  const [newOccurrence, setNewOccurrence] = useState({ name: '', description: '', category: OccurrenceCategory.Positivo, impact: 0 });

  const handleNewActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewActivity(prev => ({ ...prev, [name]: name === 'weight' ? parseInt(value) : value }));
  };

  const handleNewOccurrenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewOccurrence(prev => ({ ...prev, [name]: name === 'impact' ? parseInt(value) : value }));
  };
  
  const handleAddActivity = () => {
    if (newActivity.name.trim() === '') return alert('O nome da atividade é obrigatório.');
    addActivity(newActivity);
    setActivityModalOpen(false);
    setNewActivity({ name: '', description: '', attribute: 'comunicacao', weight: 5 });
  };

  const handleAddOccurrence = () => {
    if (newOccurrence.name.trim() === '') return alert('O nome da ocorrência é obrigatório.');
    addOccurrence(newOccurrence);
    setOccurrenceModalOpen(false);
    setNewOccurrence({ name: '', description: '', category: OccurrenceCategory.Positivo, impact: 0 });
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'Activities':
              return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
                 </div>
              );
          case 'Occurrences':
              return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {occurrences.map(o => <OccurrenceCard key={o.id} occurrence={o} />)}
                 </div>
              );
          default: return null;
      }
  }

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

        <Modal isOpen={isActivityModalOpen} onClose={() => setActivityModalOpen(false)} title="Nova Atividade">
             <div className="space-y-4">
                <input type="text" name="name" placeholder="Nome da Atividade" value={newActivity.name} onChange={handleNewActivityChange} className="w-full p-2 border rounded-md"/>
                <textarea name="description" placeholder="Descrição" value={newActivity.description} onChange={handleNewActivityChange} className="w-full p-2 border rounded-md" rows={3}></textarea>
                <select name="attribute" value={newActivity.attribute} onChange={handleNewActivityChange} className="w-full p-2 border rounded-md bg-white">
                    <option value="comunicacao">Comunicação</option>
                    <option value="iniciativa">Iniciativa</option>
                    <option value="organizacao">Organização</option>
                    <option value="trabalho equipe">Trabalho em Equipe</option>
                </select>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Peso/Importância: {newActivity.weight}</label>
                    <input type="range" name="weight" min="1" max="10" value={newActivity.weight} onChange={handleNewActivityChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={() => setActivityModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                    <button onClick={handleAddActivity} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
                </div>
             </div>
        </Modal>

        <Modal isOpen={isOccurrenceModalOpen} onClose={() => setOccurrenceModalOpen(false)} title="Nova Ocorrência">
             <div className="space-y-4">
                <input type="text" name="name" placeholder="Nome da Ocorrência" value={newOccurrence.name} onChange={handleNewOccurrenceChange} className="w-full p-2 border rounded-md"/>
                <textarea name="description" placeholder="Descrição" value={newOccurrence.description} onChange={handleNewOccurrenceChange} className="w-full p-2 border rounded-md" rows={3}></textarea>
                 <select name="category" value={newOccurrence.category} onChange={handleNewOccurrenceChange} className="w-full p-2 border rounded-md bg-white">
                    {Object.values(OccurrenceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Impacto na Pontuação: {newOccurrence.impact}</label>
                    <input type="range" name="impact" min="-5" max="5" value={newOccurrence.impact} onChange={handleNewOccurrenceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={() => setOccurrenceModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                    <button onClick={handleAddOccurrence} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
                </div>
             </div>
        </Modal>

    </div>
  );
};

export default Configuration;