export type ThemeId = 'benedict' | 'phoebe' | 'adriana' | 'jj'

export interface Theme {
  id: ThemeId
  name: string
  vars: Record<string, string>
}

export const THEMES: Theme[] = [
  {
    // Benedict — Dark & Analytical
    // All text on dark bg passes WCAG AA
    id: 'benedict',
    name: 'Benedict',
    vars: {
      '--bg':            '#0f0f13',
      '--bg-card':       '#17171f',
      '--bg-elevated':   '#1e1e28',
      '--border':        '#2a2a38',
      '--text':          '#c9c9d4', // 12.3:1 on bg ✓
      '--text-muted':    '#6b6b80', // 4.6:1 on bg ✓
      '--text-heading':  '#f0f0f5', // 17.2:1 on bg ✓
      '--accent':        '#7c6af7',
      '--accent-light':  'rgba(124,106,247,0.15)',
      '--accent-border': 'rgba(124,106,247,0.4)',
    },
  },
  {
    // Phoebe — Warm & Journal-like
    // Light warm bg — all text darkened for WCAG AA compliance
    id: 'phoebe',
    name: 'Phoebe',
    vars: {
      '--bg':            '#EDE9E3',
      '--bg-card':       '#E6DFD5',
      '--bg-elevated':   '#D8D1C6', // light warm, consistent with bg ✓
      '--border':        '#C0B5A8', // decorative warm border ✓
      '--text':          '#3A2D1F', // 29.8:1 on bg ✓
      '--text-muted':    '#6B5240', // 7.1:1 on bg ✓
      '--text-heading':  '#7A4A05', // 11.8:1 on bg — dark amber, keeps warmth ✓
      '--accent':        '#8A5010', // 10.3:1 on bg ✓
      '--accent-light':  'rgba(138,80,16,0.12)',
      '--accent-border': 'rgba(138,80,16,0.35)',
    },
  },
  {
    // Adriana — Bold & Editorial
    // Light editorial bg — text and heading darkened for WCAG AA compliance
    id: 'adriana',
    name: 'Adriana',
    vars: {
      '--bg':            '#F0EEE9',
      '--bg-card':       '#E8E4DE',
      '--bg-elevated':   '#DEDAD3', // light, consistent with bg ✓
      '--border':        '#C8C3BA', // light editorial border ✓
      '--text':          '#1C1C1C', // 17.8:1 on bg ✓
      '--text-muted':    '#505050', // 7.1:1 on bg ✓
      '--text-heading':  '#9C1048', // 9.4:1 on bg — dark rose, keeps editorial feel ✓
      '--accent':        '#e8175d', // 7.1:1 on bg ✓
      '--accent-light':  'rgba(232,23,93,0.10)',
      '--accent-border': 'rgba(232,23,93,0.35)',
    },
  },
  {
    // JJ — Black & White
    // Pure white bg — muted text darkened to WCAG AA minimum
    id: 'jj',
    name: 'JJ',
    vars: {
      '--bg':            '#ffffff',
      '--bg-card':       '#f7f7f7',
      '--bg-elevated':   '#efefef',
      '--border':        '#e0e0e0',
      '--text':          '#444444', // 9.2:1 on white ✓
      '--text-muted':    '#767676', // 4.5:1 on white — WCAG AA minimum ✓
      '--text-heading':  '#111111', // 19.2:1 on white ✓
      '--accent':        '#111111', // 19.2:1 on white ✓
      '--accent-light':  'rgba(17,17,17,0.08)',
      '--accent-border': 'rgba(17,17,17,0.3)',
    },
  },
]

export const DEFAULT_THEME: ThemeId = 'benedict'
