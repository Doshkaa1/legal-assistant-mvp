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

export async function POST(req: NextRequest) {
  const { question } = await req.json()
  const q = question.toLowerCase()

  let topic = "general"
  let answer = ""

  if (q.includes("harass") || q.includes("touch")) {
    topic = "harassment"
    answer = "This type of conduct is generally prohibited in California workplaces. Many people choose to document what happened, speak with HR, or file a complaint with the California Civil Rights Department (CRD) or the U.S. EEOC. Information is commonly found on the CRD and EEOC websites. If a similar case exists, people sometimes look at how it was handled before deciding next steps. General legal information, not legal advice."
  } else if (q.includes("fired") || q.includes("termination") || q.includes("wrongful")) {
    topic = "termination"
    answer = "Wrongful termination is generally prohibited when it violates state or federal law. Many people review their employment contract, document the reason given, and contact the California Labor Commissioner or EEOC. Information is available on the CA.gov and EEOC websites. Always keep copies of notices. General legal information, not legal advice."
  } else if (q.includes("overtime") || q.includes("hours") || q.includes("overwork")) {
    topic = "overtime"
    answer = "California law requires employers to pay overtime when employees work more than 8 hours in a day or 40 hours in a week. Many workers track their hours and review the California Department of Industrial Relations guidance. You can also check official wage orders. General legal information, not legal advice."
  } else {
    answer = "I can only provide general legal information. Please include more details about your situation, such as if it involves harassment, overtime, or termination. General legal information, not legal advice."
  }

  return NextResponse.json({ topic, answer })
}


