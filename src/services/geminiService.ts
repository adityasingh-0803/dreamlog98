interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Gemini API key not found. AI features will be simulated.');
    }
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.apiKey) {
      // Fallback to simulation if no API key
      return this.simulateResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.simulateResponse(prompt);
    }
  }

  private simulateResponse(prompt: string): string {
    // Fallback responses when API is not available
    if (prompt.includes('complete') || prompt.includes('continue')) {
      const completions = [
        "...and suddenly I found myself floating above a vast ocean of memories, each wave carrying fragments of forgotten moments...",
        "...the mirror showed not my reflection, but the person I might have been in another life, beckoning me to step through...",
        "...in the garden of sleeping thoughts, every flower bloomed with the face of someone I once knew...",
        "...the stairs descended infinitely, each step echoing with the sound of my own heartbeat growing fainter..."
      ];
      return completions[Math.floor(Math.random() * completions.length)];
    }
    
    if (prompt.includes('analyze') || prompt.includes('interpretation')) {
      return `🔮 DREAM ANALYSIS

Symbols Detected:
• Water: Represents transformation and unconscious wisdom
• Flying: Symbolizes liberation and transcendence
• Doors: Gateways to new experiences and opportunities

Emotional Undertones:
• Wonder: Intensity level 85%
• Curiosity: Intensity level 70%
• Nostalgia: Intensity level 90%

Archetypal Presence:
• Shadow Self: Guiding you toward integration
• Wise Guide: Offering hidden knowledge

Interpretation:
This dream speaks to your journey of self-discovery. The recurring themes suggest a deep desire for transformation and the courage to face hidden aspects of yourself.`;
    }

    return "The dream realm whispers secrets only you can understand...";
  }

  async completeDream(dreamText: string): Promise<string> {
    const prompt = `You are a mystical dream interpreter with deep knowledge of Jungian psychology and surreal symbolism. 

The user has started writing this dream:
"${dreamText}"

Continue this dream in a poetic, surreal, and slightly mysterious tone. Use vivid imagery, symbolic elements, and maintain the dreamlike quality. The continuation should feel like it flows naturally from the original text and explore deeper psychological themes. Keep it between 50-150 words.

Continue the dream:`;

    return await this.makeRequest(prompt);
  }

  async analyzeDream(dreamContent: string): Promise<string> {
    const prompt = `You are a wise dream analyst versed in Jungian psychology, symbolism, and the language of the unconscious mind.

Analyze this dream:
"${dreamContent}"

Provide a mystical yet insightful analysis that includes:
1. Key symbols and their meanings
2. Emotional undertones and their intensity
3. Archetypal figures or themes present
4. Psychological interpretation
5. Guidance for the dreamer

Format your response with emojis and clear sections. Be poetic but meaningful, mysterious but helpful.`;

    return await this.makeRequest(prompt);
  }

  async generateDreamEmail(dreamThemes: string[], characterName: string): Promise<{ subject: string; content: string }> {
    const themes = dreamThemes.join(', ');
    const prompt = `You are ${characterName}, a mysterious character from someone's dreams. Based on these dream themes: ${themes}

Write a cryptic, poetic email that this dream character would send. The email should:
- Be mysterious and slightly eerie
- Reference the dream themes subtly
- Feel like it comes from the subconscious
- Be 100-200 words
- Have a compelling subject line

Respond in this format:
SUBJECT: [subject line]
CONTENT: [email content]`;

    const response = await this.makeRequest(prompt);
    
    // Parse the response to extract subject and content
    const lines = response.split('\n');
    let subject = 'Message from the Dream Realm';
    let content = response;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('SUBJECT:')) {
        subject = lines[i].replace('SUBJECT:', '').trim();
        content = lines.slice(i + 1).join('\n').replace('CONTENT:', '').trim();
        break;
      }
    }

    return { subject, content };
  }

  async detectEmotions(dreamText: string): Promise<string[]> {
    const prompt = `Analyze the emotional content of this dream and return only the primary emotions present:

"${dreamText}"

Return only a comma-separated list of emotions (max 5). Choose from: wonder, anxiety, joy, fear, nostalgia, love, anger, sadness, excitement, confusion, peace, dread, euphoria, melancholy, curiosity.

Example response: wonder, nostalgia, anxiety`;

    const response = await this.makeRequest(prompt);
    return response.split(',').map(emotion => emotion.trim()).slice(0, 5);
  }

  async detectSymbols(dreamText: string): Promise<string[]> {
    const prompt = `Identify the key symbolic elements in this dream:

"${dreamText}"

Return only a comma-separated list of symbols (max 7). Focus on archetypal symbols like: water, fire, flying, falling, doors, mirrors, animals, death, birth, houses, roads, bridges, mountains, forests, etc.

Example response: water, flying, mirrors, doors`;

    const response = await this.makeRequest(prompt);
    return response.split(',').map(symbol => symbol.trim()).slice(0, 7);
  }

  async generateDreamCharacters(dreamText: string): Promise<string[]> {
    const prompt = `Identify the significant characters or figures in this dream:

"${dreamText}"

Return only a comma-separated list of character types (max 5). Use archetypal descriptions like: shadow self, wise guide, inner child, anima, animus, mother figure, father figure, stranger, past love, future self, etc.

Example response: shadow self, wise guide, stranger`;

    const response = await this.makeRequest(prompt);
    return response.split(',').map(character => character.trim()).slice(0, 5);
  }

  async generateDreamImagePrompt(dreamText: string): Promise<string> {
    const prompt = `Create a detailed image generation prompt for this dream:

"${dreamText}"

Generate a prompt suitable for AI image generation that captures the essence, mood, and key visual elements of this dream. Make it surreal, artistic, and dreamlike. Include style descriptors like "surreal digital art", "dreamscape", "ethereal", etc.

Keep it under 100 words and focus on visual elements.`;

    return await this.makeRequest(prompt);
  }
}

export const geminiService = new GeminiService();