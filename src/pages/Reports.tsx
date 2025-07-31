import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Building2,
  Filter,
  Printer,
  Mail
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Reports: React.FC = () => {
  const { equipments, technicalCalls, units, checklists } = useData();
  const { user } = useAuth();
  
  const [reportType, setReportType] = useState('equipment');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const availableUnits = user?.role === 'technician' 
    ? units.filter(unit => user.units.includes(unit.id))
    : units;

  // Generate report data based on filters
  const generateReportData = () => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    switch (reportType) {
      case 'equipment':
        return {
          title: 'Relatório de Equipamentos',
          data: equipments.filter(eq => 
            selectedUnit === '' || eq.unitId === selectedUnit
          ).map(eq => {
            const unit = units.find(u => u.id === eq.unitId);
            const lastChecklist = checklists
              .filter(c => c.equipmentId === eq.id)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            
            return {
              equipment: eq.name,
              tag: eq.tag,
              unit: unit?.name || 'N/A',
              status: eq.status,
              lastInspection: eq.lastInspection,
              lifeExpectancy: `${eq.currentAge}/${eq.lifeExpectancy} anos`,
              lastScore: lastChecklist ? 
                ((lastChecklist.physicalCondition + lastChecklist.functionality + 
                  lastChecklist.noise + lastChecklist.stability) / 4).toFixed(1) : 'N/A'
            };
          })
        };

      case 'maintenance':
        return {
          title: 'Relatório de Manutenções',
          data: technicalCalls.filter(call => {
            const callDate = new Date(call.createdAt);
            const matchesDate = callDate >= startDate && callDate <= endDate;
            const matchesUnit = selectedUnit === '' || call.unitId === selectedUnit;
            return matchesDate && matchesUnit;
          }).map(call => ({
            equipment: call.equipmentName,
            unit: call.unitName,
            type: call.type === 'preventive' ? 'Preventiva' : 'Corretiva',
            priority: call.priority === 'high' ? 'Alta' : call.priority === 'medium' ? 'Média' : 'Baixa',
            status: call.status === 'resolved' ? 'Resolvido' : 
                   call.status === 'in-progress' ? 'Em Andamento' : 'Pendente',
            createdAt: new Date(call.createdAt).toLocaleDateString('pt-BR'),
            technician: call.technician || 'Não atribuído'
          }))
        };

      case 'inspections':
        return {
          title: 'Relatório de Inspeções',
          data: checklists.filter(checklist => {
            const checklistDate = new Date(checklist.date);
            const equipment = equipments.find(eq => eq.id === checklist.equipmentId);
            const matchesDate = checklistDate >= startDate && checklistDate <= endDate;
            const matchesUnit = selectedUnit === '' || equipment?.unitId === selectedUnit;
            return matchesDate && matchesUnit;
          }).map(checklist => {
            const equipment = equipments.find(eq => eq.id === checklist.equipmentId);
            const unit = units.find(u => u.id === equipment?.unitId);
            const averageScore = (checklist.physicalCondition + checklist.functionality + 
                                checklist.noise + checklist.stability) / 4;
            
            return {
              equipment: equipment?.name || 'N/A',
              unit: unit?.name || 'N/A',
              date: new Date(checklist.date).toLocaleDateString('pt-BR'),
              score: averageScore.toFixed(1),
              physicalCondition: checklist.physicalCondition,
              functionality: checklist.functionality,
              noise: checklist.noise,
              stability: checklist.stability,
              maintenanceRequested: checklist.needsMaintenance ? 'Sim' : 'Não'
            };
          })
        };

      default:
        return { title: 'Relatório', data: [] };
    }
  };

  const reportData = generateReportData();

  const exportToPDF = () => {
    // Simulate PDF export
    alert('Funcionalidade de exportação para PDF será implementada.');
  };

  const exportToExcel = () => {
    // Simulate Excel export
    alert('Funcionalidade de exportação para Excel será implementada.');
  };

  const sendByEmail = () => {
    // Simulate email sending
    alert('Funcionalidade de envio por email será implementada.');
  };

  const print = () => {
    window.print();
  };

  // Statistics
  const stats = {
    totalEquipments: equipments.length,
    activeInspections: checklists.filter(c => {
      const date = new Date(c.date);
      return date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
    }).length,
    pendingCalls: technicalCalls.filter(c => c.status === 'pending').length,
    resolvedCalls: technicalCalls.filter(c => {
      const date = new Date(c.updatedAt);
      return c.status === 'resolved' && date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Relatórios
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gere relatórios detalhados de equipamentos e manutenções
          </p>
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Configurar Relatório
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="equipment">Relatório de Equipamentos</option>
            <option value="maintenance">Relatório de Manutenções</option>
            <option value="inspections">Relatório de Inspeções</option>
          </select>
          
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas as unidades</option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          />

          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Equipamentos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalEquipments}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inspeções no Período</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeInspections}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chamados Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingCalls}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolvidos no Período</p>
              <p className="text-2xl font-bold text-red-600">{stats.resolvedCalls}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {reportData.title}
            </h3>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={print}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Printer className="h-4 w-4 mr-1" />
                Imprimir
              </button>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                Excel
              </button>
              <button
                onClick={sendByEmail}
                className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Mail className="h-4 w-4 mr-1" />
                Enviar
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Período: {new Date(dateRange.start).toLocaleDateString('pt-BR')} até {new Date(dateRange.end).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="overflow-x-auto">
          {reportData.data.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {Object.keys(reportData.data[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {Object.entries(row).map(([key, value], cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {key === 'status' ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            value === 'ok' || value === 'Resolvido' ? 'bg-green-100 text-green-800' :
                            value === 'warning' || value === 'Em Andamento' || value === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                            value === 'error' || value === 'Pendente' || value === 'Alta' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {value === 'ok' ? 'Funcionando' : 
                             value === 'warning' ? 'Atenção' : 
                             value === 'error' ? 'Defeito' : value}
                          </span>
                        ) : (
                          String(value)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Nenhum dado encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Não há dados para o período e filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;