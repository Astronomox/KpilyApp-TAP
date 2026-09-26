import { at, pop } from '@/lib/fig'

type Box = [number, number, number, number]

// Green panel + hero photo + "350 points" and "+500 Points" cards, placed with
// the exact frame coordinates of each Figma auth frame.
export default function FigHero({
  green, photo, points, received, solid = false,
}: { green?: [number, number]; photo?: Box; points: [number, number]; received: [number, number]; solid?: boolean }) {
  const [px, py] = points
  const [rx, ry] = received
  const cx = px + 86.12 // centre of the points card text column
  return (
    <div aria-hidden="true">
      {green && <img src="/figma/login/green-panel.svg" alt="" style={at(green[0], green[1], 456, 1121)} />}
      {photo && <img src="/figma/login/hero.png" alt="" style={at(photo[0], photo[1], photo[2], photo[3], { objectFit: 'cover' })} />}
      <div style={at(px, py + 16.76, 173, 187.235, { background: '#468eb8', borderRadius: 10 })} />
      <p style={at(cx - 77.1, py + 48.39, 154.196, 19.441, pop(700, 9.835, 'normal', '#f9fffd', { textAlign: 'center', letterSpacing: 0.4917 }))}>Received</p>
      <p style={at(cx - 77.1, py + 70.71, 154.196, 56.956, pop(700, 37.372, 'normal', '#f9fffd', { textAlign: 'center', letterSpacing: 1.8686 }))}>350</p>
      <p style={at(cx - 77.1, py + 142.68, 154.196, 19.441, pop(700, 9.835, 'normal', '#f9fffd', { textAlign: 'center', letterSpacing: 0.4917 }))}>Points for<br />this task</p>
      <img src="/figma/login/star.svg" alt="" style={at(px + 65.11, py + 2.88, 41.6, 36.2 * 1.024)} />
      <div style={at(rx, ry, 286, 85, {
        borderRadius: 10, background: solid ? '#fff' : 'rgba(255,255,255,.8)', backdropFilter: 'blur(32px)',
        boxShadow: '0 110.121px 88.097px rgba(0,0,0,.03),0 71.375px 51.594px rgba(0,0,0,.02),0 42.417px 28.061px rgba(0,0,0,.02),0 22.024px 14.316px rgba(0,0,0,.01),0 8.973px 7.178px rgba(0,0,0,.01),0 2.039px 3.467px rgba(0,0,0,.01)',
      })} />
      <div style={at(rx + 87, ry + 16, 113, 26, { background: '#166448', opacity: 0.1, borderRadius: 30 })} />
      <p style={at(rx + 98, ry + 19, undefined, undefined, pop(600, 14, 'normal', '#166448', { letterSpacing: 0.25, whiteSpace: 'nowrap' }))}>+ 500 Points</p>
      <p style={at(rx + 87, ry + 46, undefined, undefined, { fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 14, lineHeight: '30px', letterSpacing: -0.28, color: '#909090', whiteSpace: 'nowrap', margin: 0 })}>Received from Jackline</p>
      <img src="/figma/login/avatar-jackline.png" alt="" style={at(rx + 15, ry + 20, 57, 51)} />
    </div>
  )
}
