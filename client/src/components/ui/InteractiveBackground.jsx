import { useRef, useEffect } from 'react'

export default function InteractiveBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, raf
    let nodes = []
    let mouse = { x: -1000, y: -1000 } // Initially offscreen

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
      // Scale node count by screen size gracefully
      const baseNodeCount = Math.min(Math.floor((W * H) / 16000), 90)
      
      // Preserve existing nodes if resizing, add/remove as needed
      if (nodes.length !== baseNodeCount) {
        nodes = Array.from({ length: baseNodeCount }, () => ({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.6, 
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1,
        }))
      }
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    
    const onMouseOut = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      
      for (let i = 0; i < nodes.length; i++) {
        // Node physics
        nodes[i].x += nodes[i].vx
        nodes[i].y += nodes[i].vy
        
        // Bounce off walls
        if (nodes[i].x < 0 || nodes[i].x > W) nodes[i].vx *= -1
        if (nodes[i].y < 0 || nodes[i].y > H) nodes[i].vy *= -1
        
        // Draw physical node
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.4)'
        ctx.fill()
        
        // 1. Draw connections to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          
          if (d < 160) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - d / 160) * 0.2})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
        
        // 2. Draw connections to MOUSE Cursor (INTERACTIVITY)
        const dxM = nodes[i].x - mouse.x
        const dyM = nodes[i].y - mouse.y
        const dM = Math.sqrt(dxM * dxM + dyM * dyM)
        
        if (dM < 220) { // Hover radius
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          
          // The line glows purple towards the mouse cursor
          const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, mouse.x, mouse.y)
          gradient.addColorStop(0, `rgba(0, 212, 255, ${(1 - dM / 220) * 0.4})`)
          gradient.addColorStop(1, `rgba(124, 58, 237, ${(1 - dM / 220) * 0.9})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.stroke()
          
          // Subtle magnetic attraction force to the mouse
          nodes[i].vx -= (dxM / dM) * 0.04
          nodes[i].vy -= (dyM / dM) * 0.04
        }
        
        // Apply friction/terminal velocity so nodes don't shoot out infinitely
        const speed = Math.sqrt(nodes[i].vx**2 + nodes[i].vy**2)
        if (speed > 1.2) {
          nodes[i].vx = (nodes[i].vx / speed) * 1.2
          nodes[i].vy = (nodes[i].vy / speed) * 1.2
        }
      }
      
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseout', onMouseOut)
    
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <canvas 
      ref={ref} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 0, // Put it behind EVERYTHING
        opacity: 0.8, // Slightly more vibrant
        pointerEvents: 'none' // Don't block clicks from getting to buttons!
      }} 
    />
  )
}
