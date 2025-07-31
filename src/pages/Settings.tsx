import React, { useState } from 'react';
import { 
  Save, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Smartphone,
  Globe,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      maintenanceAlerts: true,
      inspectionReminders: true,
      systemUpdates: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    system: {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'dd/MM/yyyy',
      autoBackup: true,
      backupFrequency: 'daily'
    }
  });

  const handleSave = () => {
    // Simulate saving settings
    alert('Configurações salvas com sucesso!');
  };

  const exportData = () => {
    // Simulate data export
    alert('Dados exportados com sucesso!');
  };

  const importData = () => {
    // Simulate data import
    alert('Funcionalidade de importação será implementada.');
  };

  const SettingsSection: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, description, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        {description && <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${enabled ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Personalize o sistema de acordo com suas preferências
          </p>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Perfil do Usuário"
          description="Gerencie suas informações pessoais"
          icon={<Shield className="h-5 w-5 text-red-600" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={user?.name || ''}
                onChange={(e) => updateUser({ name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                onChange={(e) => updateUser({ email: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Perfil
              </label>
              <select
                value={user?.role || 'inspector'}
                disabled
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              >
                <option value="admin">Administrador</option>
                <option value="technician">Técnico</option>
                <option value="inspector">Inspetor</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notificações"
          description="Configure como deseja receber alertas"
          icon={<Bell className="h-5 w-5 text-red-600" />}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Canais de Notificação</h4>
              <div className="space-y-2">
                <ToggleSwitch
                  enabled={settings.notifications.email}
                  onChange={(enabled) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: enabled }
                  }))}
                  label="Email"
                  description="Receber notificações por email"
                />
                <ToggleSwitch
                  enabled={settings.notifications.push}
                  onChange={(enabled) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: enabled }
                  }))}
                  label="Push (Navegador)"
                  description="Notificações no navegador"
                />
                <ToggleSwitch
                  enabled={settings.notifications.sms}
                  onChange={(enabled) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, sms: enabled }
                  }))}
                  label="SMS"
                  description="Mensagens de texto para urgências"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tipos de Alerta</h4>
              <div className="space-y-2">
                <ToggleSwitch
                  enabled={settings.notifications.maintenanceAlerts}
                  onChange={(enabled) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, maintenanceAlerts: enabled }
                  }))}
                  label="Alertas de Manutenção"
                />
                <ToggleSwitch
                  enabled={settings.notifications.inspectionReminders}
                  onChange={(enabled) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, inspectionReminders: enabled }
                  }))}
                  label="Lembretes de Inspeção"
                />
                <ToggleSwitch
                  enabled={settings.notifications.systemUpdates}
                  onChange={(enabled) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, systemUpdates: enabled }
                  }))}
                  label="Atualizações do Sistema"
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection
          title="Aparência"
          description="Personalize a interface do sistema"
          icon={isDarkMode ? <Moon className="h-5 w-5 text-red-600" /> : <Sun className="h-5 w-5 text-red-600" />}
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={isDarkMode}
              onChange={setIsDarkMode}
              label="Modo Escuro"
              description="Interface otimizada para ambientes industriais"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Idioma
              </label>
              <select
                value={settings.system.language}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, language: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Formato de Data
              </label>
              <select
                value={settings.system.dateFormat}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, dateFormat: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                <option value="yyyy-MM-dd">AAAA-MM-DD</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection
          title="Segurança"
          description="Configure opções de segurança e acesso"
          icon={<Shield className="h-5 w-5 text-red-600" />}
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.security.twoFactorAuth}
              onChange={(enabled) => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, twoFactorAuth: enabled }
              }))}
              label="Autenticação de Dois Fatores"
              description="Camada extra de segurança"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeout da Sessão (minutos)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={60}>1 hora</option>
                <option value={120}>2 horas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiração da Senha (dias)
              </label>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={30}>30 dias</option>
                <option value={60}>60 dias</option>
                <option value={90}>90 dias</option>
                <option value={180}>180 dias</option>
                <option value={0}>Nunca</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Backup & Data Settings */}
        <SettingsSection
          title="Backup e Dados"
          description="Gerencie backup e exportação de dados"
          icon={<Database className="h-5 w-5 text-red-600" />}
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.system.autoBackup}
              onChange={(enabled) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, autoBackup: enabled }
              }))}
              label="Backup Automático"
              description="Backup automático dos dados"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequência do Backup
              </label>
              <select
                value={settings.system.backupFrequency}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, backupFrequency: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={exportData}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </button>
              
              <button
                onClick={importData}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* System Information */}
        <SettingsSection
          title="Informações do Sistema"
          description="Detalhes sobre a versão e configuração"
          icon={<Globe className="h-5 w-5 text-red-600" />}
        >
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Versão:</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Última Atualização:</span>
              <span className="font-medium">20/01/2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Ambiente:</span>
              <span className="font-medium">Produção</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fuso Horário:</span>
              <span className="font-medium">America/Sao_Paulo</span>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;