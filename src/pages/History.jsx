import React from 'react'
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import useAppStore from '../store/useAppStore.js'

export default function History() {
  const { logs } = useAppStore()
  const rows = Object.entries(logs)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a,b)=> b.date.localeCompare(a.date))

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>History</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Protein (g)</TableCell>
              <TableCell>Water (ml)</TableCell>
              <TableCell>Steps</TableCell>
              <TableCell>Workout (min)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r)=> (
              <TableRow key={r.date}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.calories ?? '—'}</TableCell>
                <TableCell>{r.protein ?? '—'}</TableCell>
                <TableCell>{r.water ?? '—'}</TableCell>
                <TableCell>{r.steps ?? '—'}</TableCell>
                <TableCell>{r.workoutMins ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}