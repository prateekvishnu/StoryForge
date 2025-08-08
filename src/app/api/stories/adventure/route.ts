import { NextRequest, NextResponse } from 'next/server';

// Story generation with custom fine-tuned model
async function generateWithCustomModel(prompt: string, characters: string, storyHistory: string) {
  try {
    // Use Ollama with our custom fine-tuned model
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'storyforge-qwen-fine-tuned',
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

    // Parse the response
    const storyMatch = fullResponse.match(/STORY:\s*(.*?)\s*CHOICES:/s);
    const choicesMatch = fullResponse.match(/CHOICES:\s*(.*)/s);

    if (!storyMatch || !choicesMatch) {
      throw new Error('Invalid response format from model');
    }

    const story = storyMatch[1].trim();
    const choicesText = choicesMatch[1].trim();
    
    // Extract individual choices
    const choices = choicesText
      .split(/[ABC]:\s*/)
      .filter(choice => choice.trim())
      .map(choice => choice.trim())
      .slice(0, 3);

    return { story, choices };
  } catch (error) {
    console.error('Custom model error:', error);
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

    // Parse response
    const storyMatch = fullResponse.match(/STORY:\s*(.*?)\s*CHOICES:/s);
    const choicesMatch = fullResponse.match(/CHOICES:\s*(.*)/s);

    const story = storyMatch ? storyMatch[1].trim() : fullResponse.split('CHOICES:')[0].trim();
    const choicesText = choicesMatch ? choicesMatch[1].trim() : '';
    
    let choices = [];
    if (choicesText) {
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

    // Try custom model first, fallback to DeepSeek if needed
    let result;
    try {
      result = await generateWithCustomModel(prompt, characters || '', storyHistory || '');
    } catch (error) {
      console.log('Custom model failed, using fallback...');
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
    models: ['storyforge-qwen-fine-tuned', 'deepseek-r1:1.5b'],
    status: 'active'
  });
}
