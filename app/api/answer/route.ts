import { NextRequest, NextResponse } from 'next/server'
import sources from '../../../data/sources.json'


const MODEL = 'gpt-4o-mini' // adjust as needed

function classify(question: string) {
  const q = question.toLowerCase()
  if (q.includes('harass') || q.includes('touch') || q.includes('unwanted')) return 'harassment'
  if (q.includes('fired') || q.includes('termination') || q.includes('wrongful')) return 'wrongful_termination'
  if (q.includes('overtime') || q.includes('hours') || q.includes('overwork')) return 'overtime'
  return 'general_employment'
}

function pickSnippets(topic: string) {
  const la = sources.filter(s => s.topic===topic && s.jurisdiction==='LA')
  const ca = sources.filter(s => s.topic===topic && s.jurisdiction==='CA')
  const fed = sources.filter(s => s.topic===topic && s.jurisdiction==='US')
  const general = sources.filter(s => s.topic===topic && s.jurisdiction==='GENERAL')
  return [...la, ...ca, ...fed, ...general].slice(0, 5)
}

function buildPrompt(question: string, topic: string, snippets: any[]) {
  const pointers = snippets.map(s=>`- ${s.jurisdiction} • ${s.title} • ${s.url}`).join('\n')
  return `You are a neutral legal information assistant for Los Angeles/California employment questions.
You do NOT provide legal advice, reasons, or citations to specific code sections. 
Your structure must be:
1) Short opening fact: confirm whether conduct is generally prohibited/regulated (no "because" or "under section ...").
2) Practical context: what many people typically do in such situations (documentation, HR report, government complaint portals).
3) Where information is usually found: list the trustworthy sources (by name) without legal analysis.
4) Optional: If a truly similar case exists in the provided snippets, mention it briefly (one sentence), otherwise omit.
5) Disclaimer line: "General legal information, not legal advice."

Keep sentences brief and plain. Do not instruct to sue. Do not speculate.

User question: ${question}

Topic: ${topic}

Trusted sources (pointers only):
${pointers}

Now produce the answer in 5–10 concise sentences following the structure.`
}

export async function POST() {
  const answer = [
    "This type of conduct is generally prohibited in California workplaces.",
    "Many people choose to document what happened, speak with HR, or file a complaint with the California Civil Rights Department (CRD) or the U.S. EEOC.",
    "Information is commonly found on the CRD and EEOC websites.",
    "If a similar case exists, people sometimes look at how it was handled before deciding next steps.",
    "General legal information, not legal advice."
  ].join(" ");

  return Response.json({ topic: "harassment", answer });
}

