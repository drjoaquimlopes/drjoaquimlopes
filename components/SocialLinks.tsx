import { site } from "@/lib/site";
import { Instagram, Facebook, WhatsApp } from "./icons";

type Props = {
  className?: string;
  linkClassName?: string;
  size?: number;
};

/** Instagram, Facebook e WhatsApp: reutilizado na nav, drawer e footer. */
export function SocialLinks({
  className = "",
  linkClassName = "",
  size = 20,
}: Props) {
  const dim = { width: size, height: size };
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={linkClassName}
      >
        <Instagram style={dim} />
      </a>
      <a
        href={site.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={linkClassName}
      >
        <Facebook style={dim} />
      </a>
      <a
        href={`https://wa.me/${site.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={linkClassName}
      >
        <WhatsApp style={dim} />
      </a>
    </div>
  );
}
