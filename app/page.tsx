import VideoGenerator from './components/VideoGenerator';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Video Creator</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Transform your images into animated videos using AI
        </p>
      </header>
      <VideoGenerator />
    </div>
  );
}
