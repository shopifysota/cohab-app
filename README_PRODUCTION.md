# Cohabitation Agreement Generator

A modern, AI-powered tool to help couples create a cohabitation agreement quickly and easily. Generate a professional legal template, customize it, and export as text, Word, or PDF.

## Features

- **Guided Questionnaire**: Step-by-step wizard to collect all necessary information
- **AI-Generated Agreements**: Uses OpenAI to enhance and refine the agreement
- **Multiple Export Formats**: Download as TXT, DOCX, or PDF
- **Legal Disclaimers**: Clear reminders that this is a template, not legal advice
- **Production-Ready**: Fully functional API routes, error handling, and environment configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone this repository or copy the project files:
```bash
git clone <repository-url>
cd cohab-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk_...your_key_here...
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build for production:
```bash
npm run build
npm start
```

## How It Works

1. **User fills out questionnaire**: Partners' names, address, financial arrangements, property, debts, pets, etc.
2. **AI enhancement** (optional): Click "Generate" to use OpenAI to refine the agreement with professional legal language
3. **Download**: Export the agreement in your preferred format (TXT, DOCX, or PDF)
4. **Legal review**: User should have a lawyer review before signing

## API Routes

### POST /api/generate

Generates an AI-enhanced cohabitation agreement based on form data.

**Request body:**
```json
{
  "form": {
    "partnerOne": "John Doe",
    "partnerTwo": "Jane Smith",
    "address": "123 Main St",
    ...all form fields
  }
}
```

**Response:**
```json
{
  "agreement": "COHABITATION AGREEMENT\n\n..."
}
```

### POST /api/export-docx

Converts agreement text to a formatted DOCX file.

**Request body:**
```json
{
  "agreement": "COHABITATION AGREEMENT\n\n..."
}
```

**Response:** Binary DOCX file (application/vnd.openxmlformats-officedocument.wordprocessingml.document)

### POST /api/export-pdf

Converts agreement text to a PDF file using Puppeteer.

**Request body:**
```json
{
  "agreement": "COHABITATION AGREEMENT\n\n..."
}
```

**Response:** Binary PDF file (application/pdf)

## Environment Variables

- `OPENAI_API_KEY` (required): Your OpenAI API key for generating enhanced agreements

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable `OPENAI_API_KEY` in Vercel project settings
4. Deploy

### Other Platforms

Ensure your hosting platform supports:
- Node.js 18+
- Long-running processes (for Puppeteer PDF generation)
- Environment variables

## Important Legal Notice

⚠️ **DISCLAIMER**: This tool generates a template cohabitation agreement. It is **NOT** a substitute for professional legal advice. 

- Laws vary significantly by jurisdiction
- This template may not be legally binding in all locations
- Both parties should have an attorney review the agreement
- Do not sign without understanding the implications
- Consider local regulations before using this agreement

## Components & Stack

- **Framework**: Next.js 16 with TypeScript
- **UI Components**: shadcn/ui with Radix
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-4o-mini)
- **Document Generation**: 
  - DOCX: docx library
  - PDF: Puppeteer with Chromium
- **Deployment Target**: Vercel

## Troubleshooting

### "OPENAI_API_KEY is not configured"
- Make sure you've created `.env.local` with your API key
- Restart the development server after adding the key

### PDF export fails
- Ensure Puppeteer dependencies are installed: `npm install puppeteer`
- On Linux, may need additional system dependencies for Chromium

### Large DOCX files or slow exports
- PDF generation with Puppeteer can take 5-10 seconds
- Consider implementing a job queue for production at scale

## License

[Add your license here]

## Support

For issues or questions, please open an issue in the repository.
