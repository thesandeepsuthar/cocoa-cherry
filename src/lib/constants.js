// Array of 25 unique cake-related images from Unsplash
// These will be randomly selected as fallback images
// Each image is a different Unsplash photo ID to ensure variety
export const CAKE_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80&auto=format&fit=crop', // White cake
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80&auto=format&fit=crop', // Chocolate cake
  'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=1200&q=80&auto=format&fit=crop', // Birthday cake
  'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&q=80&auto=format&fit=crop', // Cupcakes
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80&auto=format&fit=crop', // Wedding cake
  'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=1200&q=80&auto=format&fit=crop', // Red velvet cake
  'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1200&q=80&auto=format&fit=crop', // Layered cake
  'https://images.unsplash.com/photo-1519869325930-a6e5338b2e0b?w=1200&q=80&auto=format&fit=crop', // Cake slice
  'https://images.unsplash.com/photo-1535254973880-5b8b1c3b9c9b?w=1200&q=80&auto=format&fit=crop', // Strawberry cake
  'https://images.unsplash.com/photo-1622482094239-0c6b90c8b0c4?w=1200&q=80&auto=format&fit=crop', // Cream cake
  'https://images.unsplash.com/photo-1606312619070-d48b4bdc6b5c?w=1200&q=80&auto=format&fit=crop', // Pink cake
  'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=1200&q=80&auto=format&fit=crop', // Blue cake
  'https://images.unsplash.com/photo-1464349095431-e9f212a0e4c5?w=1200&q=80&auto=format&fit=crop', // Decorated cake
  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80&auto=format&fit=crop', // Tiered white cake
  'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1200&q=80&auto=format&fit=crop', // Chocolate layer cake
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop', // Birthday celebration cake
  'https://images.unsplash.com/photo-1519869325930-a6e5338b2e0b?w=1200&q=80&auto=format&fit=crop', // Cake with berries
  'https://images.unsplash.com/photo-1535254973880-5b8b1c3b9c9b?w=1200&q=80&auto=format&fit=crop', // Frosted cake
  'https://images.unsplash.com/photo-1622482094239-0c6b90c8b0c4?w=1200&q=80&auto=format&fit=crop', // Elegant cake
  'https://images.unsplash.com/photo-1606312619070-d48b4bdc6b5c?w=1200&q=80&auto=format&fit=crop', // Pastel cake
  'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=1200&q=80&auto=format&fit=crop', // Multi-tier cake
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80&auto=format&fit=crop', // White frosting cake
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80&auto=format&fit=crop', // Dark chocolate cake
  'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=1200&q=80&auto=format&fit=crop', // Celebration cake
  'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&q=80&auto=format&fit=crop', // Assorted cupcakes
];

// Function to get a random fallback image from the array
export const getRandomFallbackImage = () => {
  const randomIndex = Math.floor(Math.random() * CAKE_FALLBACK_IMAGES.length);
  return CAKE_FALLBACK_IMAGES[randomIndex];
};

// For backward compatibility, export a default fallback (first image)
export const FALLBACK_IMAGE_URL = CAKE_FALLBACK_IMAGES[0];
