const DESTINATION_IMAGES = [
  'arunachal', 'desert', 'jungle', 'kashmir', 'kedarnath',
  'kerala', 'meghalaya', 'mountain', 'ocean', 'sikkim',
  'spiti', 'varanasi', 'vrindavan', 'zanskar'
];

/**
 * Returns a corresponding image path for a given destination name.
 * Performs a case-insensitive partial match against known images.
 * Falls back to 'mountain.webp' if no match is found.
 */
export function getDestinationImage(destinationName: string): string {
  if (!destinationName) return '/images/mountain.webp';
  
  const normalizedName = destinationName.toLowerCase();
  
  for (const image of DESTINATION_IMAGES) {
    if (normalizedName.includes(image)) {
      return `/images/${image}.webp`;
    }
  }
  
  return '/images/mountain.webp';
}
