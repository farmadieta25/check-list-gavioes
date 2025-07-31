import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Wrench,
  Building2,
  Calendar,
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { equipments, technicalCalls, units } = useData();
  const { user } = useAuth();

  // Calculate KPIs
  const totalEquipments = equipments.length;
  const openCalls = technicalCalls.filter(call => call.status !== 'resolved').length;
  const resolvedCallsThisMonth = technicalCalls.filter(call => {
    const callDate = new Date(call.updatedAt);
    const currentMonth = new Date().getMonth();
    return call.status === 'resolved' && callDate.getMonth() === currentMonth;
  }).length;
  
  const expiredEquipments = equipments.filter(eq => eq.currentAge >= eq.lifeExpectancy).length;
  
  const equipmentsByStatus = {
    ok: equipments.filter(eq => eq.status === 'ok').length,
    warning: equipments.filter(eq => eq.status === 'warning').length,
    error: equipments.filter(eq => eq.status === 'error').length,
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')} dark:${color.replace('text-', 'bg-').replace('-600', '-900')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Geral
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo, {user?.name}! Visão geral do sistema.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Equipamentos"
          value={totalEquipments}
          icon={<Building2 className="h-6 w-6" />}
          color="text-blue-600"
          trend="Em todas as unidades"
        />
        <StatCard
          title="Chamados Abertos"
          value={openCalls}
          icon={<Wrench className="h-6 w-6" />}
          color="text-orange-600"
          trend="Necessitam atenção"
        />
        <StatCard
          title="Manutenções Realizadas"
          value={resolvedCallsThisMonth}
          icon={<CheckCircle className="h-6 w-6" />}
          color="text-green-600"
          trend="Este mês"
        />
        <StatCard
          title="Vida Útil Expirada"
          value={expiredEquipments}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="text-red-600"
          trend="Requerem substituição"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status dos Equipamentos
            </h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Funcionando</span>
              </div>
              <span className="text-sm font-medium">{equipmentsByStatus.ok}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Atenção</span>
              </div>
              <span className="text-sm font-medium">{equipmentsByStatus.warning}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Defeito</span>
              </div>
              <span className="text-sm font-medium">{equipmentsByStatus.error}</span>
            </div>
          </div>

          {/* Visual Chart */}
          <div className="mt-6">
            <div className="flex rounded-full overflow-hidden h-2">
              <div 
                className="bg-green-500" 
                style={{ width: `${(equipmentsByStatus.ok / totalEquipments) * 100}%` }}
              ></div>
              <div 
                className="bg-yellow-500" 
                style={{ width: `${(equipmentsByStatus.warning / totalEquipments) * 100}%` }}
              ></div>
              <div 
                className="bg-red-500" 
                style={{ width: `${(equipmentsByStatus.error / totalEquipments) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {technicalCalls.slice(0, 5).map((call) => (
              <div key={call.id} className="flex items-start space-x-3">
                <div className={`
                  w-2 h-2 rounded-full flex-shrink-0 mt-2
                  ${call.status === 'resolved' ? 'bg-green-500' : 
                    call.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'}
                `}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {call.equipmentName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {call.unitName} • {new Date(call.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${call.priority === 'high' ? 'bg-red-100 text-red-800' :
                    call.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}
                `}>
                  {call.priority === 'high' ? 'Alta' : 
                   call.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Units Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Visão por Unidade
          </h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.map((unit) => {
            const unitEquipments = equipments.filter(eq => eq.unitId === unit.id);
            const unitCalls = technicalCalls.filter(call => call.unitId === unit.id && call.status !== 'resolved');
            
            return (
              <div key={unit.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{unit.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Equipamentos:</span>
                    <span className="font-medium">{unitEquipments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Chamados Abertos:</span>
                    <span className="font-medium text-red-600">{unitCalls.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Técnico:</span>
                    <span className="font-medium">{unit.technician}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;