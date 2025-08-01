import React from 'react';
import { 
  BarChart3, 
  Building2, 
  ClipboardCheck, 
  Wrench, 
  FileText, 
  Clock, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Logo from './Logo';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Geral', icon: BarChart3 },
    { id: 'units', name: 'Gerenciar Unidades', icon: Building2 },
    { id: 'equipments', name: 'Unidades e Equipamentos', icon: Building2 },
    { id: 'checklist', name: 'Novo Checklist', icon: ClipboardCheck },
    { id: 'calls', name: 'Chamados Técnicos', icon: Wrench },
    { id: 'reports', name: 'Relatórios', icon: FileText },
    { id: 'lifecycle', name: 'Vida Útil dos Equipamentos', icon: Clock },
    { id: 'users', name: 'Cadastro de Usuários', icon: Users },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  const handleMenuClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 bg-red-600">
            <Logo className="h-12 w-auto" />
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
              {unreadCount > 0 && (
                <div className="relative">
                  <Bell size={16} className="text-red-400" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-2 border-t border-gray-800">
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;