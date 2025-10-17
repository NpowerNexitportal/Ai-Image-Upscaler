import { GoogleGenAI, Modality } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const upscaleImage = async (imageFile: File, prompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key is missing. Please provide a valid API key.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.data) {
      return part.inlineData.data;
    }
  }

  throw new Error("Failed to upscale image. No image data received from the API.");
};
