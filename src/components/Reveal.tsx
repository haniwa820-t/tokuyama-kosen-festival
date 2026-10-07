import { useEffect } from 'react'
export default function Reveal({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window) || media?.matches) return
    const selector =
      '.section-title, .theme-layout, .feature, .department, .related-grid>article, .campus-figure, .map-details, .access-layout, .parking-layout, .pamphlet-art, .pamphlet>div, .news-row, .social-links, .quick-links>a, .sponsor-card, .guide-card'
    const parts = Array.from(document.querySelectorAll<HTMLElement>(selector))
    // Reveal each information group once, without fading both parent and child.
    const targets = [
      ...parts,
      ...Array.from(document.querySelectorAll<HTMLElement>('.section')).filter(
        (section) => !section.querySelector(selector),
      ),
    ].filter(
      (element) =>
        !parts.some((parent) => parent !== element && parent.contains(element)),
    )
    const show = (element: HTMLElement) => {
      element.dataset.motion = 'visible'
      observer.unobserve(element)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target as HTMLElement)
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    )
    for (const element of targets) {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        const siblings = Array.from(
          element.parentElement?.children ?? [],
        ).filter((child) => targets.includes(child as HTMLElement))
        element.style.setProperty(
          '--reveal-delay',
          `${Math.min(siblings.indexOf(element) % 3, 2) * 55}ms`,
        )
        element.dataset.motion = 'pending'
        observer.observe(element)
      }
    }
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      const element = event.target.closest<HTMLElement>(
        '[data-motion="pending"]',
      )
      if (element) show(element)
    }
    const reduce = () => {
      if (media?.matches) {
        observer.disconnect()
        for (const element of targets) delete element.dataset.motion
      }
    }
    document.addEventListener('focusin', focus)
    media?.addEventListener?.('change', reduce)
    return () => {
      observer.disconnect()
      document.removeEventListener('focusin', focus)
      media?.removeEventListener?.('change', reduce)
      for (const element of targets) {
        delete element.dataset.motion
        element.style.removeProperty('--reveal-delay')
      }
    }
  }, [])
  return children
}
