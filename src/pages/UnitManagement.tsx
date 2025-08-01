import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const UnitManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { units, addUnit, updateUnit, deleteUnit } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);

  const [newUnit, setNewUnit] = useState({
    name: '',
    address: '',
    technician: '',
    phone: '',
    email: '',
    manager: '',
    capacity: 0,
    operatingHours: '',
    notes: ''
  });

  // Only admins can access unit management
  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Acesso Negado
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Apenas administradores podem acessar o gerenciamento de unidades.
        </p>
      </div>
    );
  }

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUnit = () => {
    if (newUnit.name && newUnit.address) {
      addUnit({
        ...newUnit,
        equipmentCount: 0
      });
      setNewUnit({
        name: '',
        address: '',
        technician: '',
        phone: '',
        email: '',
        manager: '',
        capacity: 0,
        operatingHours: '',
        notes: ''
      });
      setShowAddModal(false);
    }
  };

  const handleEditUnit = () => {
    if (editingUnit) {
      updateUnit(editingUnit.id, editingUnit);
      setEditingUnit(null);
    }
  };

  const handleDeleteUnit = (unitId: string) => {
    if (confirm('Tem certeza que deseja excluir esta unidade? Todos os equipamentos associados também serão removidos.')) {
      deleteUnit(unitId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Unidades
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Cadastre e gerencie as unidades da Academia Gaviões
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Unidade
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar unidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <div key={unit.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {unit.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingUnit(unit)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{unit.address}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Técnico: <span className="font-medium text-gray-900 dark:text-white">{unit.technician}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Equipamentos:</span>
                  <span className="font-medium text-red-600">{unit.equipmentCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Nova Unidade
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome da unidade"
                value={newUnit.name}
                onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <textarea
                placeholder="Endereço completo"
                value={newUnit.address}
                onChange={(e) => setNewUnit({ ...newUnit, address: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Técnico responsável"
                value={newUnit.technician}
                onChange={(e) => setNewUnit({ ...newUnit, technician: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="tel"
                placeholder="Telefone"
                value={newUnit.phone}
                onChange={(e) => setNewUnit({ ...newUnit, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="email"
                placeholder="Email da unidade"
                value={newUnit.email}
                onChange={(e) => setNewUnit({ ...newUnit, email: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Gerente da unidade"
                value={newUnit.manager}
                onChange={(e) => setNewUnit({ ...newUnit, manager: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="number"
                placeholder="Capacidade (pessoas)"
                value={newUnit.capacity}
                onChange={(e) => setNewUnit({ ...newUnit, capacity: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Horário de funcionamento"
                value={newUnit.operatingHours}
                onChange={(e) => setNewUnit({ ...newUnit, operatingHours: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <textarea
                placeholder="Observações"
                value={newUnit.notes}
                onChange={(e) => setNewUnit({ ...newUnit, notes: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddUnit}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Criar Unidade
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

      {/* Edit Unit Modal */}
      {editingUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Editar Unidade
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome da unidade"
                value={editingUnit.name}
                onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <textarea
                placeholder="Endereço completo"
                value={editingUnit.address}
                onChange={(e) => setEditingUnit({ ...editingUnit, address: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Técnico responsável"
                value={editingUnit.technician}
                onChange={(e) => setEditingUnit({ ...editingUnit, technician: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleEditUnit}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditingUnit(null)}
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

export default UnitManagement;