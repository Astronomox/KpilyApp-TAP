import { at } from '@/lib/fig'

// "Social" group from the success frames: circles at (525,755), icons inside.
export default function FigSocial() {
  const icons: [string, string, number][] = [
    ['Twitter', 'twitter', 535], ['Facebook', 'facebook', 627], ['Instagram', 'instagram', 719], ['LinkedIn', 'linkedin', 811], ['YouTube', 'youtube', 903],
  ]
  return (
    <>
      <img src="/figma/social/circles.svg" alt="" style={at(525, 755, 413, 45)} />
      {icons.map(([name, icon, left]) => (
        <a key={icon} href={`https://${icon}.com`} target="_blank" rel="noreferrer" aria-label={name} style={at(left - 10, 755, 45, 45, { display: 'grid', placeItems: 'center', borderRadius: '50%' })}>
          <img src={`/figma/social/${icon}.svg`} alt="" style={{ width: 25, height: 25 }} />
        </a>
      ))}
    </>
  )
}
