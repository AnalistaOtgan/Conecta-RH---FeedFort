
import React from "react";
import { useNavigate } from "react-router-dom";
import { Employee, Sector, Section, User } from "../../types";
import { 
  EditIcon as Edit, 
  TrashIcon as Trash2, 
  StarIcon as Star, 
  EyeIcon as Eye,
  UserCheckIcon,
  KeyIcon
} from "../icons";

// --- START: Local UI Components ---
const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent) => void }> = ({ children, className, onClick }) => <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} onClick={onClick}>{children}</div>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}> = ({ children, className, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props}>{children}</button>;
const Badge: React.FC<{ children: React.ReactNode, className?: string, variant?: string }> = ({ children, className, variant }) => {
    const variantClasses = variant === 'destructive' ? 'bg-red-100 text-red-800 border-transparent' : 'bg-green-100 text-green-800 border-transparent';
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantClasses} ${className}`}>{children}</span>;
}
const Avatar: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarFallback: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</span>;
// --- END: Local UI Components ---

interface FuncionarioCardProps {
  funcionario: Employee;
  setores: Sector[];
  secoes: Section[];
  onEdit: (funcionario: Employee) => void;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onResetPassword: (id: string) => void;
  currentUser: User;
}

const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ funcionario, setores, secoes, onEdit, onDelete, onPromote, onResetPassword, currentUser }) => {
  const navigate = useNavigate();
  
  const secao = secoes.find(s => s.id === funcionario.secao_id);
  const setor = secao ? setores.find(s => s.id === secao.setor_id) : null;

  const handleViewDossie = () => {
    navigate(`/employees/${funcionario.id}`);
  };

  const formatTurno = (turno: string) => {
    const map = {
        'abertura': 'Abertura',
        'intermediario': 'Intermediário',
        'fechamento': 'Fechamento',
        'integral': 'Integral',
    };
    return map[turno] || turno;
  };

  const isAdmin = currentUser.role === 'RH' || currentUser.role === 'Diretor';

  return (
    <Card className="material-card material-elevation-1 cursor-pointer hover:shadow-md transition-all duration-300" onClick={handleViewDossie}>
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarFallback className="text-sm sm:text-xl bg-blue-100 text-blue-600">
                {funcionario.nome_completo?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                {funcionario.nome_completo}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{funcionario.email}</p>
            </div>
          </div>
          <Badge 
            variant={funcionario.ativo ? "secondary" : "destructive"} 
            className="text-xs flex-shrink-0"
          >
            {funcionario.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
          <div className="grid grid-cols-1 gap-1">
            <p><strong>Setor:</strong> {setor?.name || 'N/A'}</p>
            <p><strong>Seção:</strong> {secao?.name || 'N/A'}</p>
            <p><strong>Turno:</strong> <span>{formatTurno(funcionario.turno)}</span></p>
          </div>
          {funcionario.eh_lider && (
            <div className="pt-1">
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                Líder
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={handleViewDossie} title="Ver dossiê" className="hover:bg-gray-100 p-2 rounded-full">
            <Eye className="w-4 h-4 text-blue-500" />
          </Button>
          {isAdmin && (
            <>
              <Button variant="ghost" size="icon" onClick={() => onEdit(funcionario)} title="Editar" className="hover:bg-gray-100 p-2 rounded-full">
                <Edit className="w-4 h-4 text-gray-500" />
              </Button>
               <Button
                variant="ghost"
                size="icon"
                onClick={() => onPromote(funcionario.id)}
                disabled={funcionario.isUser}
                title={funcionario.isUser ? "Já é um usuário" : "Promover a usuário"}
                className="hover:bg-gray-100 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCheckIcon className={`w-4 h-4 ${funcionario.isUser ? 'text-green-500' : 'text-gray-500'}`} />
              </Button>
              {funcionario.isUser && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onResetPassword(funcionario.id)}
                    title="Redefinir Senha"
                    className="hover:bg-gray-100 p-2 rounded-full"
                  >
                    <KeyIcon className="w-4 h-4 text-orange-500" />
                  </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onDelete(funcionario.id)} title="Desativar" className="hover:bg-gray-100 p-2 rounded-full">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FuncionarioCard;