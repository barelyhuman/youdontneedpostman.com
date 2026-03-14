interface ToolCardProps {
  name: string
  tagline: string
  description: string
  badges: string[]
  ctaLabel: string
  ctaHref: string
  accentColor: string
  logo?: string
  featured?: boolean
}

export function ToolCard({ name, tagline, description, badges, ctaLabel, ctaHref, accentColor, logo, featured }: ToolCardProps) {
  const safeColor = /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#000000';
  return (
    <div class={`tool-card${featured ? ' featured' : ''}`} style={`--tool-accent: ${safeColor}`}>
      <div class="tool-card-header">
        {logo && <img src={logo} alt={name} class="tool-logo" />}
        <div class="tool-card-title">
          <h3 class="tool-name">{name}</h3>
          <p class="tool-tagline">{tagline}</p>
        </div>
        {featured && <span class="tool-featured-badge">Top Pick</span>}
      </div>
      <p class="tool-description">{description}</p>
      <div class="tool-badges">
        {badges.map(badge => (
          <span key={badge} class="tool-badge">{badge}</span>
        ))}
      </div>
      <a href={ctaHref} class="btn-primary tool-cta" target="_blank" rel="noopener noreferrer">
        {ctaLabel}
      </a>
    </div>
  )
}
