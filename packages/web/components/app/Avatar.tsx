// Profile picture, or the name's initial on a tinted disc.
export default function Avatar({ name, src, size = 40 }: { name?: string; src?: string | null; size?: number }) {
  return src
    ? <img className="kp-avatar" src={src} alt="" style={{ width: size, height: size }} />
    : <span className="kp-avatar" style={{ width: size, height: size, fontSize: Math.max(12, size * 0.28) }} aria-hidden="true">{(name || '?').trim().charAt(0).toUpperCase()}</span>
}
