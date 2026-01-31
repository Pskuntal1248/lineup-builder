import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useFormations() {
  const [formations, setFormations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFormations() {
      try {
        const data = await api.getFormations()
        setFormations(data)
      } catch (err) {
        setError(err.message)
        // Use fallback formations
        setFormations(FALLBACK_FORMATIONS)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFormations()
  }, [])

  return { formations, loading, error }
}

// Fallback formations if API is unavailable
const FALLBACK_FORMATIONS = [
  {
    id: '4-3-3',
    name: '4-3-3',
    displayName: '4-3-3',
    category: 'attacking',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lcm', label: 'CM', x: 30, y: 55 },
      { id: 'cm', label: 'CM', x: 50, y: 50 },
      { id: 'rcm', label: 'CM', x: 70, y: 55 },
      { id: 'lw', label: 'LW', x: 15, y: 25 },
      { id: 'st', label: 'ST', x: 50, y: 18 },
      { id: 'rw', label: 'RW', x: 85, y: 25 }
    ]
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1',
    displayName: '4-2-3-1',
    category: 'balanced',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'ldm', label: 'CDM', x: 35, y: 58 },
      { id: 'rdm', label: 'CDM', x: 65, y: 58 },
      { id: 'lam', label: 'LAM', x: 20, y: 38 },
      { id: 'cam', label: 'CAM', x: 50, y: 35 },
      { id: 'ram', label: 'RAM', x: 80, y: 38 },
      { id: 'st', label: 'ST', x: 50, y: 18 }
    ]
  },
  {
    id: '4-4-2',
    name: '4-4-2',
    displayName: '4-4-2',
    category: 'balanced',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lb', label: 'LB', x: 15, y: 75 },
      { id: 'lcb', label: 'CB', x: 35, y: 78 },
      { id: 'rcb', label: 'CB', x: 65, y: 78 },
      { id: 'rb', label: 'RB', x: 85, y: 75 },
      { id: 'lm', label: 'LM', x: 15, y: 50 },
      { id: 'lcm', label: 'CM', x: 35, y: 52 },
      { id: 'rcm', label: 'CM', x: 65, y: 52 },
      { id: 'rm', label: 'RM', x: 85, y: 50 },
      { id: 'lst', label: 'ST', x: 35, y: 20 },
      { id: 'rst', label: 'ST', x: 65, y: 20 }
    ]
  },
  {
    id: '3-5-2',
    name: '3-5-2',
    displayName: '3-5-2',
    category: 'balanced',
    positions: [
      { id: 'gk', label: 'GK', x: 50, y: 92 },
      { id: 'lcb', label: 'CB', x: 25, y: 78 },
      { id: 'cb', label: 'CB', x: 50, y: 80 },
      { id: 'rcb', label: 'CB', x: 75, y: 78 },
      { id: 'lwb', label: 'LWB', x: 10, y: 55 },
      { id: 'lcm', label: 'CM', x: 30, y: 52 },
      { id: 'cdm', label: 'CDM', x: 50, y: 58 },
      { id: 'rcm', label: 'CM', x: 70, y: 52 },
      { id: 'rwb', label: 'RWB', x: 90, y: 55 },
      { id: 'lst', label: 'ST', x: 35, y: 20 },
      { id: 'rst', label: 'ST', x: 65, y: 20 }
    ]
  }
]
