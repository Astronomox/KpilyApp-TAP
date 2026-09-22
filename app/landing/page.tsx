'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <nav>
        <Link href="/">
          <img src="/assets/logo-full.png" alt="KPILY" />
        </Link>
        <ul>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/register">Register</Link></li>
        </ul>
      </nav>
      <h1>Welcome to KPILY</h1>
    </div>
  );
}