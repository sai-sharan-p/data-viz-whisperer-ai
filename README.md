
# Data Analytics Assistant

A React-based data analytics application that helps users analyze and visualize their data through an interactive chat interface.

## Features

- File upload support for CSV and Excel data
- Data table display with pagination
- Interactive visualizations (bar charts, line charts, pie charts, scatter plots, etc.)
- AI-powered chat interface for querying and analyzing data
- Responsive design

## Deployment Instructions

### Option 1: Deploy to Vercel

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Push your code to a GitHub repository
3. Import your project in Vercel
4. Configure environment variables:
   - `VITE_LLM_API_KEY` - Your LLM API key (e.g., OpenAI, Anthropic, etc.)
   - `VITE_LLM_API_ENDPOINT` - Your LLM API endpoint

### Option 2: Deploy to Netlify

1. Create a [Netlify account](https://app.netlify.com/signup) if you don't have one
2. Push your code to a GitHub repository
3. Import your project in Netlify
4. Configure environment variables in Netlify settings:
   - `VITE_LLM_API_KEY` - Your LLM API key
   - `VITE_LLM_API_ENDPOINT` - Your LLM API endpoint

### Option 3: Self-hosting

1. Build the application:
   ```bash
   npm run build
   ```
2. Host the generated `dist` folder on any static hosting service or server
3. Set environment variables in your hosting environment

## Integrating an LLM API

To connect the chat feature to an LLM API (like OpenAI, Anthropic, or others):

1. Open `src/utils/llmService.ts`
2. Locate the `chatWithLLM` function
3. Replace the mock implementation with your actual API call
4. Use the commented example as a guide
5. Make sure to set your API key in your deployment environment

Example integration:

```typescript
// In src/utils/llmService.ts
export const chatWithLLM = async (
  userMessage: string,
  processedData: ProcessedData,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<LLMChatResponse> => {
  try {
    const response = await fetch(import.meta.env.VITE_LLM_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_LLM_API_KEY}`
      },
      body: JSON.stringify({
        message: userMessage,
        datasetSummary: {
          headers: processedData.headers,
          rowCount: processedData.summary.rowCount,
          numericColumns: processedData.summary.numericColumns,
          categoricalColumns: processedData.summary.categoricalColumns,
          sample: processedData.data.slice(0, 5) // Send sample data
        },
        chatHistory: chatHistory
      } as LLMChatRequest)
    });
    
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }
    
    return await response.json() as LLMChatResponse;
  } catch (error) {
    console.error("Error calling LLM API:", error);
    return {
      message: "Sorry, I had trouble processing your request. Please try again."
    };
  }
};
```

## Customizing the LLM Integration

You can customize the LLM integration based on the specific API you're using. The current implementation is designed to work with most LLM APIs but may need adjustments for specific providers.

For best results, you'll want to tailor the prompt and response handling to your specific use case and LLM provider.
