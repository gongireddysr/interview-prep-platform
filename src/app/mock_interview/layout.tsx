"use client";

import { MockInterviewProvider } from "@/context/MockInterviewContext";

export default function MockInterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MockInterviewProvider>{children}</MockInterviewProvider>;
}
