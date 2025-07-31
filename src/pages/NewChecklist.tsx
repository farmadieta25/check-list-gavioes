import React, { useState } from 'react';
import { Camera, Video, Upload, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const NewChecklist: React.FC = () => {
  const { equipments, units, addChecklist, addTechnicalCall, updateEquipment } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [checklist, setChecklist] = useState({
    physicalCondition: 5,
    functionality: 5,
    noise: 5,
    stability: 5,
    observations: '',
    photos: [] as string[],
    videos: [] as string[],
    needsMaintenance: false,
    maintenanceType: 'preventive' as 'preventive' | 'corrective',
    maintenancePriority: 'medium' as 'low' | 'medium' | 'high',
    maintenanceDescription: ''
  });

  const availableEquipments = user?.role === 'technician' 
    ? equipments.filter(eq => user.units.includes(eq.unitId))
    : equipments;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate photo URLs - in a real app, these would be uploaded to storage
      const newPhotos = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&${Date.now()}-${index}`
      );
      setChecklist(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate video URLs
      const newVideos = Array.from(files).map((file, index) => 
        `video-${Date.now()}-${index}.mp4`
      );
      setChecklist(prev => ({ ...prev, videos: [...prev.videos, ...newVideos] }));
    }
  };

  const handleSubmit = () => {
    if (!selectedEquipment) {
      addNotification({
        title: 'Erro',
        message: 'Selecione um equipamento para realizar o checklist',
        type: 'error'
      });
      return;
    }

    const equipment = equipments.find(eq => eq.id === selectedEquipment);
    if (!equipment) return;

    // Add checklist
    addChecklist({
      equipmentId: selectedEquipment,
      inspectorId: user?.id || '',
      date: new Date().toISOString(),
      ...checklist
    });

    // Determine equipment status based on scores
    const averageScore = (checklist.physicalCondition + checklist.functionality + 
                         checklist.noise + checklist.stability) / 4;
    
    let newStatus: 'ok' | 'warning' | 'error' = 'ok';
    if (averageScore <= 3) {
      newStatus = 'error';
    } else if (averageScore <= 6) {
      newStatus = 'warning';
    }

    // Update equipment status and last inspection
    updateEquipment(selectedEquipment, {
      status: newStatus,
      lastInspection: new Date().toISOString().split('T')[0]
    });

    // Create technical call if maintenance is needed
    if (checklist.needsMaintenance) {
      const unit = units.find(u => u.id === equipment.unitId);
      
      addTechnicalCall({
        equipmentId: selectedEquipment,
        equipmentName: equipment.name,
        unitId: equipment.unitId,
        unitName: unit?.name || '',
        type: checklist.maintenanceType,
        priority: checklist.maintenancePriority,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: checklist.maintenanceDescription || checklist.observations
      });

      addNotification({
        title: 'Chamado Técnico Criado',
        message: `Chamado de manutenção criado para ${equipment.name}`,
        type: 'info'
      });
    }

    addNotification({
      title: 'Checklist Concluído',
      message: `Inspeção de ${equipment.name} registrada com sucesso`,
      type: 'success'
    });

    // Reset form
    setSelectedEquipment('');
    setChecklist({
      physicalCondition: 5,
      functionality: 5,
      noise: 5,
      stability: 5,
      observations: '',
      photos: [],
      videos: [],
      needsMaintenance: false,
      maintenanceType: 'preventive',
      maintenancePriority: 'medium',
      maintenanceDescription: ''
    });
  };

  const ScoreSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    description: string;
  }> = ({ label, value, onChange, description }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-900 dark:text-white">{label}</label>
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          value >= 8 ? 'bg-green-100 text-green-800' :
          value >= 5 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );

  const selectedEquipmentData = equipments.find(eq => eq.id === selectedEquipment);
  const selectedUnit = selectedEquipmentData ? units.find(u => u.id === selectedEquipmentData.unitId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Novo Checklist
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Realize uma inspeção detalhada do equipamento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Selecionar Equipamento
            </h3>
            
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white mb-4"
            >
              <option value="">Escolha um equipamento</option>
              {availableEquipments.map((equipment) => {
                const unit = units.find(u => u.id === equipment.unitId);
                return (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name} - {equipment.tag} ({unit?.name})
                  </option>
                );
              })}
            </select>

            {selectedEquipmentData && (
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {selectedEquipmentData.name}
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Etiqueta:</span>
                    <span className="font-medium">{selectedEquipmentData.tag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Modelo:</span>
                    <span className="font-medium">{selectedEquipmentData.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Unidade:</span>
                    <span className="font-medium text-xs">{selectedUnit?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Última inspeção:</span>
                    <span className="font-medium">
                      {new Date(selectedEquipmentData.lastInspection).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Checklist Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
              Avaliação Técnica
            </h3>

            <div className="space-y-8">
              {/* Scoring Section */}
              <div className="space-y-6">
                <ScoreSlider
                  label="Estado Físico"
                  value={checklist.physicalCondition}
                  onChange={(value) => setChecklist(prev => ({ ...prev, physicalCondition: value }))}
                  description="Avalie a condição visual, desgaste, pintura, estrutura"
                />

                <ScoreSlider
                  label="Funcionamento"
                  value={checklist.functionality}
                  onChange={(value) => setChecklist(prev => ({ ...prev, functionality: value }))}
                  description="Teste todas as funcionalidades principais do equipamento"
                />

                <ScoreSlider
                  label="Ruídos"
                  value={checklist.noise}
                  onChange={(value) => setChecklist(prev => ({ ...prev, noise: value }))}
                  description="Avalie ruídos anormais durante o funcionamento"
                />

                <ScoreSlider
                  label="Estabilidade"
                  value={checklist.stability}
                  onChange={(value) => setChecklist(prev => ({ ...prev, stability: value }))}
                  description="Verifique firmeza, fixação, alinhamento"
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Evidências Fotográficas e Vídeos
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Fotos</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Video className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Vídeos</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MOV</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded Media Preview */}
                {(checklist.photos.length > 0 || checklist.videos.length > 0) && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Arquivos Enviados:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {checklist.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo} 
                            alt={`Upload ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                      {checklist.videos.map((video, index) => (
                        <div key={index} className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Observations */}
              <div className="space-y-2">
                <label className="font-medium text-gray-900 dark:text-white">
                  Observações Adicionais
                </label>
                <textarea
                  value={checklist.observations}
                  onChange={(e) => setChecklist(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Descreva detalhes importantes, anomalias encontradas, recomendações..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Maintenance Request */}
              <div className="space-y-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needsMaintenance"
                    checked={checklist.needsMaintenance}
                    onChange={(e) => setChecklist(prev => ({ ...prev, needsMaintenance: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="needsMaintenance" className="font-medium text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                    Solicitar Manutenção
                  </label>
                </div>

                {checklist.needsMaintenance && (
                  <div className="space-y-4 ml-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select
                        value={checklist.maintenanceType}
                        onChange={(e) => setChecklist(prev => ({ ...prev, maintenanceType: e.target.value as 'preventive' | 'corrective' }))}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="preventive">Manutenção Preventiva</option>
                        <option value="corrective">Manutenção Corretiva</option>
                      </select>

                      <select
                        value={checklist.maintenancePriority}
                        onChange={(e) => setChecklist(prev => ({ ...prev, maintenancePriority: e.target.value as 'low' | 'medium' | 'high' }))}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="low">Baixa Prioridade</option>
                        <option value="medium">Média Prioridade</option>
                        <option value="high">Alta Prioridade</option>
                      </select>
                    </div>

                    <textarea
                      value={checklist.maintenanceDescription}
                      onChange={(e) => setChecklist(prev => ({ ...prev, maintenanceDescription: e.target.value }))}
                      placeholder="Descreva o problema e a manutenção necessária..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedEquipment}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Finalizar Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChecklist;