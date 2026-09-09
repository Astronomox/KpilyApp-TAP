import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import styles from "./AuthSplitLayout.module.css";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
  heroImageSrc: string;
  heroImageAlt: string;
};

export function AuthSplitLayout({
  children,
  heroImageSrc,
  heroImageAlt,
}: AuthSplitLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.formColumn}>
        <Link href="/" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </Link>
        <div className={styles.formContent}>{children}</div>
      </div>
      <div className={styles.heroColumn}>
        <Image
          src={heroImageSrc}
          alt={heroImageAlt}
          fill
          className={styles.heroImage}
          priority
        />
      </div>
    </div>
  );
}
