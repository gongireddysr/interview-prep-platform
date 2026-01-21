import { NextRequest, NextResponse } from "next/server";

interface FormData {
  coding: {
    language: string;
    code: string;
    explanation: string;
  };
  explanation: {
    answer: string;
  };
  recruiter: {
    answer: string;
  };
  behavioral: {
    answer: string;
  };
}

interface RoundBreakdown {
  attempt: number;
  completeness: number;
  clarity: number;
  structure: number;
  confidence: number;
}

interface RoundScore {
  total: number;
  breakdown: RoundBreakdown;
}

interface EvaluationResult {
  scores: {
    coding: RoundScore;
    explanation: RoundScore;
    recruiter: RoundScore;
    behavioral: RoundScore;
  };
  totalScore: number;
  maxScore: number;
  readiness: "not_ready" | "borderline" | "ready";
  readinessLabel: string;
  weakAreas: string[];
}

const WEAK_AREA_LABELS: Record<string, Record<string, string>> = {
  coding: {
    attempt: "Code submission",
    completeness: "Coding explanations",
    clarity: "Explanation length",
    structure: "Code explanation structure",
    confidence: "Coding confidence",
  },
  explanation: {
    attempt: "Technical explanation",
    completeness: "Answer completeness",
    clarity: "Explanation clarity",
    structure: "Answer structure",
    confidence: "Communication clarity",
  },
  recruiter: {
    attempt: "Self-introduction",
    completeness: "Career narrative",
    clarity: "Introduction length",
    structure: "Timeline structure",
    confidence: "Professional ownership",
  },
  behavioral: {
    attempt: "Behavioral response",
    completeness: "Action-result connection",
    clarity: "Story length",
    structure: "Behavioral storytelling",
    confidence: "Personal ownership",
  },
};

function getWeakAreas(scores: EvaluationResult["scores"]): string[] {
  const weakAreas: string[] = [];
  
  for (const [round, roundScore] of Object.entries(scores)) {
    for (const [rule, score] of Object.entries(roundScore.breakdown)) {
      if (score === 0 && rule !== "attempt") {
        const label = WEAK_AREA_LABELS[round]?.[rule];
        if (label && !weakAreas.includes(label)) {
          weakAreas.push(label);
        }
      }
    }
  }
  
  return weakAreas.slice(0, 5);
}

// Helper functions
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function containsAny(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()));
}

function hasHedging(text: string): boolean {
  const hedgingPhrases = ["maybe", "i think", "not sure", "kind of", "probably"];
  return containsAny(text, hedgingPhrases);
}

function hasParagraphs(text: string): boolean {
  return text.includes("\n\n") || text.split("\n").filter(Boolean).length > 1;
}

function hasNumberedOrBulletedSteps(text: string): boolean {
  return /(\d+\.|[-•*]\s)/.test(text);
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

// Scoring functions for each round
function scoreCodingRound(data: FormData["coding"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  // 1. Attempt: Code field is not empty
  if (data.code.trim().length > 0) {
    breakdown.attempt = 1;
  }

  // 2. Completeness: Both code and explanation are present
  if (data.code.trim().length > 0 && data.explanation.trim().length > 0) {
    breakdown.completeness = 1;
  }

  // 3. Clarity: Explanation length is 30-200 words
  const wordCount = countWords(data.explanation);
  if (wordCount >= 30 && wordCount <= 200) {
    breakdown.clarity = 1;
  }

  // 4. Structure: Step words, line breaks, or numbered/bulleted steps
  const structureKeywords = ["first", "then", "finally", "approach"];
  if (
    containsAny(data.explanation, structureKeywords) ||
    hasParagraphs(data.explanation) ||
    hasNumberedOrBulletedSteps(data.explanation)
  ) {
    breakdown.structure = 1;
  }

  // 5. Confidence: Assertive phrases without hedging
  const assertivePhrases = ["i decided", "i used", "i implemented", "i chose"];
  if (containsAny(data.explanation, assertivePhrases) && !hasHedging(data.explanation)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function scoreExplanationRound(data: FormData["explanation"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  // 1. Attempt: Answer is not empty
  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  // 2. Completeness: At least 2 sentences
  if (countSentences(data.answer) >= 2) {
    breakdown.completeness = 1;
  }

  // 3. Clarity: Answer length is 50-300 words
  const wordCount = countWords(data.answer);
  if (wordCount >= 50 && wordCount <= 300) {
    breakdown.clarity = 1;
  }

  // 4. Structure: Paragraphs or explanation keywords
  const structureKeywords = ["because", "for example", "works by"];
  if (containsAny(data.answer, structureKeywords) || hasParagraphs(data.answer)) {
    breakdown.structure = 1;
  }

  // 5. Confidence: Definitive language without hedging
  const definitiveKeywords = [" is ", " works", "happens when"];
  if (containsAny(data.answer, definitiveKeywords) && !hasHedging(data.answer)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function scoreRecruiterRound(data: FormData["recruiter"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  // 1. Attempt: Answer is not empty
  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  // 2. Completeness: Mentions past, present, and future
  const pastKeywords = ["worked", "built", "developed", "created", "was", "had"];
  const presentKeywords = ["currently", "now", "am", "working on", "at present"];
  const futureKeywords = ["looking", "next", "want", "goal", "plan", "hoping", "seeking"];

  const hasPast = containsAny(data.answer, pastKeywords);
  const hasPresent = containsAny(data.answer, presentKeywords);
  const hasFuture = containsAny(data.answer, futureKeywords);

  if (hasPast && hasPresent && hasFuture) {
    breakdown.completeness = 1;
  }

  // 3. Clarity: Answer length is 60-250 words
  const wordCount = countWords(data.answer);
  if (wordCount >= 60 && wordCount <= 250) {
    breakdown.clarity = 1;
  }

  // 4. Structure: Timeline flow or paragraphs
  const timelineKeywords = ["first", "then", "now", "after", "before"];
  if (containsAny(data.answer, timelineKeywords) || hasParagraphs(data.answer)) {
    breakdown.structure = 1;
  }

  // 5. Confidence: Ownership language without hedging
  const ownershipPhrases = ["i built", "i led", "i handled", "i managed", "i created", "i developed"];
  if (containsAny(data.answer, ownershipPhrases) && !hasHedging(data.answer)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function scoreBehavioralRound(data: FormData["behavioral"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  // 1. Attempt: Answer is not empty
  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  // 2. Completeness: Mentions action and result
  const actionKeywords = ["i did", "i fixed", "i resolved", "i implemented", "i handled", "i took"];
  const resultKeywords = ["result", "outcome", "impact", "led to", "resulted in", "achieved"];

  const hasAction = containsAny(data.answer, actionKeywords);
  const hasResult = containsAny(data.answer, resultKeywords);

  if (hasAction && hasResult) {
    breakdown.completeness = 1;
  }

  // 3. Clarity: Answer length is 70-300 words
  const wordCount = countWords(data.answer);
  if (wordCount >= 70 && wordCount <= 300) {
    breakdown.clarity = 1;
  }

  // 4. Structure: STAR elements (at least 2)
  const situationKeywords = ["situation", "context", "background", "was working", "team was"];
  const taskKeywords = ["task", "responsible", "needed to", "had to", "goal was"];
  const actionStructureKeywords = ["action", "i decided", "i started", "i began", "steps"];
  const resultStructureKeywords = ["result", "outcome", "ended up", "finally", "ultimately"];

  let starCount = 0;
  if (containsAny(data.answer, situationKeywords)) starCount++;
  if (containsAny(data.answer, taskKeywords)) starCount++;
  if (containsAny(data.answer, actionStructureKeywords)) starCount++;
  if (containsAny(data.answer, resultStructureKeywords)) starCount++;

  if (starCount >= 2) {
    breakdown.structure = 1;
  }

  // 5. Confidence: First-person ownership without hedging or lone "we"
  const hasFirstPerson = data.answer.toLowerCase().includes(" i ");
  const hasLoneWe = /\bwe\b/i.test(data.answer) && !hasFirstPerson;

  if (hasFirstPerson && !hasLoneWe && !hasHedging(data.answer)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function getReadiness(totalScore: number): { readiness: EvaluationResult["readiness"]; label: string } {
  if (totalScore >= 15) {
    return { readiness: "ready", label: "✅ Ready" };
  } else if (totalScore >= 8) {
    return { readiness: "borderline", label: "⚠️ Borderline" };
  } else {
    return { readiness: "not_ready", label: "❌ Not Ready" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    // Validate input
    if (!body.coding || !body.explanation || !body.recruiter || !body.behavioral) {
      return NextResponse.json(
        { error: "Missing required fields. All four rounds must be submitted." },
        { status: 400 }
      );
    }

    // Score each round
    const codingScore = scoreCodingRound(body.coding);
    const explanationScore = scoreExplanationRound(body.explanation);
    const recruiterScore = scoreRecruiterRound(body.recruiter);
    const behavioralScore = scoreBehavioralRound(body.behavioral);

    // Calculate total
    const totalScore =
      codingScore.total + explanationScore.total + recruiterScore.total + behavioralScore.total;

    // Determine readiness
    const { readiness, label } = getReadiness(totalScore);

    const scores = {
      coding: codingScore,
      explanation: explanationScore,
      recruiter: recruiterScore,
      behavioral: behavioralScore,
    };

    const weakAreas = getWeakAreas(scores);

    const result: EvaluationResult = {
      scores,
      totalScore,
      maxScore: 20,
      readiness,
      readinessLabel: label,
      weakAreas,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "Failed to evaluate diagnostic" }, { status: 500 });
  }
}
