import { useEffect, useRef } from 'react'
import cloud from 'd3-cloud'
import type { WordFrequency } from '../../types'

interface Props {
  words: WordFrequency[]
  width?: number
  height?: number
}

const COLORS = ['#7c6af7', '#a78bfa', '#c4b5fd', '#e879f9', '#38bdf8', '#34d399', '#fb923c']

export function WordCloudChart({ words, width = 500, height = 300 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return

    const svg = svgRef.current
    svg.innerHTML = ''

    const maxVal = Math.max(...words.map(w => w.value), 1)
    const minVal = Math.min(...words.map(w => w.value), 1)
    const range = maxVal - minVal || 1

    const sized = words.slice(0, 80).map(w => ({
      text: w.text,
      size: 12 + ((w.value - minVal) / range) * 38,
      value: w.value,
    }))

    cloud()
      .size([width, height])
      .words(sized)
      .padding(4)
      .rotate(() => (Math.random() > 0.7 ? 90 : 0))
      .font('system-ui')
      .fontSize(d => (d as { size: number }).size)
      .on('end', (drawn) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('transform', `translate(${width / 2},${height / 2})`)

        drawn.forEach((d, i) => {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          text.setAttribute('text-anchor', 'middle')
          text.setAttribute('font-size', `${d.size}px`)
          text.setAttribute('font-family', 'system-ui, sans-serif')
          text.setAttribute('fill', COLORS[i % COLORS.length])
          text.setAttribute('transform', `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          text.setAttribute('opacity', '0.9')
          text.textContent = d.text ?? ''
          g.appendChild(text)
        })

        svg.appendChild(g)
      })
      .start()
  }, [words, width, height])

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-40"
        style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        Not enough text to generate a word cloud.
      </div>
    )
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ width: '100%', height: 'auto', maxHeight: height }}
    />
  )
}
