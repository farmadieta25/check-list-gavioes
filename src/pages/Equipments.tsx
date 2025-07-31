import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Equipments: React.FC = () => {
  const { equipments, units, addEquipment, updateEquipment, deleteEquipment } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    tag: '',
    model: '',
    manufacturer: '',
    acquisitionDate: '',
    unitId: '',
    status: 'ok' as 'ok' | 'warning' | 'error',
    lifeExpectancy: 10,
    category: ''
  });

  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = selectedUnit === '' || eq.unitId === selectedUnit;
    const matchesStatus = statusFilter === '' || eq.status === statusFilter;
    
    // If user is technician, only show equipments from their units
    if (user?.role === 'technician') {
      return matchesSearch && matchesUnit && matchesStatus && user.units.includes(eq.unitId);
    }
    
    return matchesSearch && matchesUnit && matchesStatus;
  });

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.tag && newEquipment.unitId) {
      addEquipment({
        ...newEquipment,
        lastInspection: new Date().toISOString().split('T')[0],
        currentAge: Math.floor((new Date().getTime() - new Date(newEquipment.acquisitionDate).getTime()) / (1000 * 60 * 60 * 24 * 365))
      });
      setNewEquipment({
        name: '',
        tag: '',
        model: '',
        manufacturer: '',
        acquisitionDate: '',
        unitId: '',
        status: 'ok',
        lifeExpectancy: 10,
        category: ''
      });
      setShowAddModal(false);
    }
  };

  const handleEditEquipment = () => {
    if (editingEquipment) {
      updateEquipment(editingEquipment.id, editingEquipment);
      setEditingEquipment(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok':
        return 'Funcionando';
      case 'warning':
        return 'Atenção';
      case 'error':
        return 'Defeito';
      default:
        return 'Desconhecido';
    }
  };

  const availableUnits = user?.role === 'technician' 
    ? units.filter(unit => user.units.includes(unit.id))
    : units;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Unidades e Equipamentos
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie equipamentos de todas as unidades
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </button>
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos os status</option>
            <option value="ok">Funcionando</option>
            <option value="warning">Atenção</option>
            <option value="error">Defeito</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredEquipments.length} equipamentos
            </span>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => {
          const unit = units.find(u => u.id === equipment.unitId);
          
          return (
            <div key={equipment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(equipment.status)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getStatusText(equipment.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingEquipment(equipment)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteEquipment(equipment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {equipment.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Etiqueta:</span>
                    <span className="font-medium">{equipment.tag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Modelo:</span>
                    <span className="font-medium">{equipment.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fabricante:</span>
                    <span className="font-medium">{equipment.manufacturer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Unidade:
                    </span>
                    <span className="font-medium text-xs">{unit?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Última inspeção:
                    </span>
                    <span className="font-medium">
                      {new Date(equipment.lastInspection).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Life Expectancy Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Vida útil</span>
                    <span>{equipment.currentAge}/{equipment.lifeExpectancy} anos</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (equipment.currentAge / equipment.lifeExpectancy) > 0.8 ? 'bg-red-500' :
                        (equipment.currentAge / equipment.lifeExpectancy) > 0.6 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((equipment.currentAge / equipment.lifeExpectancy) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Novo Equipamento
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do equipamento"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Etiqueta"
                value={newEquipment.tag}
                onChange={(e) => setNewEquipment({ ...newEquipment, tag: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Modelo"
                value={newEquipment.model}
                onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Fabricante"
                value={newEquipment.manufacturer}
                onChange={(e) => setNewEquipment({ ...newEquipment, manufacturer: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="date"
                value={newEquipment.acquisitionDate}
                onChange={(e) => setNewEquipment({ ...newEquipment, acquisitionDate: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <select
                value={newEquipment.unitId}
                onChange={(e) => setNewEquipment({ ...newEquipment, unitId: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione uma unidade</option>
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Categoria"
                value={newEquipment.category}
                onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="number"
                placeholder="Vida útil (anos)"
                value={newEquipment.lifeExpectancy}
                onChange={(e) => setNewEquipment({ ...newEquipment, lifeExpectancy: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddEquipment}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {editingEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Editar Equipamento
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do equipamento"
                value={editingEquipment.name}
                onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <select
                value={editingEquipment.status}
                onChange={(e) => setEditingEquipment({ ...editingEquipment, status: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ok">Funcionando</option>
                <option value="warning">Atenção</option>
                <option value="error">Defeito</option>
              </select>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleEditEquipment}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditingEquipment(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipments;