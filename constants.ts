
import type { UpscaleOption } from './types';

export const UPSCALE_OPTIONS: UpscaleOption[] = [
  {
    id: '2K',
    name: '2K',
    description: 'Good quality (2048px)',
    promptDetail: 'Upscale this image to a crisp 2K resolution (2048px on the longest side). Enhance details, remove noise, and improve overall clarity while preserving the original character of the image.',
  },
  {
    id: '4K',
    name: '4K',
    description: 'High quality (4096px)',
    promptDetail: 'Upscale this image to a high-quality 4K resolution (4096px on the longest side). Focus on photorealistic details, sharpening important features, and creating a very high-fidelity result.',
  },
  {
    id: '8K',
    name: '8K',
    description: 'Ultra quality (7680px)',
    promptDetail: 'Upscale this image to an ultra-high 8K resolution (7680px on the longest side). Reconstruct fine textures and details to the maximum possible level, aiming for a stunning, professional-grade result suitable for large prints.',
  },
];
