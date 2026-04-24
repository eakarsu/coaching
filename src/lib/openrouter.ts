const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function stripBackticks(text: string): string {
  // Remove markdown code block wrappers (```...```)
  return text.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
}

export async function callOpenRouter(
  messages: OpenRouterMessage[],
  maxTokens: number = 10000
): Promise<string> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
    return 'AI analysis is currently unavailable. Please configure your OpenRouter API key in the .env file.';
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Productivity App'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return 'AI analysis temporarily unavailable. Please try again later.';
    }

    const data: OpenRouterResponse = await response.json();
    const content = data.choices[0]?.message?.content || 'No response generated.';
    return stripBackticks(content);
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return 'AI analysis temporarily unavailable. Please try again later.';
  }
}

// AI Goal Tracker - Analyze goals and provide insights
export async function analyzeGoal(goal: {
  title: string;
  description: string;
  category: string;
  progress: number;
  milestones: string[];
}): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are an expert goal coach and productivity specialist. Provide actionable, encouraging insights to help users achieve their goals. Keep responses concise (2-3 sentences) and practical.'
    },
    {
      role: 'user',
      content: `Analyze this goal and provide insights:
Title: ${goal.title}
Description: ${goal.description}
Category: ${goal.category}
Current Progress: ${goal.progress}%
Milestones: ${goal.milestones.join(', ')}

Provide specific, actionable advice to help achieve this goal.`
    }
  ];

  return callOpenRouter(messages);
}

// AI Habit Tracker - Suggest improvements for habits
export async function suggestHabitImprovements(habit: {
  name: string;
  description: string;
  frequency: string;
  streak: number;
  bestStreak: number;
  category: string;
}): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a habit formation expert using behavioral science principles. Provide specific, research-backed suggestions to help build and maintain habits. Keep responses concise and actionable.'
    },
    {
      role: 'user',
      content: `Suggest improvements for this habit:
Name: ${habit.name}
Description: ${habit.description}
Frequency: ${habit.frequency}
Current Streak: ${habit.streak} days
Best Streak: ${habit.bestStreak} days
Category: ${habit.category}

Provide specific tips to maintain and improve this habit.`
    }
  ];

  return callOpenRouter(messages);
}

// AI Session Summarizer - Summarize work/study sessions
export async function summarizeSession(session: {
  title: string;
  duration: number;
  notes: string;
  category: string;
  keyTakeaways: string[];
}): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a productivity coach who helps people reflect on their work sessions. Provide concise, insightful summaries that highlight achievements and suggest improvements.'
    },
    {
      role: 'user',
      content: `Summarize this session and provide insights:
Title: ${session.title}
Duration: ${session.duration} minutes
Notes: ${session.notes}
Category: ${session.category}
Key Takeaways: ${session.keyTakeaways.join(', ')}

Provide a brief summary and actionable suggestions for future sessions.`
    }
  ];

  return callOpenRouter(messages);
}

// AI Decision Helper - Analyze decisions
export async function analyzeDecision(decision: {
  title: string;
  description: string;
  options: string[];
  pros: string[];
  cons: string[];
  urgency: string;
  importance: string;
}): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a strategic decision-making advisor. Help users think through decisions systematically by weighing options, considering trade-offs, and providing balanced recommendations.'
    },
    {
      role: 'user',
      content: `Help analyze this decision:
Title: ${decision.title}
Description: ${decision.description}
Options: ${decision.options.join(', ')}
Pros: ${decision.pros.join(', ')}
Cons: ${decision.cons.join(', ')}
Urgency: ${decision.urgency}
Importance: ${decision.importance}

Provide analysis and a recommendation based on the information provided.`
    }
  ];

  return callOpenRouter(messages);
}

// AI Homework Generator - Generate homework questions
export async function generateHomework(params: {
  subject: string;
  topic: string;
  gradeLevel: string;
  difficulty: string;
  numberOfQuestions: number;
}): Promise<{
  questions: string[];
  answers: string[];
  hints: string[];
  explanation: string;
}> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are an educational content creator. Generate homework questions with answers, hints, and explanations. Format your response as JSON with keys: questions (array), answers (array), hints (array), explanation (string).'
    },
    {
      role: 'user',
      content: `Generate homework for:
Subject: ${params.subject}
Topic: ${params.topic}
Grade Level: ${params.gradeLevel}
Difficulty: ${params.difficulty}
Number of Questions: ${params.numberOfQuestions}

Return ONLY valid JSON with this structure:
{"questions": [...], "answers": [...], "hints": [...], "explanation": "..."}`
    }
  ];

  const response = await callOpenRouter(messages, 10000);

  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error('Failed to parse homework response:', response);
  }

  // Return default structure if parsing fails
  return {
    questions: ['Question generation failed. Please try again.'],
    answers: ['N/A'],
    hints: ['Please try generating again'],
    explanation: 'Unable to generate homework at this time.'
  };
}

// AI Mood Tracker - Analyze mood patterns
export async function analyzeMood(mood: {
  rating: number;
  emotion: string;
  notes: string;
  factors: string[];
  activities: string[];
  energy: number;
  stress: number;
  sleep: number;
}): Promise<{ analysis: string; suggestions: string[] }> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a mental wellness coach. Analyze mood data to provide supportive insights and practical suggestions. Be empathetic and constructive. Format response as JSON with keys: analysis (string), suggestions (array of 3 strings).'
    },
    {
      role: 'user',
      content: `Analyze this mood entry:
Rating: ${mood.rating}/10
Emotion: ${mood.emotion}
Notes: ${mood.notes}
Contributing Factors: ${mood.factors.join(', ')}
Activities: ${mood.activities.join(', ')}
Energy Level: ${mood.energy}/10
Stress Level: ${mood.stress}/10
Sleep Quality: ${mood.sleep}/10

Return ONLY valid JSON: {"analysis": "...", "suggestions": ["...", "...", "..."]}`
    }
  ];

  const response = await callOpenRouter(messages);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error('Failed to parse mood response:', response);
  }

  return {
    analysis: response,
    suggestions: ['Take care of yourself', 'Consider talking to someone', 'Focus on rest and recovery']
  };
}

// AI Outcome Predictor - Predict outcomes
export async function predictOutcome(prediction: {
  title: string;
  description: string;
  scenario: string;
  factors: string[];
  category: string;
  timeframe: string;
}): Promise<{ prediction: string; probability: number; confidence: string }> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a strategic analyst who helps predict outcomes based on available factors. Provide realistic probability assessments with reasoning. Format response as JSON with keys: prediction (string analysis), probability (number 0-100), confidence (low/medium/high).'
    },
    {
      role: 'user',
      content: `Predict the outcome for:
Title: ${prediction.title}
Description: ${prediction.description}
Scenario: ${prediction.scenario}
Key Factors: ${prediction.factors.join(', ')}
Category: ${prediction.category}
Timeframe: ${prediction.timeframe}

Return ONLY valid JSON: {"prediction": "...", "probability": 0, "confidence": "medium"}`
    }
  ];

  const response = await callOpenRouter(messages);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error('Failed to parse prediction response:', response);
  }

  return {
    prediction: response,
    probability: 50,
    confidence: 'medium'
  };
}

// AI Goal Setter - Help create SMART goals
export async function suggestGoals(params: {
  category: string;
  interests: string[];
  currentGoals: string[];
  timeframe: string;
}): Promise<string[]> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a goal-setting coach who helps create SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). Suggest 3 concrete goals based on the user input. Format response as JSON array of strings.'
    },
    {
      role: 'user',
      content: `Suggest goals based on:
Category: ${params.category}
Interests: ${params.interests.join(', ')}
Current Goals: ${params.currentGoals.join(', ')}
Timeframe: ${params.timeframe}

Return ONLY a JSON array of 3 goal suggestions: ["goal1", "goal2", "goal3"]`
    }
  ];

  const response = await callOpenRouter(messages);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error('Failed to parse goal suggestions:', response);
  }

  return ['Set a specific target for your chosen category', 'Break down larger goals into milestones', 'Track your progress daily'];
}
