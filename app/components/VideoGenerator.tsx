'use client';

import { useState, useEffect, useRef } from 'react';
import { fal } from '@fal-ai/client';

// Configure fal client to use the proxy
fal.config({
  proxyUrl: "/api/fal/proxy",
});

type QueueStatus = {
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  logs?: Array<{ message: string }>;
  request_id: string;
};

type VideoResponse = {
  data: {
    video: {
      url: string;
    };
  };
};

export default function VideoGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const pollingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setError(null);
    }
  };

  const fetchResult = async (id: string): Promise<VideoResponse> => {
    return fal.queue.result('fal-ai/veo2/image-to-video', {
      requestId: id,
    });
  };

  const checkStatus = async (id: string) => {
    try {
      console.log('Checking status for request:', id);
      const status = await fal.queue.status('fal-ai/veo2/image-to-video', {
        requestId: id,
        logs: true,
      }) as QueueStatus;

      console.log('Received status:', status);

      if (status.status === 'COMPLETED') {
        console.log('Generation completed, fetching result...');
        try {
          const response = await fetchResult(id);
          console.log('Received result:', response);
          
          if (response.data?.video?.url) {
            setVideoUrl(response.data.video.url);
            setIsGenerating(false);
            setProgress('Video generation completed!');
          } else {
            console.error('No video URL in result:', response);
            setError('Video generation completed but no video URL was returned');
            setIsGenerating(false);
            setProgress('');
          }
        } catch (err) {
          console.error('Error fetching result:', err);
          setError('Failed to fetch video data');
          setIsGenerating(false);
          setProgress('');
        }
      } else if (status.status === 'FAILED') {
        console.error('Generation failed:', status);
        setError('Video generation failed');
        setIsGenerating(false);
        setProgress('');
      } else if (status.status === 'IN_PROGRESS' || status.status === 'IN_QUEUE') {
        const lastLog = status.logs?.[status.logs.length - 1]?.message;
        console.log('Still processing, last log:', lastLog);
        setProgress(lastLog || 'Processing...');
        // Check again in 5 seconds
        pollingTimeoutRef.current = setTimeout(() => checkStatus(id), 5000);
      } else {
        console.error('Unknown status:', status.status);
        setError('Received unknown status from server');
        setIsGenerating(false);
        setProgress('');
      }
    } catch (err) {
      console.error('Error checking status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check status');
      setIsGenerating(false);
      setProgress('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !prompt) {
      setError('Please provide both an image and a prompt');
      return;
    }

    // Clear any existing polling
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    setIsGenerating(true);
    setError(null);
    setProgress('Uploading image...');

    try {
      // Upload the image first
      const imageUrl = await fal.storage.upload(image);
      setProgress('Starting video generation...');

      // Submit to queue
      const { request_id } = await fal.queue.submit('fal-ai/veo2/image-to-video', {
        input: {
          prompt,
          image_url: imageUrl,
          aspect_ratio: '16:9',
          duration: '5s'
        }
      });

      console.log('Submitted request with ID:', request_id);
      // Start checking status
      checkStatus(request_id);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate video');
      setIsGenerating(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md"
            disabled={isGenerating}
          />
          {image && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {image.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Animation Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want the image to be animated..."
            className="w-full p-2 border rounded-md h-32"
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !image || !prompt}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isGenerating || !image || !prompt
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isGenerating ? 'Generating Video...' : 'Generate Video'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {progress && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
          {progress}
        </div>
      )}

      {videoUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Generated Video</h3>
          <video
            controls
            className="w-full rounded-lg"
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
} 
