export interface Unit {
  id: string
  name: string
  symbol: string
  description: string
  created_at: string
}

export const MOCK_UNITS: Unit[] = [
  { id: '1', name: 'Kilogram', symbol: 'kg', description: 'Weight measurement', created_at: '2024-01-15' },
  { id: '2', name: 'Gram', symbol: 'g', description: 'Small weight measurement', created_at: '2024-01-16' },
  { id: '3', name: 'Liter', symbol: 'L', description: 'Volume measurement', created_at: '2024-01-17' },
  { id: '4', name: 'Milliliter', symbol: 'ml', description: 'Small volume measurement', created_at: '2024-01-18' },
  { id: '5', name: 'Piece', symbol: 'pc', description: 'Unit count', created_at: '2024-01-19' },
]
