// Mapping of social network names to local icon files
const LOCAL_ICONS: Record<string, string> = {
  linkedin: "/social-icons/linkedin.svg",
  github: "/social-icons/github.svg",
};

/**
 * Get the appropriate icon URL for a social network
 * Uses local icons when available, falls back to SimpleIcons CDN
 */
export function getSocialIconUrl(iconName: string): string {
  // Check if we have a local icon for this network
  const localIcon = LOCAL_ICONS[iconName.toLowerCase()];
  if (localIcon) {
    return localIcon;
  }
  
  // Fall back to SimpleIcons CDN for other icons
  return `https://cdn.simpleicons.org/${iconName}`;
}