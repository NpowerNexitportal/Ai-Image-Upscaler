
export type UpscaleFactor = '2K' | '4K' | '8K';

export interface UpscaleOption {
  id: UpscaleFactor;
  name: string;
  description: string;
  promptDetail: string;
}
