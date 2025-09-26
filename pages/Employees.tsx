import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import FuncionarioCard from "../components/funcionarios/FuncionarioCard";
import FuncionarioForm from "../components/funcionarios/FuncionarioForm";
import FuncionarioFilters from "../components/funcionarios/FuncionarioFilters";
import FuncionarioImporter from "../components/funcionarios/FuncionarioImporter";
import ConfirmationDialog from "../components/ConfirmationDialog";
import PasswordResetModal from "../components/funcionarios/PasswordResetModal";

// Shadcn UI like components, but implemented locally for simplicity
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>{children}</div>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string}> = ({ children, className, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props}>{children}</button>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input className={`block w-full px-3 py-2 bg-white border border-brand-gray rounded-lg shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${props.className}`} {...props} />;

// Icons from components/icons.tsx - Lucide-React placeholders
import { UsersIcon as Users, PlusIcon as Plus, SearchIcon as Search, FilterIcon as Filter, UserCheckIcon as UserCheck, UploadIcon as Upload } from "../components/icons";

export default function Funcionarios() {
  const { 
    employees: funcionarios, 
    sectors: setores, 
    sections: secoes, 
    addEmployee, 
    updateEmployee,
    bulkAddEmployees
  } = useData();
  const { user } = useAuth();
  
  const [localFuncionarios, setLocalFuncionarios] = useState(funcionarios);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    setor: "all",
    turno: "all",
    lider: "all",
    status: "ativo"
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetModalState, setResetModalState] = useState({
    isOpen: false,
    employeeName: '',
    tempPassword: '',
  });


  useEffect(() => {
    loadData();
  }, [funcionarios]); // Reload when context data changes

  const loadData = () => {
    setIsLoading(true);
    setLocalFuncionarios(funcionarios);
    setIsLoading(false);
  };

  const handleSubmit = async (funcionarioData) => {
    try {
      if (editingFuncionario) {
        await updateEmployee(editingFuncionario.id, funcionarioData);
      } else {
        await addEmployee(funcionarioData);
      }
      
      setShowForm(false);
      setEditingFuncionario(null);
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  const handleEdit = (funcionario) => {
    setEditingFuncionario(funcionario);
    setShowForm(true);
  };

  const handleDelete = (funcionarioId: string) => {
    setDeletingId(funcionarioId);
    setConfirmOpen(true);
  };

  const handlePromote = async (funcionarioId: string) => {
    try {
      await updateEmployee(funcionarioId, { isUser: true });
    } catch (error) {
      console.error("Erro ao promover funcionário:", error);
    }
  };

  const generateTempPassword = (length = 8) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; // Avoid ambiguous chars
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleResetPassword = (funcionarioId: string) => {
    const funcionario = localFuncionarios.find(f => f.id === funcionarioId);
    if (funcionario) {
        const newPassword = generateTempPassword();
        // In a real app, you would now make an API call to update the user's password.
        // For this mock, we just show it to the admin.
        setResetModalState({
            isOpen: true,
            employeeName: funcionario.nome_completo,
            tempPassword: newPassword,
        });
    }
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await updateEmployee(deletingId, { ativo: false });
      } catch (error) {
        console.error("Erro ao desativar funcionário:", error);
      }
    }
    setConfirmOpen(false);
    setDeletingId(null);
  };

  const getFilteredFuncionarios = () => {
    return localFuncionarios.filter(funcionario => {
      const secao = secoes.find(s => s.id === funcionario.secao_id);
      const setorId = secao?.setor_id;

      const matchesSearch = funcionario.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === "all" || 
        (filters.status === "ativo" && funcionario.ativo) ||
        (filters.status === "inativo" && !funcionario.ativo);
      const matchesTurno = filters.turno === "all" || funcionario.turno === filters.turno;
      const matchesLider = filters.lider === "all" || 
        (filters.lider === "sim" && funcionario.eh_lider) ||
        (filters.lider === "nao" && !funcionario.eh_lider);
      const matchesSetor = filters.setor === "all" || setorId === filters.setor;

      return matchesSearch && matchesStatus && matchesTurno && matchesLider && matchesSetor;
    });
  };

  const filteredFuncionarios = getFilteredFuncionarios();
  const stats = {
    total: localFuncionarios.length,
    ativos: localFuncionarios.filter(f => f.ativo).length,
    lideres: localFuncionarios.filter(f => f.eh_lider).length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Gestão de Funcionários</h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Gerencie a equipe e suas informações</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
           <Button 
            onClick={() => setShowImporter(true)}
            variant="outline"
            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="btn-primary w-full sm:w-auto bg-brand-blue text-white hover:bg-brand-dark-blue px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="material-card material-elevation-1">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total de Funcionários</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="material-card material-elevation-1">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Funcionários Ativos</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.ativos}</p>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="material-card material-elevation-1">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Líderes</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.lideres}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="material-card material-elevation-1">
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mobile Filters Toggle */}
            <div className="flex justify-between items-center sm:hidden">
              <p className="text-sm text-gray-600">
                {filteredFuncionarios.length} de {localFuncionarios.length} funcionários
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <FuncionarioFilters
                filters={filters}
                onFiltersChange={setFilters}
                setores={setores}
              />
            </div>

            {/* Desktop Results Counter */}
            <div className="hidden sm:block">
              <p className="text-sm text-gray-600">
                Mostrando {filteredFuncionarios.length} de {localFuncionarios.length} funcionários
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionarios Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="material-card material-elevation-1">
              <CardContent>
                <div className="animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredFuncionarios.map((funcionario) => (
            <FuncionarioCard
              key={funcionario.id}
              funcionario={funcionario}
              setores={setores}
              secoes={secoes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPromote={handlePromote}
              onResetPassword={handleResetPassword}
              currentUser={user}
            />
          ))}
        </div>
      )}

      {filteredFuncionarios.length === 0 && !isLoading && (
        <Card className="material-card material-elevation-1">
          <CardContent className="p-8 sm:p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum funcionário encontrado</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {searchTerm || Object.values(filters).some(f => f !== "all" && f !== "ativo")
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando funcionários à sua equipe"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto bg-brand-blue text-white hover:bg-brand-dark-blue px-4 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Funcionário
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form Modal */}
      {showForm && (
        <FuncionarioForm
          funcionario={editingFuncionario}
          setores={setores}
          secoes={secoes}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingFuncionario(null);
          }}
          currentUser={user}
        />
      )}

      {/* Importer Modal */}
      {showImporter && (
        <FuncionarioImporter
          secoes={secoes}
          onCancel={() => setShowImporter(false)}
          onImportSuccess={(newFuncionarios) => {
            bulkAddEmployees(newFuncionarios);
            setShowImporter(false);
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Desativação"
        description="Tem certeza que deseja desativar este funcionário? Esta ação pode ser revertida."
      />

      {/* Password Reset Modal */}
      {resetModalState.isOpen && (
        <PasswordResetModal
          isOpen={resetModalState.isOpen}
          onClose={() => setResetModalState({ isOpen: false, employeeName: '', tempPassword: '' })}
          employeeName={resetModalState.employeeName}
          tempPassword={resetModalState.tempPassword}
        />
      )}

    </div>
  );
}