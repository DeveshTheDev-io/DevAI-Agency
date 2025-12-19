
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const items = [
  {
    id: "01",
    title: "Who are we?",
    content:
      "We are DEV AI AGENCY — a specialized collective of AI architects and high-performance engineers dedicated to bridging the gap between raw intelligence and production-grade software.",
  },
  {
    id: "02",
    title: "Our Mission",
    content:
      "Our mission is to empower organizations with autonomous digital labor. We don't just build chatbots; we build agents that think, execute, and scale alongside your human workforce.",
  },
  {
    id: "03",
    title: "AI-First Approach",
    content:
      "For us, AI is not a plugin — it's the foundation. We design systems where intelligence is baked into every microservice, ensuring your software is predictive rather than just reactive.",
  },
  {
    id: "04",
    title: "Engineering Excellence",
    content:
      "We bridge the divide between cutting-edge research and stable deployment. Using Rust, Python, and modern JS frameworks, we turn theoretical potential into functional reality.",
  },
  {
    id: "05",
    title: "Global Impact",
    content:
      "We collaborate with forward-thinking brands and startups across the globe who value high-velocity innovation and demand the security of enterprise-grade infrastructure.",
  },
  {
    id: "06",
    title: "The Toolkit",
    content:
      "Our stack includes the latest LLMs (Gemini, GPT-4), vector databases, and high-performance languages like Rust and Go, ensuring your AI ecosystem is lightning-fast and cost-effective.",
  },
  {
    id: "07",
    title: "Future-Proofing",
    content:
      "Technology moves fast, but our architectures move faster. We build with modularity in mind, allowing your organization to swap models and frameworks as the state-of-the-art evolves.",
  },
  {
    id: "08",
    title: "Join the Forge",
    content:
      "Whether you're looking to automate a single department or rebuild your entire tech stack from the ground up, we're ready to engineer your future. Let's build something inevitable.",
  },
];

export function Accordion05() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-20">
      <div className="mb-16 text-center">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-purple-500 mb-4">The Agency</h2>
        <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">ENGINEERING INTELLIGENCE.</h3>
      </div>
      <Accordion type="single" defaultValue="01" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="border-neutral-900 last:border-b">
            <AccordionTrigger className="text-left py-10 md:py-16 overflow-hidden text-neutral-500 duration-300 hover:text-white hover:no-underline cursor-pointer data-[state=open]:text-purple-400 [&>svg]:hidden">
              <div className="flex flex-1 items-start gap-8 md:gap-16">
                <p className="text-xs font-mono pt-2 md:pt-4">{item.id}</p>
                <h1 className="uppercase text-3xl md:text-6xl font-bold tracking-tighter">
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-neutral-400 text-lg md:text-xl leading-relaxed pb-12 pl-16 md:pl-32 max-w-3xl">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
