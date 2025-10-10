import React from 'react';
import { Card, EmptyState, Button } from '../../../../shared/components/ui';
import { authStore } from '../../../../shared/store/authStore';

interface HomeTabProps {
  userName?: string;
}

const HomeTab: React.FC<HomeTabProps> = ({ userName = 'Estudiante' }) => {
  const handleGithubConnect = () => {
    const token = authStore.token || '';
    const encodedToken = encodeURIComponent(token);
    const url = `${import.meta.env.VITE_API_URL}/api/github/authorize?state=${encodedToken}`;
    window.location.href = url;
  };

  return (
    <div className="space-y-6">
      <Card 
        title={`Bienvenido, ${userName}`}
        variant="primary"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-4">Aquí verás tus clases y tareas.</p>
          <Button 
            onClick={handleGithubConnect} 
            variant="primary"
          >
            Conectar con Github
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          title="Tareas Pendientes" 
          variant="secondary"
        >
          <div className="p-4">
            <EmptyState
              title="No hay tareas pendientes"
              description="Las tareas asignadas aparecerán aquí"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>}
            />
          </div>
        </Card>
        
        <Card 
          title="Actividad Reciente" 
          variant="secondary"
        >
          <div className="p-4">
            <EmptyState
              title="No hay actividad reciente"
              description="Su actividad reciente aparecerá aquí"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomeTab;