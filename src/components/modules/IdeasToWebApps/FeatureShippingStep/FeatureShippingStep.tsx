'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

interface Props{
  active: boolean;
}

// Only the fields the dashboard uses (HMW.json has more)
interface Card {
  id      : string;
  name    : string;
  type    : string;
  rarity  : string;
  aspects : string[];
  arenas  : string[];
  cost    : string | null;
  power   : string | null;
  hp      : string | null;
}

const ink = '#242424';

// Chart colors must be real color values: MUI charts brightens/darkens them, which can't be done to CSS variables.
// Same values as the --color-* variables in globals.css.
const palette = {
  plum    : '#7D4156',
  navy    : '#00304B',
  rust    : '#A5501A',
  mustard : '#BF912E',
  olive   : '#525415',
  stone   : '#CFCEB7',
  ink     : '#262215',
};

const cardTypes     = ['Leader', 'Base', 'Unit', 'Event', 'Upgrade', 'Token'];
const rarityOrder   = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Special'];
const arenaOptions  = ['All', 'Ground', 'Space'];

// Star Wars Unlimited aspect colors, mapped onto the site palette
const aspectColors: Record<string, string> = {
  Vigilance   : palette.navy,
  Command     : palette.olive,
  Aggression  : palette.rust,
  Cunning     : palette.mustard,
  Heroism     : palette.stone,
  Villainy    : palette.ink,
};

const toNumber = (value: string | null) => (value === null || value === '' || isNaN(Number(value))) ?(null) :(Number(value));

// Small fixed offset per card so dots on the same whole-number spot don't hide each other
const jitter = (id: string, salt: number) => {
  let hash = salt;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  return (hash / 1000 - 0.5) * 0.36;
};

const FeatureShippingStep = ({ active }: Props) => {
  const [cards, setCards]               = useState<Card[] | null>(null);
  const [types, setTypes]               = useState<string[]>(cardTypes.filter((type) => type !== 'Token'));
  const [arena, setArena]               = useState('All');
  const [sortByCount, setSortByCount]   = useState(false);
  const [replayKey, setReplayKey]       = useState(0);

  // Load the card data only once this step is first shown (keeps it out of the initial page load)
  useEffect(() => {
    if (!active || cards) return;
    import('@/data/dashboard-data/HMW.json').then((module) => setCards(module.default as Card[]));
  }, [active, cards]);

  // Replay the chart entrance each time the step comes back up
  useEffect(() => {
    if (active) setReplayKey((key) => key + 1);
  }, [active]);

  const filtered = useMemo(() => (cards ?? []).filter((card) =>
    types.includes(card.type) && (arena === 'All' || card.arenas.includes(arena))
  ), [cards, types, arena]);

  // Bar: cards by rarity
  const rarityData = useMemo(() => {
    const rows = rarityOrder.map((rarity) => ({ rarity, count: filtered.filter((card) => card.rarity === rarity).length }));
    return sortByCount ?([...rows].sort((a, b) => b.count - a.count)) :(rows);
  }, [filtered, sortByCount]);

  // Line: how many cards at each cost
  const costData = useMemo(() => {
    const costs = filtered.map((card) => toNumber(card.cost)).filter((cost): cost is number => cost !== null);
    const max   = Math.max(8, ...costs);
    return Array.from({ length: max + 1 }, (_, cost) => ({ cost, count: costs.filter((value) => value === cost).length }));
  }, [filtered]);

  // Pie: aspect split (a card counts once per aspect it has)
  const aspectData = useMemo(() =>
    Object.keys(aspectColors).map((aspect) => ({
      id    : aspect,
      label : aspect,
      value : filtered.filter((card) => card.aspects.includes(aspect)).length,
      color : aspectColors[aspect],
    })).filter((slice) => slice.value > 0)
  , [filtered]);

  // Scatter: power vs HP, one dot per card, split by arena
  const scatterSeries = useMemo(() => ['Ground', 'Space'].map((arenaName) => ({
    id    : arenaName,   // Fixed id so hover state never points at a different series after filtering
    label : arenaName,
    color : (arenaName === 'Ground') ?(palette.olive) :(palette.plum),
    data  : filtered
      .filter((card) => card.arenas.includes(arenaName) && toNumber(card.power) !== null && toNumber(card.hp) !== null)
      .map((card) => ({
        id  : card.id,
        x   : (toNumber(card.power) as number) + jitter(card.id, 7),
        y   : (toNumber(card.hp) as number) + jitter(card.id, 13),
      })),
    valueFormatter: (value: { id: string | number } | null) => {
      const card = filtered.find((item) => item.id === value?.id);
      return (card) ?(`${card.name}: ${card.power} power / ${card.hp} HP`) :('');
    },
  })).filter((series) => series.data.length > 0), [filtered]);

  const toggleType = (type: string) =>
    setTypes((prev) => prev.includes(type) ?(prev.filter((item) => item !== type)) :([...prev, type]));

  const resetFilters = () => {
    setTypes(cardTypes.filter((type) => type !== 'Token'));
    setArena('All');
    setSortByCount(false);
  };

  return(<>
    <Box sx={{ display: 'grid', gap: '14px', padding: '1.25rem 0.75rem 0.5rem', containerType: 'inline-size' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '4px 12px' }}>
        <p style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
          Star Wars Unlimited: HMW Set Dashboard
        </p>
        <p style={{ fontSize: '14px', letterSpacing: '1px' }}>
          Showing <strong>{filtered.length}</strong> of {cards?.length ?? '...'} cards
        </p>
      </Box>

      {/* Toolbar: filters & sorting */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px' }}>
        <ToolGroup label='Type'>
          {cardTypes.map((type) => (
            <Pill key={type} selected={types.includes(type)} onClick={() => toggleType(type)}>{type}</Pill>
          ))}
        </ToolGroup>

        <ToolGroup label='Arena'>
          {arenaOptions.map((option) => (
            <Pill key={option} selected={arena === option} onClick={() => setArena(option)}>{option}</Pill>
          ))}
        </ToolGroup>

        <ToolGroup label='Sort'>
          <Pill selected={sortByCount} onClick={() => setSortByCount((prev) => !prev)}>
            {sortByCount ?('Most cards') :('Rarity order')}
          </Pill>
        </ToolGroup>

        <button type='button' onClick={resetFilters} style={{ ...pillBase, border: 'none', textDecoration: 'underline', background: 'none', padding: '4px 2px' }}>
          Reset
        </button>
      </Box>

      {/* Charts (same layout as the wireframe: narrow left column, wide right column) */}
      {/* Stacks to one column when the dashboard itself is narrow (e.g. the standalone playground on phones) */}
      <Box key={replayKey} sx={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '12px', '@container (max-width: 400px)': { gridTemplateColumns: '1fr' } }}>
        <ChartPanel title='Cards by Rarity' color='var(--color-mustard)'>
          {(filtered.length === 0) ?(<EmptyChart />) :(
          <BarChart
            height    = {170}
            margin    = {{ top: 10, right: 8, bottom: 26, left: 32 }}
            xAxis     = {[{ scaleType: 'band', data: rarityData.map((row) => row.rarity), valueFormatter: (rarity: string, context) => (context.location === 'tick') ?(rarity.slice(0, 3)) :(rarity) }]}
            series    = {[{ data: rarityData.map((row) => row.count), label: 'Cards', color: palette.mustard }]}
            borderRadius  = {6}
            slotProps = {{ legend: { hidden: true } }}
            sx        = {chartSx}
          />
          )}
        </ChartPanel>

        <ChartPanel title='Cost Curve' color='var(--color-navy)'>
          {(filtered.length === 0) ?(<EmptyChart />) :(
          <LineChart
            height    = {170}
            margin    = {{ top: 10, right: 12, bottom: 26, left: 32 }}
            xAxis     = {[{ scaleType: 'point', data: costData.map((row) => row.cost), label: '' }]}
            series    = {[{ data: costData.map((row) => row.count), label: 'Cards', color: palette.navy, area: true, curve: 'monotoneX', showMark: true }]}
            slotProps = {{ legend: { hidden: true } }}
            sx        = {{ ...chartSx, '& .MuiAreaElement-root': { fillOpacity: 0.15 } }}
          />
          )}
        </ChartPanel>

        <ChartPanel title='Aspect Split' color='var(--color-rust)'>
          {(aspectData.length === 0) ?(<EmptyChart />) :(
          // Radii are % of the space available, so the donut shrinks with its panel instead of clipping on phones
          <PieChart
            height    = {170}
            margin    = {{ top: 12, right: 12, bottom: 12, left: 12 }}
            series    = {[{ data: aspectData, innerRadius: '44%', outerRadius: '94%', paddingAngle: 2, cornerRadius: 4, highlightScope: { faded: 'global', highlighted: 'item' } }]}
            slotProps = {{ legend: { hidden: true } }}
            sx        = {{ ...chartSx, '& .MuiPieArc-root': { stroke: ink, strokeWidth: 2 } }}
          />
          )}
        </ChartPanel>

        <ChartPanel title='Power vs HP' color='var(--color-olive)'>
          {/* MUI's scatter hover crashes with no series ("Cannot read properties of undefined (reading 'series')"), so never render it empty */}
          {(scatterSeries.length === 0) ?(<EmptyChart />) :(
          <ScatterChart
            height    = {170}
            margin    = {{ top: 10, right: 12, bottom: 26, left: 32 }}
            series    = {scatterSeries.map((series) => ({ ...series, markerSize: 4 }))}
            xAxis     = {[{ min: -0.5, tickMinStep: 1 }]}
            yAxis     = {[{ min: 0, tickMinStep: 2 }]}
            slotProps = {{ legend: { hidden: true } }}
            sx        = {chartSx}
          />
          )}
        </ChartPanel>
      </Box>
    </Box>
  </>)
}


// Shared chart styling: ink axes & Montserrat text to match the rest of the site
const chartSx = {
  '& text'                          : { fontFamily: 'inherit !important' },
  '& .MuiChartsAxis-line'           : { stroke: `${ink} !important`, strokeWidth: '2 !important' },
  '& .MuiChartsAxis-tick'           : { stroke: `${ink} !important` },
  '& .MuiChartsAxis-tickLabel'      : { fill: `${ink} !important`, fontSize: '11px !important' },
};

const pillBase = {
  fontFamily: 'inherit',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  cursor: 'pointer',
  color: ink,
};

const Pill = ({ selected, onClick, children }: { selected: boolean, onClick: () => void, children: ReactNode }) => (
  <button
    type          = 'button'
    onClick       = {onClick}
    aria-pressed  = {selected}
    style={{
      ...pillBase,
      padding: '3px 10px',
      border: `2px solid ${ink}`,
      borderRadius: '20px',
      backgroundColor: selected ?('var(--color-navy)') :('var(--color-cream)'),
      color: selected ?('white') :(ink),
      transition: 'background-color 0.2s, color 0.2s'
    }}
  >
    {children}
  </button>
);

const ToolGroup = ({ label, children }: { label: string, children: ReactNode }) => (
  <Box role='group' aria-label={label} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
    <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>{label}</span>
    {children}
  </Box>
);

// Shown in place of a chart when the filters leave it nothing to draw
const EmptyChart = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', height: '170px', padding: '0 1rem', textAlign: 'center', fontSize: '13px', letterSpacing: '1px', color: ink }}>
    No cards match these filters
  </Box>
);

const ChartPanel = ({ title, color, children }: { title: string, color: string, children: ReactNode }) => (
  <Box sx={{ border: `3px solid ${ink}`, borderRadius: '10px', backgroundColor: 'var(--color-cream)', overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderBottom: `3px solid ${ink}` }}>
      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color, border: `2px solid ${ink}` }} />
      <span style={{ fontSize: '14px', fontWeight: 600 }}>{title}</span>
    </Box>
    {children}
  </Box>
);

export default FeatureShippingStep;
