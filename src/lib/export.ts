import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { AnnotatedChat, PeriodKey, PeriodReflection } from '../types'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function csvEscape(val: string | number): string {
  const s = String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

export function exportJSON(
  chats: AnnotatedChat[],
  periodReflections: Record<PeriodKey, PeriodReflection>
) {
  const payload = {
    exportedAt: new Date().toISOString(),
    totalChats: chats.length,
    periodReflections,
    chats,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `claude-chats-enriched-${Date.now()}.json`)
}

export function exportCSV(chats: AnnotatedChat[]) {
  const headers = ['Title', 'Date', 'Messages', 'Computed Topics', 'Top Terms', 'User Tags', 'User Note']
  const rows = chats.map(c => [
    csvEscape(c.name || 'Untitled'),
    new Date(c.created_at).toLocaleDateString(),
    c.chat_messages.length,
    csvEscape(c.computed.topics.join('; ')),
    csvEscape(c.computed.topTerms.slice(0, 8).join('; ')),
    csvEscape(c.user.tags.join('; ')),
    csvEscape(c.user.note),
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  downloadBlob(blob, `claude-chats-${Date.now()}.csv`)
}

export async function exportElementAsPng(elementId: string, filename: string) {
  const el = document.getElementById(elementId)
  if (!el) return
  try {
    const dataUrl = await toPng(el, { backgroundColor: '#0f0f13', pixelRatio: 2 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  } catch (e) {
    console.error('PNG export failed', e)
  }
}

export async function exportElementAsPdf(elementId: string, filename: string) {
  const el = document.getElementById(elementId)
  if (!el) return
  try {
    const canvas = await html2canvas(el, { backgroundColor: '#0f0f13', scale: 1.5 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(filename)
  } catch (e) {
    console.error('PDF export failed', e)
  }
}
