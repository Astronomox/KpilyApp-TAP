import Image from "next/image";
import Link from "next/link";
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
          <Image
            src="/assets/logo.png"
            alt="KPILY"
            width={140}
            height={41}
            priority
          />
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
