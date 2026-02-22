import React, { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Stack,
  Grid,
  Chip,
  Box,
  Button,
  ButtonGroup
} from '@mui/material'
import {
  CalendarMonthRounded,
  RestaurantRounded,
  EggRounded,
  WaterDropRounded,
  DirectionsWalkRounded,
  FitnessCenterRounded,
  MonitorWeightRounded,
  DownloadRounded,
  FilterAltRounded
} from '@mui/icons-material'
import { format, subDays } from 'date-fns'
import useAppStore from '../store/useAppStore.js'

const metricCatalog = [
  { key: 'calories', label: 'Calories', icon: <RestaurantRounded fontSize="inherit" />, unit: 'kcal' },
  { key: 'protein', label: 'Protein', icon: <EggRounded fontSize="inherit" />, unit: 'g' },
  { key: 'water', label: 'Water', icon: <WaterDropRounded fontSize="inherit" />, unit: 'ml' },
  { key: 'steps', label: 'Steps', icon: <DirectionsWalkRounded fontSize="inherit" />, unit: '' },
  { key: 'workoutMins', label: 'Workout', icon: <FitnessCenterRounded fontSize="inherit" />, unit: 'min' },
  { key: 'weightKg', label: 'Weight', icon: <MonitorWeightRounded fontSize="inherit" />, unit: 'kg' }
]

function metricsForMode(mode) {
  if (mode === 'nutrition') return metricCatalog.filter((item) => ['calories', 'protein', 'water'].includes(item.key))
  if (mode === 'activity') return metricCatalog.filter((item) => ['steps', 'workoutMins'].includes(item.key))
  if (mode === 'weight') return metricCatalog.filter((item) => item.key === 'weightKg')
  return metricCatalog
}

function csvEscape(value) {
  const text = String(value ?? '')
  if (!/[",\n]/.test(text)) return text
  return `"${text.replace(/"/g, '""')}"`
}

function getMetricValue(row, weightByDate, metricKey) {
  if (metricKey === 'weightKg') return weightByDate[row.date]
  return row[metricKey]
}

export default function History() {
  const { logs, weights } = useAppStore()
  const [range, setRange] = useState('90')
  const [mode, setMode] = useState('all')

  const rows = useMemo(
    () =>
      Object.entries(logs)
        .map(([date, value]) => ({ date, ...value }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [logs]
  )

  const weightByDate = useMemo(
    () => Object.fromEntries(weights.map((entry) => [entry.date, entry.kg])),
    [weights]
  )

  const rangeDays = range === 'all' ? null : Number(range)
  const cutoffDate = rangeDays ? format(subDays(new Date(), rangeDays - 1), 'yyyy-MM-dd') : ''
  const filteredRows = cutoffDate ? rows.filter((row) => row.date >= cutoffDate) : rows
  const activeMetrics = metricsForMode(mode)

  const onExportCsv = () => {
    if (!filteredRows.length) return

    const header = ['Date', ...activeMetrics.map((metric) => metric.label)]
    const lines = filteredRows.map((row) => [
      row.date,
      ...activeMetrics.map((metric) => getMetricValue(row, weightByDate, metric.key))
    ])
    const csv = [header, ...lines]
      .map((fields) => fields.map((field) => csvEscape(formatValue(field))).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `history-${mode}-${range}-${format(new Date(), 'yyyyMMdd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
          >
            <Box>
              <Typography variant="h6">History</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Filter by period and focus area, then export exactly what you need.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip size="small" icon={<CalendarMonthRounded />} label={`${filteredRows.length} filtered days`} />
              <Chip size="small" color="secondary" icon={<MonitorWeightRounded />} label={`${weights.length} weigh-ins`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={1.25}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                <FilterAltRounded color="primary" />
                <ButtonGroup size="small" variant="outlined" aria-label="range">
                  <Button variant={range === '30' ? 'contained' : 'outlined'} onClick={() => setRange('30')}>
                    30d
                  </Button>
                  <Button variant={range === '60' ? 'contained' : 'outlined'} onClick={() => setRange('60')}>
                    60d
                  </Button>
                  <Button variant={range === '90' ? 'contained' : 'outlined'} onClick={() => setRange('90')}>
                    90d
                  </Button>
                  <Button variant={range === 'all' ? 'contained' : 'outlined'} onClick={() => setRange('all')}>
                    All
                  </Button>
                </ButtonGroup>
              </Stack>
              <Button
                variant="contained"
                startIcon={<DownloadRounded />}
                onClick={onExportCsv}
                disabled={!filteredRows.length}
              >
                Export CSV
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label="All"
                clickable
                color={mode === 'all' ? 'primary' : 'default'}
                onClick={() => setMode('all')}
              />
              <Chip
                label="Nutrition"
                clickable
                color={mode === 'nutrition' ? 'primary' : 'default'}
                onClick={() => setMode('nutrition')}
              />
              <Chip
                label="Activity"
                clickable
                color={mode === 'activity' ? 'primary' : 'default'}
                onClick={() => setMode('activity')}
              />
              <Chip
                label="Weight"
                clickable
                color={mode === 'weight' ? 'primary' : 'default'}
                onClick={() => setMode('weight')}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Stack spacing={1.25}>
          {filteredRows.length === 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No history in this filter range yet.
                </Typography>
              </CardContent>
            </Card>
          )}
          {filteredRows.map((row) => (
            <Card key={row.date} variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">{row.date}</Typography>
                  </Grid>
                  {activeMetrics.map((metric) => (
                    <Grid item xs={6} key={`${row.date}-${metric.key}`}>
                      <SmallStat
                        icon={metric.icon}
                        label={metric.label}
                        value={getMetricValue(row, weightByDate, metric.key)}
                        unit={metric.unit}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <Card sx={{ display: { xs: 'none', md: 'block' } }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  {activeMetrics.map((metric) => (
                    <TableCell key={metric.key}>{metric.label}{metric.unit ? ` (${metric.unit})` : ''}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{row.date}</TableCell>
                    {activeMetrics.map((metric) => (
                      <TableCell key={`${row.date}-${metric.key}`}>
                        {formatValue(getMetricValue(row, weightByDate, metric.key))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={activeMetrics.length + 1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
                        No history in this filter range yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  )
}

function SmallStat({ icon, label, value, unit }) {
  return (
    <Stack spacing={0.25}>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
        <Box sx={{ fontSize: 14, display: 'grid', placeItems: 'center', color: 'primary.main' }}>{icon}</Box>
        <Typography variant="caption">{label}</Typography>
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 650 }}>
        {formatValue(value)}
        {typeof value === 'number' && unit ? ` ${unit}` : ''}
      </Typography>
    </Stack>
  )
}

function formatValue(value) {
  return typeof value === 'number' ? value : '--'
}
