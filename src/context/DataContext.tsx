import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Equipment {
  id: string;
  name: string;
  tag: string;
  model: string;
  manufacturer: string;
  acquisitionDate: string;
  unitId: string;
  status: 'ok' | 'warning' | 'error';
  lastInspection: string;
  lifeExpectancy: number;
  currentAge: number;
  category: string;
}

export interface Unit {
  id: string;
  name: string;
  address: string;
  technician: string;
  equipmentCount: number;
}

export interface TechnicalCall {
  id: string;
  equipmentId: string;
  equipmentName: string;
  unitId: string;
  unitName: string;
  type: 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  description: string;
  technician?: string;
  resolution?: string;
  photos?: string[];
}

export interface Checklist {
  id: string;
  equipmentId: string;
  inspectorId: string;
  date: string;
  physicalCondition: number;
  functionality: number;
  noise: number;
  stability: number;
  observations: string;
  photos: string[];
  videos: string[];
  needsMaintenance: boolean;
}

interface DataContextType {
  units: Unit[];
  equipments: Equipment[];
  technicalCalls: TechnicalCall[];
  checklists: Checklist[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addTechnicalCall: (call: Omit<TechnicalCall, 'id'>) => void;
  updateTechnicalCall: (id: string, call: Partial<TechnicalCall>) => void;
  addChecklist: (checklist: Omit<Checklist, 'id'>) => void;
  getEquipmentsByUnit: (unitId: string) => Equipment[];
  getTechnicalCallsByUnit: (unitId: string) => TechnicalCall[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units] = useState<Unit[]>([
    { id: 'Unit-001', name: 'Academia Gaviões - Centro', address: 'Rua das Flores, 123', technician: 'João Silva', equipmentCount: 25 },
    { id: 'Unit-002', name: 'Academia Gaviões - Norte', address: 'Av. Principal, 456', technician: 'Maria Santos', equipmentCount: 30 },
    { id: 'Unit-003', name: 'Academia Gaviões - Sul', address: 'Rua da Paz, 789', technician: 'Pedro Costa', equipmentCount: 22 },
  ]);

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [technicalCalls, setTechnicalCalls] = useState<TechnicalCall[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    // Load mock data
    const mockEquipments: Equipment[] = [
      {
        id: 'EQ-001',
        name: 'Esteira Ergométrica',
        tag: 'EST-001',
        model: 'ProFit X3000',
        manufacturer: 'TechFit',
        acquisitionDate: '2023-01-15',
        unitId: 'Unit-001',
        status: 'ok',
        lastInspection: '2024-01-15',
        lifeExpectancy: 10,
        currentAge: 1,
        category: 'Cardiovascular'
      },
      {
        id: 'EQ-002',
        name: 'Leg Press 45°',
        tag: 'LP-001',
        model: 'PowerMax 450',
        manufacturer: 'StrengthTech',
        acquisitionDate: '2022-06-10',
        unitId: 'Unit-001',
        status: 'warning',
        lastInspection: '2024-01-10',
        lifeExpectancy: 15,
        currentAge: 2,
        category: 'Musculação'
      },
      {
        id: 'EQ-003',
        name: 'Bicicleta Ergométrica',
        tag: 'BIC-001',
        model: 'CardioMax Pro',
        manufacturer: 'FitTech',
        acquisitionDate: '2021-03-20',
        unitId: 'Unit-002',
        status: 'error',
        lastInspection: '2024-01-08',
        lifeExpectancy: 8,
        currentAge: 3,
        category: 'Cardiovascular'
      }
    ];

    const mockCalls: TechnicalCall[] = [
      {
        id: 'CALL-001',
        equipmentId: 'EQ-002',
        equipmentName: 'Leg Press 45°',
        unitId: 'Unit-001',
        unitName: 'Academia Gaviões - Centro',
        type: 'preventive',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        description: 'Ruído anormal durante o movimento'
      },
      {
        id: 'CALL-002',
        equipmentId: 'EQ-003',
        equipmentName: 'Bicicleta Ergométrica',
        unitId: 'Unit-002',
        unitName: 'Academia Gaviões - Norte',
        type: 'corrective',
        priority: 'high',
        status: 'in-progress',
        createdAt: '2024-01-19T14:30:00Z',
        updatedAt: '2024-01-20T08:15:00Z',
        description: 'Display não está funcionando',
        technician: 'Maria Santos'
      }
    ];

    setEquipments(mockEquipments);
    setTechnicalCalls(mockCalls);
  }, []);

  const addEquipment = (equipment: Omit<Equipment, 'id'>) => {
    const newEquipment = {
      ...equipment,
      id: `EQ-${Date.now()}`
    };
    setEquipments(prev => [...prev, newEquipment]);
  };

  const updateEquipment = (id: string, equipment: Partial<Equipment>) => {
    setEquipments(prev => prev.map(eq => eq.id === id ? { ...eq, ...equipment } : eq));
  };

  const deleteEquipment = (id: string) => {
    setEquipments(prev => prev.filter(eq => eq.id !== id));
  };

  const addTechnicalCall = (call: Omit<TechnicalCall, 'id'>) => {
    const newCall = {
      ...call,
      id: `CALL-${Date.now()}`
    };
    setTechnicalCalls(prev => [...prev, newCall]);
  };

  const updateTechnicalCall = (id: string, call: Partial<TechnicalCall>) => {
    setTechnicalCalls(prev => prev.map(c => c.id === id ? { ...c, ...call } : c));
  };

  const addChecklist = (checklist: Omit<Checklist, 'id'>) => {
    const newChecklist = {
      ...checklist,
      id: `CHK-${Date.now()}`
    };
    setChecklists(prev => [...prev, newChecklist]);
  };

  const getEquipmentsByUnit = (unitId: string) => {
    return equipments.filter(eq => eq.unitId === unitId);
  };

  const getTechnicalCallsByUnit = (unitId: string) => {
    return technicalCalls.filter(call => call.unitId === unitId);
  };

  return (
    <DataContext.Provider value={{
      units,
      equipments,
      technicalCalls,
      checklists,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addTechnicalCall,
      updateTechnicalCall,
      addChecklist,
      getEquipmentsByUnit,
      getTechnicalCallsByUnit
    }}>
      {children}
    </DataContext.Provider>
  );
};