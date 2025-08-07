import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient, validateContentSafety } from '@/lib/ollama/client';
import { rateLimit } from '@/lib/middleware/rateLimit';

// Updated types for enhanced request/response
interface GenerateStoryRequest {
  prompt: string;
  ageGroup: '5-8' | '9-12' | '13-16';
  storyType: 'adventure' | 'mystery' | 'fantasy' | 'friendship' | 'educational';
  length: 'short' | 'medium' | 'long';
  
  // New customization options
  characters?: {
    name: string;
    description: string;
    role: 'protagonist' | 'sidekick' | 'mentor' | 'villain' | 'helper';
  }[];
  setting?: string;
  theme?: string;
  tone?: 'exciting' | 'mysterious' | 'funny' | 'heartwarming' | 'educational';
  wordLimit?: number;
  customInstructions?: string;
  
  // Choose-your-adventure options
  isInteractive?: boolean;
  choicePoints?: number; // Number of decision points in the story
}

interface GenerateStoryResponse {
  success: boolean;
  story?: string;
  title?: string;
  choices?: {
    text: string;
    consequence: string;
  }[];
  metadata?: {
    wordCount: number;
    estimatedReadingTime: number;
    safetyCheck: {
      safe: boolean;
      issues: string[];
    };
    generationTime: number;
    isInteractive: boolean;
  };
  error?: string;
}

// Enhanced story prompt templates with customization support
const ENHANCED_STORY_TEMPLATES = {
  '5-8': {
    adventure: `Write a fun, simple adventure story for children aged 5-8. The story should be:
- Easy to understand with simple vocabulary
- Positive and encouraging
- About {wordLimit} words long
- Include friendship and problem-solving
- Have a happy ending
- Safe and appropriate for young children
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{themeText}
{customInstructionsText}
{interactiveText}

Story:`,
    
    mystery: `Write a gentle mystery story for children aged 5-8. The story should be:
- Simple mystery that's not scary
- Easy vocabulary and short sentences
- About {wordLimit} words long
- Include clues that children can follow
- Have a satisfying solution
- Focus on curiosity and discovery
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,
    
    fantasy: `Write a magical fantasy story for children aged 5-8. The story should be:
- Include friendly magic and wonder
- Simple vocabulary appropriate for young readers
- About {wordLimit} words long
- Feature kind magical creatures or characters
- Have a positive message about friendship or kindness
- Be imaginative but not scary
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,

    friendship: `Write a heartwarming friendship story for children aged 5-8. The story should be:
- Focus on making friends and being kind
- Easy vocabulary and simple sentences
- About {wordLimit} words long
- Show characters helping each other
- Include sharing and caring
- Have a positive message about friendship
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,

    educational: `Write an educational story for children aged 5-8. The story should be:
- Teach something new in a fun way
- Use simple vocabulary and clear explanations
- About {wordLimit} words long
- Include interesting facts or concepts
- Make learning enjoyable and engaging
- Have characters who discover new things
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,
  },
  '9-12': {
    adventure: `Write an exciting adventure story for children aged 9-12. The story should be:
- Have more complex vocabulary and longer sentences
- Include challenges that require courage and teamwork
- Be about {wordLimit} words long
- Feature character growth and problem-solving
- Include age-appropriate excitement and tension
- Have a satisfying conclusion that teaches a valuable lesson
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{themeText}
{customInstructionsText}
{interactiveText}

Story:`,

    mystery: `Write an engaging mystery story for children aged 9-12. The story should be:
- Include clues and red herrings appropriate for this age group
- Have more sophisticated plot development
- Be about {wordLimit} words long
- Feature logical deduction and problem-solving
- Include some suspense but remain age-appropriate
- Have a clever and satisfying solution
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,

    fantasy: `Write a captivating fantasy story for children aged 9-12. The story should be:
- Include rich magical world-building
- Have more complex characters and relationships
- Be about {wordLimit} words long
- Feature magical systems or creatures with clear rules
- Include themes of growth, friendship, and overcoming challenges
- Be imaginative and inspiring
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{themeText}
{customInstructionsText}
{interactiveText}

Story:`,

    friendship: `Write a meaningful friendship story for children aged 9-12. The story should be:
- Explore deeper themes of loyalty and trust
- Include realistic friendship challenges and resolutions
- Be about {wordLimit} words long
- Show characters supporting each other through difficulties
- Include emotional growth and understanding
- Have a heartwarming conclusion about true friendship
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,

    educational: `Write an engaging educational story for children aged 9-12. The story should be:
- Teach complex concepts in an accessible way
- Include scientific, historical, or cultural information
- Be about {wordLimit} words long
- Make learning exciting through adventure or discovery
- Include characters who learn and grow from new knowledge
- Inspire curiosity about the world
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,
  },
  '13-16': {
    adventure: `Write a thrilling adventure story for teens aged 13-16. The story should be:
- Include more sophisticated themes and character development
- Feature realistic challenges and consequences
- Be about {wordLimit} words long
- Include age-appropriate tension and conflict resolution
- Explore themes of identity, friendship, and personal growth
- Have a meaningful and thought-provoking conclusion
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{themeText}
{customInstructionsText}
{interactiveText}

Story:`,

    mystery: `Write a compelling mystery story for teens aged 13-16. The story should be:
- Include complex plot twists and sophisticated clues
- Feature deeper character motivations and relationships
- Be about {wordLimit} words long
- Include psychological elements and red herrings
- Explore themes relevant to teenagers
- Have a satisfying and intelligent resolution
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,

    fantasy: `Write an immersive fantasy story for teens aged 13-16. The story should be:
- Include detailed world-building and magic systems
- Feature complex characters facing moral dilemmas
- Be about {wordLimit} words long
- Explore themes of power, responsibility, and coming of age
- Include rich descriptions and atmospheric details
- Have meaningful character development and growth
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{themeText}
{customInstructionsText}
{interactiveText}

Story:`,

    friendship: `Write a deep friendship story for teens aged 13-16. The story should be:
- Explore complex themes of loyalty, betrayal, and forgiveness
- Include realistic teenage relationship dynamics
- Be about {wordLimit} words long
- Address challenges like peer pressure and personal growth
- Show authentic emotional development and maturity
- Have a meaningful resolution about true friendship
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,

    educational: `Write an inspiring educational story for teens aged 13-16. The story should be:
- Explore advanced concepts in science, history, or culture
- Include real-world applications and relevance
- Be about {wordLimit} words long
- Feature characters who make important discoveries
- Address current issues and future possibilities
- Inspire critical thinking and curiosity
- Tone: {tone}

Story prompt: {prompt}
{charactersText}
{settingText}
{customInstructionsText}
{interactiveText}

Story:`,
  },
};

// Helper function to build enhanced story prompt from template
function buildEnhancedStoryPrompt(request: GenerateStoryRequest): string {
  const template = ENHANCED_STORY_TEMPLATES[request.ageGroup][request.storyType];
  if (!template) {
    throw new Error(`No template found for age group ${request.ageGroup} and story type ${request.storyType}`);
  }

  // Determine word limit based on length if not specified
  let wordLimit = request.wordLimit;
  if (!wordLimit) {
    const baseLimits = {
      '5-8': { short: 300, medium: 500, long: 800 },
      '9-12': { short: 500, medium: 800, long: 1200 },
      '13-16': { short: 800, medium: 1200, long: 1800 }
    };
    wordLimit = baseLimits[request.ageGroup][request.length || 'medium'];
  }

  // Build character descriptions
  let charactersText = '';
  if (request.characters && request.characters.length > 0) {
    charactersText = 'Characters:\n' + request.characters.map(char => 
      `- ${char.name} (${char.role}): ${char.description}`
    ).join('\n') + '\n';
  }

  // Build setting text
  const settingText = request.setting ? `Setting: ${request.setting}\n` : '';
  
  // Build theme text
  const themeText = request.theme ? `Theme: ${request.theme}\n` : '';
  
  // Build custom instructions text
  const customInstructionsText = request.customInstructions ? 
    `Additional Instructions: ${request.customInstructions}\n` : '';

  // Build interactive text for choose-your-adventure
  let interactiveText = '';
  if (request.isInteractive) {
    const choicePoints = request.choicePoints || 2;
    interactiveText = `\nIMPORTANT: This should be a choose-your-adventure story with ${choicePoints} decision points where the reader can choose what happens next. At each decision point, provide 2-3 clear choices with different outcomes. End each choice point with "What do you choose?" and clearly mark the choices as A), B), and C) if applicable.\n`;
  }

  return template
    .replace('{wordLimit}', wordLimit.toString())
    .replace('{tone}', request.tone || 'exciting')
    .replace('{prompt}', request.prompt)
    .replace('{charactersText}', charactersText)
    .replace('{settingText}', settingText)
    .replace('{themeText}', themeText)
    .replace('{customInstructionsText}', customInstructionsText)
    .replace('{interactiveText}', interactiveText);
}

// Helper function to extract choices from interactive stories
function extractChoices(story: string): { text: string; consequence: string; }[] {
  const choices: { text: string; consequence: string; }[] = [];
  
  // Look for choice patterns like "A) Do something" or "What do you choose?"
  const choicePattern = /[A-C]\)\s*([^A-C\n]+)/g;
  let match;
  
  while ((match = choicePattern.exec(story)) !== null) {
    choices.push({
      text: match[1].trim(),
      consequence: "Continue the adventure based on your choice!"
    });
  }
  
  return choices;
}

// Helper function to generate story title (enhanced)
function generateEnhancedStoryTitle(story: string, storyType: string, isInteractive: boolean): string {
  const sentences = story.split('.').filter(s => s.trim().length > 0);
  const firstSentence = sentences[0]?.trim() || '';
  
  // Extract potential title elements
  const words = firstSentence.split(' ').slice(0, 6);
  let title = words.join(' ');
  
  // Clean up title
  title = title.replace(/^(Once upon a time,?|There was|In a|Long ago,?)/i, '').trim();
  
  // Add story type context if title is too generic
  if (title.length < 10) {
    const typeWords = {
      adventure: ['Adventure', 'Quest', 'Journey'],
      mystery: ['Mystery', 'Secret', 'Case'],
      fantasy: ['Magic', 'Enchanted', 'Magical'],
      friendship: ['Friends', 'Friendship'],
      educational: ['Discovery', 'Learning']
    };
    
    const typeWord = typeWords[storyType as keyof typeof typeWords]?.[0] || 'Story';
    title = `The ${typeWord} of ${title}`;
  }
  
  // Add interactive indicator
  if (isInteractive) {
    title = `${title} - Choose Your Adventure`;
  }
  
  // Capitalize first letter and ensure it ends properly
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  return title || (isInteractive ? 'Choose Your Adventure' : 'An Amazing Story');
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
    let body: GenerateStoryRequest;
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
    if (!body.prompt || !body.ageGroup || !body.storyType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: prompt, ageGroup, and storyType are required' 
        },
        { status: 400 }
      );
    }

    // Validate field values
    const validAgeGroups = ['5-8', '9-12', '13-16'];
    const validStoryTypes = ['adventure', 'mystery', 'fantasy', 'friendship', 'educational'];
    const validLengths = ['short', 'medium', 'long'];
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

    if (body.length && !validLengths.includes(body.length)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid length. Must be one of: ${validLengths.join(', ')}` 
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

    // Validate prompt length and content
    if (body.prompt.length > 1000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prompt is too long. Maximum 1000 characters allowed.' 
        },
        { status: 400 }
      );
    }

    // Validate word limit
    if (body.wordLimit && (body.wordLimit < 100 || body.wordLimit > 3000)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Word limit must be between 100 and 3000 words.' 
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

    // Build the enhanced story prompt
    const storyPrompt = buildEnhancedStoryPrompt(body);

    // Set temperature based on story type and tone
    let temperature = 0.7;
    if (body.storyType === 'fantasy') temperature = 0.8;
    if (body.tone === 'funny') temperature = 0.85;
    if (body.tone === 'educational') temperature = 0.6;

    // Calculate max tokens based on word limit
    const maxTokens = Math.min((body.wordLimit || 800) * 1.5, 3000);

    // Generate the story
    const response = await ollamaClient.generate(storyPrompt, {
      temperature,
      maxTokens,
    });

    if (!response.response) {
      throw new Error('Empty response from story generation service');
    }

    // Validate content safety
    const safetyCheck = validateContentSafety(response.response);
    if (!safetyCheck.safe) {
      console.warn('Generated story failed safety check:', safetyCheck.issues);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Generated story did not meet safety guidelines. Please try a different prompt.' 
        },
        { status: 400 }
      );
    }

    // Extract choices if interactive
    const choices = body.isInteractive ? extractChoices(response.response) : undefined;

    // Generate enhanced title
    const title = generateEnhancedStoryTitle(response.response, body.storyType, body.isInteractive || false);

    // Calculate metadata
    const wordCount = response.response.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // 200 WPM average for children
    const generationTime = Date.now() - startTime;

    const result: GenerateStoryResponse = {
      success: true,
      story: response.response.trim(),
      title,
      choices,
      metadata: {
        wordCount,
        estimatedReadingTime,
        safetyCheck,
        generationTime,
        isInteractive: body.isInteractive || false,
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Story generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Story generation failed: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint (unchanged)
export async function GET() {
  try {
    const status = await ollamaClient.getStatus();
    
    return NextResponse.json({
      success: true,
      status: {
        connected: status.connected,
        availableModels: status.models,
        activeRequests: status.activeRequests,
        maxConcurrentRequests: status.maxConcurrentRequests,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Health check failed' 
      },
      { status: 500 }
    );
  }
} 