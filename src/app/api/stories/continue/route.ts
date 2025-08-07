import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient, validateContentSafety } from '@/lib/ollama/client';
import { rateLimit } from '@/lib/middleware/rateLimit';

interface ContinueStoryRequest {
  previousStory: string;
  chosenOption: string;
  choiceIndex: number;
  ageGroup: '5-8' | '9-12' | '13-16';
  storyType: 'adventure' | 'mystery' | 'fantasy' | 'friendship' | 'educational';
  tone: 'exciting' | 'mysterious' | 'funny' | 'heartwarming' | 'educational';
  characters?: {
    name: string;
    description: string;
    role: 'protagonist' | 'sidekick' | 'mentor' | 'villain' | 'helper';
  }[];
  setting?: string;
  theme?: string;
  addMoreChoices?: boolean; // Whether to add more choice points
  targetWordCount?: number; // Default 200-300 words
}

interface ContinueStoryResponse {
  success: boolean;
  continuation?: string;
  choices?: {
    text: string;
    consequence: string;
  }[];
  metadata?: {
    wordCount: number;
    estimatedReadingTime: number;
    hasMoreChoices: boolean;
    safetyCheck: {
      safe: boolean;
      issues: string[];
    };
    generationTime: number;
  };
  error?: string;
}

// Templates for story continuation based on age group
const CONTINUATION_TEMPLATES = {
  '5-8': {
    base: `Continue this story for children aged 5-8. The story should be:
- Easy to understand with simple vocabulary
- About {targetWordCount} words long
- Keep the same tone: {tone}
- Safe and appropriate for young children
- Build naturally from the chosen action

Previous story context:
{previousStory}

The reader chose: "{chosenOption}"

{charactersText}
{settingText}
{themeText}
{moreChoicesText}

Continue the story from this choice:`,

    withChoices: `Continue this story for children aged 5-8 and add 2-3 new choice points. The story should be:
- Easy to understand with simple vocabulary
- About {targetWordCount} words long
- Keep the same tone: {tone}
- Safe and appropriate for young children
- Build naturally from the chosen action
- MUST end with "What do you choose?" followed by exactly 3 choices formatted as:
  A) [First choice]
  B) [Second choice]
  C) [Third choice]

Previous story context:
{previousStory}

The reader chose: "{chosenOption}"

{charactersText}
{settingText}
{themeText}

Continue the story from this choice. Write the continuation, then end with "What do you choose?" and provide exactly 3 choices marked as A), B), and C):`
  },
  
  '9-12': {
    base: `Continue this story for children aged 9-12. The story should be:
- Have age-appropriate vocabulary and complexity
- About {targetWordCount} words long
- Keep the same tone: {tone}
- Include character development and consequences
- Build naturally from the chosen action

Previous story context:
{previousStory}

The reader chose: "{chosenOption}"

{charactersText}
{settingText}
{themeText}
{moreChoicesText}

Continue the story from this choice:`,

    withChoices: `Continue this story for children aged 9-12 and add 2-3 new choice points. The story should be:
- Have age-appropriate vocabulary and complexity
- About {targetWordCount} words long
- Keep the same tone: {tone}
- Include character development and consequences
- Build naturally from the chosen action
- MUST end with "What do you choose?" followed by exactly 3 choices formatted as:
  A) [First choice]
  B) [Second choice] 
  C) [Third choice]

Previous story context:
{previousStory}

The reader chose: "{chosenOption}"

{charactersText}
{settingText}
{themeText}

Continue the story from this choice. Write the continuation, then end with "What do you choose?" and provide exactly 3 choices marked as A), B), and C):`
  },
  
  '13-16': {
    base: `Continue this story for teens aged 13-16. The story should be:
- Include sophisticated themes and character development
- About {targetWordCount} words long
- Keep the same tone: {tone}
- Feature realistic consequences and character growth
- Build naturally from the chosen action

Previous story context:
{previousStory}

The reader chose: "{chosenOption}"

{charactersText}
{settingText}
{themeText}
{moreChoicesText}

Continue the story from this choice:`,

    withChoices: `Continue this story for teens aged 13-16 and add 2-3 new choice points. The story should be:
- Include sophisticated themes and character development
- About {targetWordCount} words long
- Keep the same tone: {tone}
- Feature realistic consequences and character growth
- Build naturally from the chosen action
- MUST end with "What do you choose?" followed by exactly 3 choices formatted as:
  A) [First choice]
  B) [Second choice]
  C) [Third choice]

Previous story context:
{previousStory}

The reader chose: "{chosenOption}"

{charactersText}
{settingText}
{themeText}

Continue the story from this choice. Write the continuation, then end with "What do you choose?" and provide exactly 3 choices marked as A), B), and C):`
  }
};

// Helper function to build continuation prompt
function buildContinuationPrompt(request: ContinueStoryRequest): string {
  const templateKey = request.addMoreChoices ? 'withChoices' : 'base';
  const template = CONTINUATION_TEMPLATES[request.ageGroup][templateKey];
  
  const targetWordCount = request.targetWordCount || 250; // Default 250 words
  
  // Build character descriptions
  let charactersText = '';
  if (request.characters && request.characters.length > 0) {
    charactersText = 'Characters to keep consistent:\n' + request.characters.map(char => 
      `- ${char.name} (${char.role}): ${char.description}`
    ).join('\n') + '\n';
  }

  // Build setting and theme text
  const settingText = request.setting ? `Setting: ${request.setting}\n` : '';
  const themeText = request.theme ? `Theme: ${request.theme}\n` : '';
  const moreChoicesText = request.addMoreChoices ? 
    '\nIMPORTANT: End this continuation with new choice points for the reader.\n' : 
    '\nThis should be a complete story segment that flows from the chosen action.\n';

  return template
    .replace('{targetWordCount}', targetWordCount.toString())
    .replace('{tone}', request.tone)
    .replace('{previousStory}', request.previousStory)
    .replace('{chosenOption}', request.chosenOption)
    .replace('{charactersText}', charactersText)
    .replace('{settingText}', settingText)
    .replace('{themeText}', themeText)
    .replace('{moreChoicesText}', moreChoicesText);
}

// Helper function to extract choices from continuation
function extractChoicesFromContinuation(story: string): { text: string; consequence: string; }[] {
  const choices: { text: string; consequence: string; }[] = [];
  
  // Look for choice patterns like "A) Do something" - more comprehensive pattern
  const choicePattern = /([A-C])\)\s*([^\n\r]+?)(?=\s*[A-C]\)|$)/g;
  let match;
  
  while ((match = choicePattern.exec(story)) !== null) {
    const choiceText = match[2].trim();
    if (choiceText.length > 0) {
      choices.push({
        text: choiceText,
        consequence: "Continue the adventure based on your choice!"
      });
    }
  }
  
  // If no choices found with the pattern, try a simpler approach
  if (choices.length === 0) {
    const lines = story.split('\n');
    for (const line of lines) {
      const simpleMatch = line.match(/^([A-C])\)\s*(.+)$/);
      if (simpleMatch && simpleMatch[2].trim().length > 0) {
        choices.push({
          text: simpleMatch[2].trim(),
          consequence: "Continue the adventure based on your choice!"
        });
      }
    }
  }
  
  return choices.slice(0, 3); // Limit to 3 choices
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.' 
        },
        { status: 429 }
      );
    }

    // Parse request body
    let body: ContinueStoryRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.previousStory || !body.chosenOption || !body.ageGroup || !body.storyType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: previousStory, chosenOption, ageGroup, and storyType are required' 
        },
        { status: 400 }
      );
    }

    // Validate field values
    const validAgeGroups = ['5-8', '9-12', '13-16'];
    const validStoryTypes = ['adventure', 'mystery', 'fantasy', 'friendship', 'educational'];
    const validTones = ['exciting', 'mysterious', 'funny', 'heartwarming', 'educational'];

    if (!validAgeGroups.includes(body.ageGroup)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid age group. Must be one of: ${validAgeGroups.join(', ')}` 
        },
        { status: 400 }
      );
    }

    if (!validStoryTypes.includes(body.storyType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid story type. Must be one of: ${validStoryTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    if (body.tone && !validTones.includes(body.tone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid tone. Must be one of: ${validTones.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate word count
    if (body.targetWordCount && (body.targetWordCount < 150 || body.targetWordCount > 500)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Target word count must be between 150 and 500 words for continuations.' 
        },
        { status: 400 }
      );
    }

    // Check if Ollama is available
    const isConnected = await ollamaClient.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Story generation service is currently unavailable. Please try again later.' 
        },
        { status: 503 }
      );
    }

    // Build the continuation prompt
    const continuationPrompt = buildContinuationPrompt(body);

    // Set temperature based on story type and tone
    let temperature = 0.75; // Slightly higher for continuations to maintain creativity
    if (body.storyType === 'fantasy') temperature = 0.8;
    if (body.tone === 'funny') temperature = 0.85;
    if (body.tone === 'educational') temperature = 0.65;

    // Calculate max tokens based on target word count
    const maxTokens = Math.min((body.targetWordCount || 250) * 1.5, 1000);

    // Generate the story continuation
    const response = await ollamaClient.generate(continuationPrompt, {
      temperature,
      maxTokens,
    });

    if (!response.response) {
      throw new Error('Empty response from story generation service');
    }

    // Validate content safety
    const safetyCheck = validateContentSafety(response.response);
    if (!safetyCheck.safe) {
      console.warn('Generated story continuation failed safety check:', safetyCheck.issues);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Generated story continuation did not meet safety guidelines. Please try a different choice.' 
        },
        { status: 400 }
      );
    }

    // Extract choices if continuation should have more choices
    const choices = body.addMoreChoices ? extractChoicesFromContinuation(response.response) : undefined;

    // Calculate metadata
    const wordCount = response.response.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // 200 WPM average for children
    const generationTime = Date.now() - startTime;

    const result: ContinueStoryResponse = {
      success: true,
      continuation: response.response.trim(),
      choices,
      metadata: {
        wordCount,
        estimatedReadingTime,
        hasMoreChoices: body.addMoreChoices || false,
        safetyCheck,
        generationTime,
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Story continuation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Story continuation failed: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Story continuation API is operational',
    supportedFeatures: [
      'Choice-based story continuations',
      'Age-appropriate content generation',
      'Customizable word counts (150-500 words)',
      'Multiple tone support',
      'Character consistency',
      'Safety filtering'
    ]
  });
} 