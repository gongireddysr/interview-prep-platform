"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MockInterviewAnswers {
  recruiter: string;
  coding: string;
  behavioral: string;
  systemDesign: string;
}

interface MockInterviewContextType {
  answers: MockInterviewAnswers;
  setAnswer: (round: keyof MockInterviewAnswers, answer: string) => void;
  resetAnswers: () => void;
}

const defaultAnswers: MockInterviewAnswers = {
  recruiter: "",
  coding: "",
  behavioral: "",
  systemDesign: "",
};

const MockInterviewContext = createContext<MockInterviewContextType | undefined>(undefined);

export function MockInterviewProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<MockInterviewAnswers>(defaultAnswers);

  const setAnswer = (round: keyof MockInterviewAnswers, answer: string) => {
    setAnswers((prev) => ({ ...prev, [round]: answer }));
  };

  const resetAnswers = () => {
    setAnswers(defaultAnswers);
  };

  return (
    <MockInterviewContext.Provider value={{ answers, setAnswer, resetAnswers }}>
      {children}
    </MockInterviewContext.Provider>
  );
}

export function useMockInterview() {
  const context = useContext(MockInterviewContext);
  if (context === undefined) {
    throw new Error("useMockInterview must be used within a MockInterviewProvider");
  }
  return context;
}
