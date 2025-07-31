import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  Calendar,
  Building2,
  Search,
  Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const EquipmentLifecycle: React.FC = () => {
  const { equipments, units } = useData();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [sortBy, setSortBy] = useState('remaining');

  const availableUnits = user?.role === 'technician' 
    ? units.filter(unit => user.units.includes(unit.id))
    : units;

  // Calculate remaining life and depreciation for each equipment
  const equipmentsWithLifecycle = equipments.map(eq => {
    const remainingLife = Math.max(0, eq.lifeExpectancy - eq.currentAge);
    const depreciationPercentage = (eq.currentAge / eq.lifeExpectancy) * 100;
    const acquisitionDate = new Date(eq.acquisitionDate);
    const estimatedReplacementDate = new Date(acquisitionDate);
    estimatedReplacementDate.setFullYear(acquisitionDate.getFullYear() + eq.lifeExpectancy);

    let lifecycleStatus: 'new' | 'good' | 'attention' | 'critical' | 'expired' = 'new';
    if (depreciationPercentage >= 100) {
      lifecycleStatus = 'expired';
    } else if (depreciationPercentage >= 90) {
      lifecycleStatus = 'critical';
    } else if (depreciationPercentage >= 70) {
      lifecycleStatus = 'attention';
    } else if (depreciationPercentage >= 30) {
      lifecycleStatus = 'good';
    }

    return {
      ...eq,
      remainingLife,
      depreciationPercentage: Math.min(100, depreciationPercentage),
      lifecycleStatus,
      estimatedReplacementDate
    };
  });

  // Filter and sort equipments
  const filteredEquipments = equipmentsWithLifecycle
    .filter(eq => {
      const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           eq.tag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUnit = selectedUnit === '' || eq.unitId === selectedUnit;
      
      // If user is technician, only show equipments from their units
      if (user?.role === 'technician') {
        return matchesSearch && matchesUnit && user.units.includes(eq.unitId);
      }
      
      return matchesSearch && matchesUnit;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'remaining':
          return a.remainingLife - b.remainingLife;
        case 'depreciation':
          return b.depreciationPercentage - a.depreciationPercentage;
        case 'acquisition':
          return new Date(b.acquisitionDate).getTime() - new Date(a.acquisitionDate).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getLifecycleColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'critical':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLifecycleText = (status: string) => {
    switch (status) {
      case 'expired':
        return 'Vida Útil Expirada';
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Atenção';
      case 'good':
        return 'Bom Estado';
      case 'new':
        return 'Novo';
      default:
        return 'Desconhecido';
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Statistics
  const stats = {
    total: filteredEquipments.length,
    expired: filteredEquipments.filter(eq => eq.lifecycleStatus === 'expired').length,
    critical: filteredEquipments.filter(eq => eq.lifecycleStatus === 'critical').length,
    needingReplacementSoon: filteredEquipments.filter(eq => eq.remainingLife <= 1 && eq.remainingLife > 0).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vida Útil dos Equipamentos
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monitore a depreciação e planeje substituições
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Equipamentos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vida Útil Expirada</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado Crítico</p>
              <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Substituir em Breve</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.needingReplacementSoon}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas as unidades</option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="remaining">Vida útil restante</option>
            <option value="depreciation">Depreciação</option>
            <option value="acquisition">Data de aquisição</option>
            <option value="name">Nome</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredEquipments.length} equipamentos
            </span>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-4">
        {filteredEquipments.map((equipment) => {
          const unit = units.find(u => u.id === equipment.unitId);
          
          return (
            <div key={equipment.id} className={`
              bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4
              ${equipment.lifecycleStatus === 'expired' ? 'border-red-500' :
                equipment.lifecycleStatus === 'critical' ? 'border-orange-500' :
                equipment.lifecycleStatus === 'attention' ? 'border-yellow-500' :
                equipment.lifecycleStatus === 'good' ? 'border-blue-500' :
                'border-green-500'}
            `}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {equipment.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLifecycleColor(equipment.lifecycleStatus)}`}>
                      {getLifecycleText(equipment.lifecycleStatus)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Etiqueta:</span>
                      <p className="font-medium">{equipment.tag}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Unidade:</span>
                      <p className="font-medium">{unit?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Aquisição:</span>
                      <p className="font-medium">{new Date(equipment.acquisitionDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Substituição estimada:</span>
                      <p className="font-medium">{equipment.estimatedReplacementDate.toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 min-w-0 lg:w-80">
                  <div className="space-y-3">
                    {/* Life Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Vida útil</span>
                        <span className="font-medium">
                          {equipment.currentAge}/{equipment.lifeExpectancy} anos 
                          ({equipment.depreciationPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(equipment.depreciationPercentage)}`}
                          style={{ width: `${Math.min(equipment.depreciationPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Remaining Time */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Tempo restante:</span>
                      </div>
                      <span className={`font-medium ${
                        equipment.remainingLife <= 0 ? 'text-red-600' :
                        equipment.remainingLife <= 1 ? 'text-orange-600' :
                        equipment.remainingLife <= 2 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {equipment.remainingLife <= 0 ? 'Expirado' : 
                         equipment.remainingLife === 1 ? '1 ano' :
                         `${equipment.remainingLife} anos`}
                      </span>
                    </div>

                    {/* Replacement Alert */}
                    {equipment.remainingLife <= 1 && equipment.remainingLife > 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs text-yellow-800 dark:text-yellow-200">
                          Planeje a substituição
                        </span>
                      </div>
                    )}

                    {equipment.remainingLife <= 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-800 dark:text-red-200">
                          Substituição urgente necessária
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEquipments.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Nenhum equipamento encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Não há equipamentos com os filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentLifecycle;