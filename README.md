# AI Video Generator

A Next.js application that demonstrates the power of the [fal.ai](https://fal.ai) SDK for AI-powered video generation. This project showcases how to use fal's queue management system and proxy setup to create animated videos from static images.

> fal.ai is a serverless platform for running AI models at scale.

## Features

- Upload static images and animate them using AI
- Real-time progress tracking and status updates
- Queue management for handling long-running video generation tasks
- Secure proxy setup for fal.ai API calls
- Modern, responsive UI built with Next.js and Tailwind CSS

## Technology Stack

- [Next.js](https://nextjs.org) - React framework for production
- [fal.ai SDK](https://fal.ai) - AI model deployment and inference platform
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Update the `FAL_KEY` in `.env.local` with your fal.ai API key

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/components/VideoGenerator.tsx` - Main component handling video generation
- `app/api/fal/proxy/route.ts` - API route for proxying fal.ai requests
- `app/page.tsx` - Main page component

## How It Works

1. **Image Upload**: Users can upload a static image through the web interface
2. **Prompt Input**: Users provide a text prompt describing how they want the image to be animated
3. **Queue Management**: The application uses fal.ai's queue system to handle video generation:
   - Submits the generation task to the queue
   - Polls for status updates
   - Retrieves the final video when complete
4. **Proxy Setup**: All fal.ai API calls are proxied through a secure API route to protect API keys

## API Routes

The project includes a proxy route (`/api/fal/proxy`) that securely forwards requests to fal.ai, keeping your API keys private on the server side.

## Learn More

- [fal.ai Documentation](https://docs.fal.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
