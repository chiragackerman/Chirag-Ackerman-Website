import logoImage from '../assets/images/chirag_official_logo.jpg';

export function resolveLogoUrl(logoUrl) {
  if (!logoUrl || logoUrl === '/chirag_official_logo.jpg' || logoUrl.startsWith('/src/assets/')) {
    return logoImage;
  }
  return logoUrl;
}