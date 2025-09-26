import React, { useState } from "react";
import { 
  UploadIcon as Upload, 
  FileTextIcon as FileText, 
  AlertTriangleIcon as AlertTriangle, 
  CheckCircleIcon as CheckCircle, 
  Loader2Icon as Loader2 
} from "../icons";

// --- START: Local UI Components ---
const Dialog: React.FC<{open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode}> = ({ children }) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">{children}</div>;
const DialogContent: React.FC<{className?: string, children: React.ReactNode}> = ({ children, className }) => <div className={`relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg ${className}`}>{children}</div>;
const DialogHeader: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;
const DialogDescription: React.FC<{children: React.ReactNode}> = ({ children }) => <p className="text-sm text-gray-500 mt-1">{children}</p>;
const DialogFooter: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="mt-6 flex justify-end gap-2">{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string}> = ({ children, className, variant, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 ${variant === 'outline' ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-brand-blue text-white hover:bg-brand-dark-blue'} disabled:opacity-50 disabled:pointer-events-none ${className}`} {...props}>{children}</button>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input className={`block w-full text-sm text-gray-900 border border-brand-gray rounded-md cursor-pointer bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 ${props.className}`} {...props} />;
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => <label className="text-sm font-medium text-gray-700" {...props} />;
const Alert: React.FC<{variant?: string, className?: string, children: React.ReactNode}> = ({ children, variant, className }) => <div className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7 ${variant === 'destructive' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'} ${className}`}>{children}</div>;
const AlertTitle: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>;
const AlertDescription: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`text-sm ${className}`}>{children}</div>;
// --- END: Local UI Components ---

const parseCSV = (text) => {
    const lines = text.replace(/\r/g, '').split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        if (values.length === header.length) {
            return header.reduce((obj, h, i) => {
                obj[h] = values[i];
                return obj;
            }, {});
        }
        return null;
    }).filter(Boolean);
    return rows;
};

export default function FuncionarioImporter({ secoes, onCancel, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [importSummary, setImportSummary] = useState(null);

  // Mapeamento de cargos para seções
  const cargoToSecaoMapping = {
    'caixa': 'Caixa',
    'açougueiro': 'Açougueiro', 
    'desossador': 'Desossador',
    'repositor_-_horti': 'Repositor Horti',
    'repositor_-_hortifruit': 'Repositor Horti',
    'estagiário_-_hortifruit': 'Estagiário Hortifruti',
    'repositor': 'Repositor',
    'serviços_gerais': 'Serviços Gerais',
    'auxiliar_de_padeiro': 'Auxiliar de Padeiro',
    'estagiário_-_fundo_de_loja': 'Estagiário Fundo de Loja',
    'fiscal_de_prevenção_de_perdas': 'Fiscal de Prevenção de Perdas',
    'fiscal_de_caixa': 'Fiscal de Caixa',
    'encarregado_de_congelados': 'Encarregado de Congelados',
    'conferente': 'Conferente',
    'subgerente': 'Subgerente',
    'estagiário_-_frente_de_loja': 'Estagiário Frente de Loja',
    'gerente': 'Gerente',
    'estagiário_-_padaria': 'Estagiário Padaria',
    'supervisor': 'Supervisor',
    'assistente_fiscal': 'Assistente Fiscal',
    'analista_administrativo': 'Analista Administrativo',
    'auxiliar_fiscal': 'Auxiliar Fiscal',
    'caixa_padaria': 'Caixa Padaria',
    'atendente_padaria': 'Atendente Padaria',
    'padeiro': 'Padeiro',
    'supervisor_-_mercearia': 'Supervisor Mercearia'
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Por favor, selecione um arquivo CSV.");
    }
  };

  const processImport = async () => {
    if (!file) {
      setError("Nenhum arquivo selecionado.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setImportSummary(null);

    try {
      const fileContent = await file.text();
      const extractedData = parseCSV(fileContent);

      if (!extractedData || extractedData.length === 0) {
        throw new Error("Não foi possível extrair dados do arquivo. Verifique o formato do CSV.");
      }
      
      const newFuncionarios = [];
      let createdCount = 0;
      let skippedCount = 0;

      for (const item of extractedData) {
        try {
          const cargoOriginal = item.Cargo?.trim() || '';
          const cargoKey = cargoOriginal.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
          
          const secaoNome = cargoToSecaoMapping[cargoKey] || cargoOriginal;
          
          const secao = secoes.find(s => 
            s.nome.toLowerCase() === secaoNome.toLowerCase() && s.ativo
          );
          
          if (!secao) {
            console.warn(`Seção não encontrada para cargo: ${cargoOriginal}`);
            skippedCount++;
            continue;
          }

          const turnoMap = { 'manha': 'abertura', 'tarde': 'fechamento', 'manhã': 'abertura' };
          const turno = turnoMap[item.Turno?.toLowerCase()] || 'intermediario';
          
          const cargosLideres = ['supervisor', 'gerente', 'encarregado', 'subgerente', 'supervisor_-_mercearia', 'encarregado_de_congelados'];
          const ehLider = cargosLideres.some(cargo => cargoKey.includes(cargo.toLowerCase()));

          const emailBase = item.Nome?.trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '.');

          newFuncionarios.push({
            nome_completo: item.Nome.trim(),
            secao_id: secao.id,
            turno,
            eh_lider: ehLider,
            ativo: item.Ativo?.toLowerCase() === 'sim',
            email: `${emailBase}@loja.com`
          });

          createdCount++;
        } catch (itemError) {
          console.error(`Erro ao processar funcionário ${item.Nome}:`, itemError);
          skippedCount++;
        }
      }

      setImportSummary({ created: createdCount, skipped: skippedCount });
      setTimeout(() => onImportSuccess(newFuncionarios), 2000);

    } catch (err) {
      console.error("Erro na importação:", err);
      setError(err.message || "Ocorreu um erro durante a importação.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar Funcionários</DialogTitle>
          <DialogDescription>
            Faça o upload de um arquivo CSV com as colunas: Nome, Cargo, Turno, Ativo.
            O sistema mapeará automaticamente os cargos para as seções corretas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="csv-file">Arquivo CSV</Label>
            <Input 
              id="csv-file" 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-500">
                <FileText className="inline h-4 w-4 mr-1"/>
                {file.name}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro na Importação</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {importSummary && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Importação Concluída</AlertTitle>
              <AlertDescription className="text-green-700">
                {importSummary.created} funcionários importados com sucesso. 
                {importSummary.skipped > 0 && ` ${importSummary.skipped} foram ignorados.`}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isProcessing}
          >
            {importSummary ? "Fechar" : "Cancelar"}
          </Button>
          <Button 
            type="button" 
            onClick={processImport} 
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Importar Funcionários"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}