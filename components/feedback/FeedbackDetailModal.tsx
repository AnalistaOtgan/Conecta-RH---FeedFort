import React from 'react';
import Modal from '../Modal';
import { DetailedFeedback } from '../../types';
import { StarIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, UserCheckIcon } from '../icons';

interface FeedbackDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: DetailedFeedback | null;
  employeeName: string;
}

const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
};

const getImpactColor = (impact: number) => {
    if (impact > 0) return "text-green-600";
    return "text-red-600";
};

const OccurrenceIcon = ({ impact }: { impact: number }) => {
    if (impact > 0) {
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
};


const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({ isOpen, onClose, feedback, employeeName }) => {
  if (!isOpen || !feedback) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes do Feedback para ${employeeName}`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
        
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg">
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheckIcon className="w-4 h-4" />
                    <span>Feedback para <strong>{employeeName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(feedback.date).toLocaleString('pt-BR')} por <strong>{feedback.authorName}</strong></span>
                </div>
            </div>
            <div className={`mt-2 sm:mt-0 px-3 py-1.5 text-lg font-bold rounded-lg ${getScoreColor(feedback.finalScore)}`}>
              {feedback.finalScore.toFixed(1)}/10
            </div>
        </div>

        {/* Qualitative Feedback */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Feedback Qualitativo</h4>
          <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-md">"{feedback.qualitative}"</p>
        </div>

        {/* Activities */}
        {feedback.activities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><StarIcon className="w-5 h-5 text-yellow-500"/> Atividades Avaliadas</h4>
            <div className="space-y-2">
              {feedback.activities.map(activity => (
                <div key={activity.id} className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm">{activity.name}</span>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${getScoreColor(activity.rating)}`}>{activity.rating}/10</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Occurrences */}
        {feedback.occurrences.length > 0 && (
           <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5 text-orange-500"/> Ocorrências Registradas</h4>
            <div className="space-y-2">
              {feedback.occurrences.map(occurrence => (
                <div key={occurrence.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div className='flex items-center gap-2'>
                    <OccurrenceIcon impact={occurrence.impact} />
                    <span className="text-sm">{occurrence.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${getImpactColor(occurrence.impact)}`}>
                    {occurrence.impact > 0 ? `+${occurrence.impact}` : occurrence.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FeedbackDetailModal;