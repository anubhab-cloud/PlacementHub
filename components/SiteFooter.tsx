import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

const footerLinks = [
  ['FAQ', '#faq'],
  ['Contact Us', '#contact'],
  ['Privacy', '#privacy'],
  ['Timeline', '/placement'],
  ['Terms', '#terms'],
  ['Refund Policy', '#refund-policy'],
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer-links" aria-label="Footer">
        {footerLinks.map(([label, href]) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </nav>
      <div className="site-footer-socials" aria-label="Social media">
        <span role="img" aria-label="LinkedIn"><FaLinkedinIn /></span>
        <span role="img" aria-label="X"><FaXTwitter /></span>
        <span role="img" aria-label="Instagram"><FaInstagram /></span>
      </div>
      <p className="site-footer-copyright">© 2026 PlacementHub. All rights reserved.</p>
    </footer>
  );
}
