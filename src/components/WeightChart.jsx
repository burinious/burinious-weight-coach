import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import useAppStore from '../store/useAppStore.js'

export default function WeightChart() {
  const weights = useAppStore(s => s.weights)
  const data = [...weights]
    .sort((a,b)=> a.date.localeCompare(b.date))
    .map(w => ({ date: w.date.slice(5), kg: Number(w.kg) }))

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip />
          <Line type="monotone" dataKey="kg" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}