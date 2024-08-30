import { useState, useEffect } from "react";

const useImage = (seed: string, prompt: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/image/${seed}/${prompt}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const imageUrl = await response.text();
        setImageUrl(imageUrl);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [seed, prompt]);

  return { imageUrl, loading, error };
};

export default useImage;
