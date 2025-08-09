import { NextRequest, NextResponse } from 'next/server';

// Story generation with primary model (StoryForge Custom Model)
async function generateWithPrimaryModel(prompt: string, characters: string, storyHistory: string) {
  try {
    // Use Ollama with our custom fine-tuned StoryForge model
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'storyforge-qwen-fine-tuned:latest',
        prompt: `You are a helpful AI assistant that creates engaging, age-appropriate adventure stories for children aged 9-12. 

Characters: ${characters}

Story History: ${storyHistory}

Current Situation: ${prompt}

Create the next part of this adventure story (200-250 words) and provide exactly 3 different choices for what could happen next. The story should be exciting but safe for children.

Format your response as:
STORY: [your story continuation here]

CHOICES:
A: [first choice]
B: [second choice] 
C: [third choice]`,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 500
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const fullResponse = data.response;

    // Parse the response - more flexible parsing
    let story = '';
    let choices: string[] = [];

    // Try to extract story and choices from the response
    const storyMatch = fullResponse.match(/STORY:\s*(.*?)\s*(?:CHOICES:|$)/s);
    const choicesMatch = fullResponse.match(/CHOICES:\s*(.*)/s);

    if (storyMatch) {
      story = storyMatch[1].trim();
    } else {
      // If no STORY: marker, use the first part before CHOICES:
      const parts = fullResponse.split('CHOICES:');
      story = parts[0].trim();
    }

    if (choicesMatch) {
      const choicesText = choicesMatch[1].trim();
      // Extract individual choices
      choices = choicesText
        .split(/[ABC]:\s*/)
        .filter(choice => choice.trim())
        .map(choice => choice.trim())
        .slice(0, 3);
    }

    // Fallback: if no proper choices found, generate default ones
    if (choices.length === 0) {
      choices = [
        "Explore deeper into the area",
        "Talk to someone nearby for help",
        "Try a different approach"
      ];
    }

    // Clean up story text
    story = story.replace(/^\*+|\*+$/g, '').trim();

    return { story, choices };
  } catch (error) {
    console.error('Primary model error:', error);
    throw error;
  }
}

// Fallback to DeepSeek model
async function generateWithFallback(prompt: string, characters: string, storyHistory: string) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b',
        prompt: `You are creating a children's adventure story for ages 9-12.

Characters: ${characters}
Previous Story: ${storyHistory}
Current Situation: ${prompt}

Write the next part of this adventure (200-250 words) and provide exactly 3 choices for what happens next.

Format:
STORY: [story text]
CHOICES:
A: [choice 1]
B: [choice 2]
C: [choice 3]`,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 500
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Fallback API error: ${response.status}`);
    }

    const data = await response.json();
    const fullResponse = data.response;

    // Parse response - consistent with primary model
    let story = '';
    let choices: string[] = [];

    const storyMatch = fullResponse.match(/STORY:\s*(.*?)\s*(?:CHOICES:|$)/s);
    const choicesMatch = fullResponse.match(/CHOICES:\s*(.*)/s);

    if (storyMatch) {
      story = storyMatch[1].trim();
    } else {
      story = fullResponse.split('CHOICES:')[0].trim();
    }

    if (choicesMatch) {
      const choicesText = choicesMatch[1].trim();
      choices = choicesText
        .split(/[ABC]:\s*/)
        .filter(choice => choice.trim())
        .map(choice => choice.trim())
        .slice(0, 3);
    }

    // Provide default choices if parsing failed
    if (choices.length === 0) {
      choices = [
        "Continue exploring the area",
        "Talk to someone nearby", 
        "Try something completely different"
      ];
    }

    // Clean up story text
    story = story.replace(/^\*+|\*+$/g, '').trim();

    return { story, choices };
  } catch (error) {
    console.error('Fallback model error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, characters, storyHistory, ageGroup, storyType } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Try primary model first, fallback to smaller model if needed
    let result;
    try {
      result = await generateWithPrimaryModel(prompt, characters || '', storyHistory || '');
    } catch (error) {
      console.log('Primary model failed, using fallback...');
      result = await generateWithFallback(prompt, characters || '', storyHistory || '');
    }

    return NextResponse.json({
      story: result.story,
      choices: result.choices,
      characters: characters,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Adventure API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate adventure story' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Adventure Story API is running',
    models: ['storyforge-qwen-fine-tuned:latest', 'deepseek-r1:1.5b'],
    status: 'active'
  });
}
