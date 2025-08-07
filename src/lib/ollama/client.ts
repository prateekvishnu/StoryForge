interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaStreamResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    num_ctx?: number;
  };
}

export class OllamaClient {
  private baseUrl: string;
  private defaultModel: string;
  private requestPool: Set<AbortController>;
  private maxConcurrentRequests: number;
  private activeRequests: number;

  constructor(baseUrl: string = 'http://localhost:11434', defaultModel: string = 'deepseek-r1:1.5b') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultModel = defaultModel;
    this.requestPool = new Set();
    this.maxConcurrentRequests = 5;
    this.activeRequests = 0;
  }

  /**
   * Test connection to Ollama server
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models from Ollama
   */
  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Failed to get models:', error);
      throw new Error('Unable to connect to Ollama server');
    }
  }

  /**
   * Generate text using Ollama with connection pooling
   */
  async generate(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<OllamaResponse> {
    // Check if we've exceeded max concurrent requests
    if (this.activeRequests >= this.maxConcurrentRequests) {
      throw new Error('Maximum concurrent requests exceeded. Please try again later.');
    }

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 4000) {
      throw new Error('Prompt too long. Maximum 4000 characters allowed.');
    }

    const controller = new AbortController();
    this.requestPool.add(controller);
    this.activeRequests++;

    try {
      const request: OllamaRequest = {
        model: options.model || this.defaultModel,
        prompt: prompt.trim(),
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: 0.9,
          top_k: 40,
          repeat_penalty: 1.1,
          num_ctx: options.maxTokens || 2048,
        },
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
      }

      const data: OllamaResponse = await response.json();
      
      // Validate response
      if (!data.response) {
        throw new Error('Invalid response from Ollama');
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      console.error('Ollama generation error:', error);
      throw error;
    } finally {
      this.requestPool.delete(controller);
      this.activeRequests--;
    }
  }

  /**
   * Generate streaming text using Ollama
   */
  async generateStream(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<ReadableStream<OllamaStreamResponse>> {
    // Check concurrent requests
    if (this.activeRequests >= this.maxConcurrentRequests) {
      throw new Error('Maximum concurrent requests exceeded. Please try again later.');
    }

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    const controller = new AbortController();
    this.requestPool.add(controller);
    this.activeRequests++;

    const request: OllamaRequest = {
      model: options.model || this.defaultModel,
      prompt: prompt.trim(),
      stream: true,
      options: {
        temperature: options.temperature || 0.7,
        top_p: 0.9,
        top_k: 40,
        repeat_penalty: 1.1,
        num_ctx: options.maxTokens || 2048,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const stream = new ReadableStream({
        start(controller) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          function pump(): Promise<void> {
            return reader!.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n').filter(line => line.trim());

              for (const line of lines) {
                try {
                  const data: OllamaStreamResponse = JSON.parse(line);
                  controller.enqueue(data);
                } catch (e) {
                  // Skip invalid JSON lines
                }
              }

              return pump();
            });
          }

          return pump();
        },
      });

      return stream;
    } catch (error) {
      this.requestPool.delete(controller);
      this.activeRequests--;
      throw error;
    }
  }

  /**
   * Cancel all active requests
   */
  cancelAllRequests(): void {
    this.requestPool.forEach(controller => {
      controller.abort();
    });
    this.requestPool.clear();
    this.activeRequests = 0;
  }

  /**
   * Get current server status
   */
  async getStatus(): Promise<{
    connected: boolean;
    models: string[];
    activeRequests: number;
    maxConcurrentRequests: number;
  }> {
    const connected = await this.testConnection();
    let models: string[] = [];
    
    if (connected) {
      try {
        models = await this.getModels();
      } catch (error) {
        console.error('Failed to get models for status:', error);
      }
    }

    return {
      connected,
      models,
      activeRequests: this.activeRequests,
      maxConcurrentRequests: this.maxConcurrentRequests,
    };
  }
}

// Singleton instance
export const ollamaClient = new OllamaClient();

// Helper function to validate content safety (optimized for children's stories)
export function validateContentSafety(text: string): {
  safe: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const lowercaseText = text.toLowerCase();
  
  // More refined content safety checks for children's content
  // Only flag truly inappropriate content, not common adventure/fantasy elements
  const inappropriateWords = [
    'murder', 'suicide', 'torture', 'abuse', 'rape', 'drug', 'alcohol',
    'hate speech', 'racist', 'sexist', 'explicit', 'pornographic',
    'violent death', 'graphic violence', 'blood and gore'
  ];

  // Allow common story elements that might be flagged but are actually appropriate
  const allowedElements = [
    'adventure', 'mystery', 'magic', 'dragon', 'monster', 'ghost',
    'scary moments', 'challenge', 'danger', 'rescue', 'hero', 'villain'
  ];

  for (const word of inappropriateWords) {
    if (lowercaseText.includes(word)) {
      issues.push(`Contains inappropriate content: ${word}`);
    }
  }

  // Check for excessive length (stories should be reasonable for children)
  if (text.length > 10000) {
    issues.push('Story is too long for target age group');
  }

  // Check for minimal content
  if (text.length < 30) {
    issues.push('Story is too short to be meaningful');
  }

  // Check for excessive repetition (might indicate generation issues)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  if (sentences.length > 0) {
    const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
    const repetitionRatio = uniqueSentences.size / sentences.length;
    if (repetitionRatio < 0.7) {
      issues.push('Story contains excessive repetition');
    }
  }

  return {
    safe: issues.length === 0,
    issues,
  };
} 