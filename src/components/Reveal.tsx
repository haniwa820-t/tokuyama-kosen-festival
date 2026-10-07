import { useEffect } from 'react'
export default function Reveal({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
      return
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.section, .quick-links>a, .sponsor-card, .guide-card',
      ),
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.motion = 'visible'
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08 },
    )
    for (const element of targets) {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.dataset.motion = 'pending'
        observer.observe(element)
      }
    }
    return () => {
      observer.disconnect()
      for (const element of targets) delete element.dataset.motion
    }
  }, [])
  return children
}
