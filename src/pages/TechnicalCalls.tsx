import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  User,
  Calendar,
  MapPin,
  Camera,
  FileText,
  Play,
  Edit,
  Trash2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const TechnicalCalls: React.FC = () => {
  const { technicalCalls, updateTechnicalCall, equipments, units } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    resolution: '',
    photos: [] as string[]
  });

  // Filter calls based on user role
  const filteredCalls = technicalCalls.filter(call => {
    const matchesSearch = call.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || call.status === statusFilter;
    const matchesPriority = priorityFilter === '' || call.priority === priorityFilter;
    
    // If user is technician, only show calls from their units
    if (user?.role === 'technician') {
      return matchesSearch && matchesStatus && matchesPriority && user.units.includes(call.unitId);
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Resolvido';
      case 'in-progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const handleUpdateCall = () => {
    if (selectedCall && updateData.status) {
      updateTechnicalCall(selectedCall.id, {
        ...updateData,
        updatedAt: new Date().toISOString(),
        technician: user?.name
      });

      addNotification({
        title: 'Chamado Atualizado',
        message: `Chamado ${selectedCall.id} foi atualizado com sucesso`,
        type: 'success'
      });

      setShowUpdateModal(false);
      setSelectedCall(null);
      setUpdateData({ status: '', resolution: '', photos: [] });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&${Date.now()}-${index}`
      );
      setUpdateData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chamados Técnicos
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie solicitações de manutenção e reparos
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredCalls.length} chamados
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar chamados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="in-progress">Em Andamento</option>
            <option value="resolved">Resolvido</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas as prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filtros ativos
            </span>
          </div>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <div key={call.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(call.status)}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {call.equipmentName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(call.priority)}`}>
                      {getPriorityText(call.priority)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{call.unitName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(call.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {call.technician && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{call.technician}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {call.description}
                  </p>

                  {call.resolution && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Resolução:
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        {call.resolution}
                      </p>
                    </div>
                  )}

                  {call.photos && call.photos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Fotos Anexadas:
                      </h4>
                      <div className="flex space-x-2">
                        {call.photos.map((photo, index) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Evidência ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => window.open(photo, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium text-center
                    ${call.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      call.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {getStatusText(call.status)}
                  </span>
                  
                  {user?.role === 'technician' && call.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        setSelectedCall(call);
                        setUpdateData({
                          status: call.status,
                          resolution: call.resolution || '',
                          photos: call.photos || []
                        });
                        setShowUpdateModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Atualizar
                    </button>
                  )}
                  
                  {user?.role === 'admin' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedCall(call);
                          setUpdateData({
                            status: call.status,
                            resolution: call.resolution || '',
                            photos: call.photos || []
                          });
                          setShowUpdateModal(true);
                        }}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCall(call.id)}
                        className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCalls.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Nenhum chamado encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Não há chamados técnicos com os filtros aplicados.
          </p>
        </div>
      )}

      {/* Update Call Modal */}
      {showUpdateModal && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Atualizar Chamado - {selectedCall.equipmentName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">Pendente</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="resolved">Resolvido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resolução / Observações
                </label>
                <textarea
                  value={updateData.resolution}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, resolution: e.target.value }))}
                  placeholder="Descreva o que foi feito, peças trocadas, observações..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fotos da Intervenção
                </label>
                <label className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Adicionar fotos
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>

                {updateData.photos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {updateData.photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`Upload ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateCall}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Atualizar Chamado
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedCall(null);
                  setUpdateData({ status: '', resolution: '', photos: [] });
                }}
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

export default TechnicalCalls;