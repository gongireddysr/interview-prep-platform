import { NextRequest, NextResponse } from "next/server";

interface MockInterviewData {
  recruiter: {
    answer: string;
  };
  coding: {
    answer: string;
  };
  behavioral: {
    answer: string;
  };
  systemDesign: {
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
    recruiter: RoundScore;
    coding: RoundScore;
    behavioral: RoundScore;
    systemDesign: RoundScore;
  };
  totalScore: number;
  maxScore: number;
  readiness: "not_ready" | "ready";
  readinessLabel: string;
  weakAreas: string[];
}

const WEAK_AREA_LABELS: Record<string, Record<string, string>> = {
  recruiter: {
    attempt: "Self-introduction",
    completeness: "Career narrative",
    clarity: "Introduction length",
    structure: "Timeline structure",
    confidence: "Professional ownership",
  },
  coding: {
    attempt: "Coding response",
    completeness: "Solution explanation",
    clarity: "Answer length",
    structure: "Problem-solving structure",
    confidence: "Technical confidence",
  },
  behavioral: {
    attempt: "Behavioral response",
    completeness: "Action-result connection",
    clarity: "Story length",
    structure: "Behavioral storytelling",
    confidence: "Personal ownership",
  },
  systemDesign: {
    attempt: "System design response",
    completeness: "Design completeness",
    clarity: "Explanation length",
    structure: "Architecture structure",
    confidence: "Design confidence",
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

function scoreRecruiterRound(data: MockInterviewData["recruiter"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  const pastKeywords = ["worked", "built", "developed", "created", "was", "had"];
  const presentKeywords = ["currently", "now", "am", "working on", "at present"];
  const futureKeywords = ["looking", "next", "want", "goal", "plan", "hoping", "seeking"];

  const hasPast = containsAny(data.answer, pastKeywords);
  const hasPresent = containsAny(data.answer, presentKeywords);
  const hasFuture = containsAny(data.answer, futureKeywords);

  if (hasPast && hasPresent && hasFuture) {
    breakdown.completeness = 1;
  }

  const wordCount = countWords(data.answer);
  if (wordCount >= 60 && wordCount <= 250) {
    breakdown.clarity = 1;
  }

  const timelineKeywords = ["first", "then", "now", "after", "before"];
  if (containsAny(data.answer, timelineKeywords) || hasParagraphs(data.answer)) {
    breakdown.structure = 1;
  }

  const ownershipPhrases = ["i built", "i led", "i handled", "i managed", "i created", "i developed"];
  if (containsAny(data.answer, ownershipPhrases) && !hasHedging(data.answer)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function scoreCodingRound(data: MockInterviewData["coding"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  if (countSentences(data.answer) >= 2) {
    breakdown.completeness = 1;
  }

  const wordCount = countWords(data.answer);
  if (wordCount >= 30 && wordCount <= 300) {
    breakdown.clarity = 1;
  }

  const structureKeywords = ["first", "then", "finally", "approach", "step"];
  if (
    containsAny(data.answer, structureKeywords) ||
    hasParagraphs(data.answer) ||
    hasNumberedOrBulletedSteps(data.answer)
  ) {
    breakdown.structure = 1;
  }

  const assertivePhrases = ["i would", "i used", "i implemented", "i chose", "the solution"];
  if (containsAny(data.answer, assertivePhrases) && !hasHedging(data.answer)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function scoreBehavioralRound(data: MockInterviewData["behavioral"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  const actionKeywords = ["i did", "i fixed", "i resolved", "i implemented", "i handled", "i took"];
  const resultKeywords = ["result", "outcome", "impact", "led to", "resulted in", "achieved"];

  const hasAction = containsAny(data.answer, actionKeywords);
  const hasResult = containsAny(data.answer, resultKeywords);

  if (hasAction && hasResult) {
    breakdown.completeness = 1;
  }

  const wordCount = countWords(data.answer);
  if (wordCount >= 70 && wordCount <= 300) {
    breakdown.clarity = 1;
  }

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

function scoreSystemDesignRound(data: MockInterviewData["systemDesign"]): RoundScore {
  const breakdown: RoundBreakdown = {
    attempt: 0,
    completeness: 0,
    clarity: 0,
    structure: 0,
    confidence: 0,
  };

  if (data.answer.trim().length > 0) {
    breakdown.attempt = 1;
  }

  const designKeywords = ["database", "api", "server", "client", "cache", "load balancer", "service"];
  if (containsAny(data.answer, designKeywords)) {
    breakdown.completeness = 1;
  }

  const wordCount = countWords(data.answer);
  if (wordCount >= 50 && wordCount <= 400) {
    breakdown.clarity = 1;
  }

  const structureKeywords = ["component", "layer", "tier", "flow", "architecture", "design"];
  if (
    containsAny(data.answer, structureKeywords) ||
    hasParagraphs(data.answer) ||
    hasNumberedOrBulletedSteps(data.answer)
  ) {
    breakdown.structure = 1;
  }

  const confidenceKeywords = ["i would design", "i would use", "the system", "this ensures", "this allows"];
  if (containsAny(data.answer, confidenceKeywords) && !hasHedging(data.answer)) {
    breakdown.confidence = 1;
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
  };
}

function getReadiness(totalScore: number): { readiness: EvaluationResult["readiness"]; label: string } {
  if (totalScore >= 15) {
    return { readiness: "ready", label: "Ready" };
  } else {
    return { readiness: "not_ready", label: "Not Ready" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MockInterviewData = await request.json();

    if (!body.recruiter || !body.coding || !body.behavioral || !body.systemDesign) {
      return NextResponse.json(
        { error: "Missing required fields. All four rounds must be submitted." },
        { status: 400 }
      );
    }

    const recruiterScore = scoreRecruiterRound(body.recruiter);
    const codingScore = scoreCodingRound(body.coding);
    const behavioralScore = scoreBehavioralRound(body.behavioral);
    const systemDesignScore = scoreSystemDesignRound(body.systemDesign);

    const totalScore =
      recruiterScore.total + codingScore.total + behavioralScore.total + systemDesignScore.total;

    const { readiness, label } = getReadiness(totalScore);

    const scores = {
      recruiter: recruiterScore,
      coding: codingScore,
      behavioral: behavioralScore,
      systemDesign: systemDesignScore,
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
    console.error("Mock interview evaluation error:", error);
    return NextResponse.json({ error: "Failed to evaluate mock interview" }, { status: 500 });
  }
}
