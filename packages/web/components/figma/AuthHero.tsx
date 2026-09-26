// Right-hand art shared by the Log in, Sign Up and Register frames:
// green rounded panel, hero photo and the two floating reward cards.
export default function AuthHero({ variant = 'default' }: { variant?: 'default' | 'register' }) {
  return (
    <div className={`kp-hero kp-hero--${variant}`} aria-hidden="true">
      <div className="kp-hero__green" />
      <img className="kp-hero__photo" src="/figma/login/hero.png" alt="" />
      <div className="kp-points">
        <img className="kp-points__star" src="/figma/login/star.svg" alt="" />
        <small>Received</small>
        <strong>350</strong>
        <small>Points for<br />this task</small>
      </div>
      <div className="kp-received">
        <img src="/figma/login/avatar-jackline.png" alt="" />
        <div>
          <span className="kp-received__pill">+ 500 Points</span>
          <div className="kp-received__from">Received from Jackline</div>
        </div>
      </div>
    </div>
  )
}
