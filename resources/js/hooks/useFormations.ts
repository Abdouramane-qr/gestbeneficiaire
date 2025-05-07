// resources/js/hooks/useFormations.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Formation {
  id: number;
  type: 'technique' | 'entrepreneuriat';
  libelle: string;
  actif: boolean;
  ordre: number;
  created_at: string;
  updated_at: string;
}

export function useFormations(type: 'technique' | 'entrepreneuriat') {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFormations = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Formation[]>(`/formations/type/${type}`);
      setFormations(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des formations:', err);
      setError('Impossible de charger les formations. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const addFormation = async (libelle: string): Promise<Formation | null> => {
    try {
      const response = await axios.post<Formation>('/formations', {
        type,
        libelle: libelle.trim()
      });

      // Mise à jour immédiate du state avec la nouvelle formation
      setFormations(prev => [...prev, response.data].sort((a, b) => a.libelle.localeCompare(b.libelle)));
      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout de la formation');
      }
      console.error('Erreur lors de l\'ajout de la formation:', err);
      return null;
    }
  };

  const updateFormation = async (id: number, libelle: string): Promise<Formation | null> => {
    try {
      const response = await axios.put<Formation>(`/formations/${id}`, {
        libelle: libelle.trim()
      });

      // Mise à jour immédiate du state
      setFormations(prev =>
        prev.map(item => item.id === id ? response.data : item)
          .sort((a, b) => a.libelle.localeCompare(b.libelle))
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de la mise à jour de la formation');
      }
      console.error('Erreur lors de la mise à jour de la formation:', err);
      return null;
    }
  };

  const deleteFormation = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`/formations/${id}`);
      // Mise à jour immédiate du state en supprimant la formation
      setFormations(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la formation');
      console.error('Erreur lors de la suppression de la formation:', err);
      return false;
    }
  };

  // Charger les formations au montage du composant
  useEffect(() => {
    loadFormations();
  }, [type]);

  return {
    formations,
    loading,
    error,
    addFormation,
    updateFormation,
    deleteFormation,
    reload: loadFormations,
    clearError: () => setError(null)
  };
}