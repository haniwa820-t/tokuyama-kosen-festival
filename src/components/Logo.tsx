import { assetUrl } from '../lib/catalog'

export default function Logo({
  className,
  alt = '徳山高専 高専祭 メインロゴ',
}: {
  className?: string
  alt?: string
}) {
  return (
    <img
      className={className}
      src={assetUrl('images/echo-logo.webp')}
      alt={alt}
      width="1168"
      height="626"
    />
  )
}
