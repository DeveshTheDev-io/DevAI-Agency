import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tyzeqentofkjvuvnbens.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5emVxZW50b2ZranZ1dm5iZW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDQ5ODgsImV4cCI6MjA4OTkyMDk4OH0.m6d1qqQmnYM_sUzu5XPTn-6GbjKMCfcvvPYrs5hkRrU'
);

const packages = [
  {
    name: 'Freelancer Kickstart',
    price: 4999,
    badge: null,
    highlight: false,
    description: 'Get a polished portfolio, landing page, or micro-SaaS MVP built and deployed fast.',
    features: ['1-Page React Website', 'Contact/Lead Form', 'Deployed on Vercel', 'Basic SEO Setup', '3-day delivery'],
  },
  {
    name: 'Startup Launch',
    price: 14999,
    badge: 'Best for Founders',
    highlight: false,
    description: 'Validate your idea with a fast, functional MVP — built for Indian founders and early-stage teams.',
    features: ['React + Supabase MVP', 'Auth & Dashboard', '1 AI Feature', 'Mobile Responsive', '1-week delivery'],
  },
  {
    name: 'E-Commerce AI Store',
    price: 29999,
    badge: 'Most Popular',
    highlight: true,
    description: 'Complete D2C store with AI product recommendations, Razorpay/UPI, and inventory dashboard.',
    features: ['Product Catalog + Cart', 'Razorpay / UPI Integration', 'AI Recommendations Engine', 'Admin Inventory Panel', 'WhatsApp/SMS Alerts', '2-week delivery'],
  },
  {
    name: 'Full-Stack SaaS Pro',
    price: 49999,
    badge: null,
    highlight: false,
    description: 'Production-ready SaaS with user auth, billing, AI features, and admin panel — ideal for MSMEs.',
    features: ['React + Node.js + Supabase', 'User Auth + Roles', 'Stripe / Razorpay Billing', 'AI Feature Integration', 'Framer Motion UI', 'Admin Dashboard', '2–3 week delivery'],
  },
  {
    name: 'AI Agent Forge',
    price: 39999,
    badge: 'Hot',
    highlight: false,
    description: 'Deploy a custom AI agent for your business — customer support, lead gen, or internal automation.',
    features: ['Custom LLM Integration', 'GPT-4 / Gemini Backend', 'WhatsApp / Web Chat UI', 'Knowledge Base Upload', 'Analytics Dashboard', '2-week delivery'],
  },
  {
    name: 'EdTech Platform',
    price: 59999,
    badge: null,
    highlight: false,
    description: 'Full learning management system with AI quiz generation, video hosting, and student tracking.',
    features: ['Course Builder + Video Upload', 'AI Quiz Generator', 'Student Progress Dashboard', 'Payment Gateway', 'Certificate System', '3-week delivery'],
  },
  {
    name: 'Healthcare AI Suite',
    price: 74999,
    badge: null,
    highlight: false,
    description: 'Appointment booking, electronic health records, and AI symptom checker for clinics and hospitals.',
    features: ['Appointment + Queue System', 'Patient Health Records', 'AI Symptom Checker', 'Doctor Portal + Reports', 'WhatsApp Reminders', '3-week delivery'],
  },
  {
    name: 'Real Estate AI',
    price: 44999,
    badge: null,
    highlight: false,
    description: 'Property listing platform with AI price prediction, lead management, and virtual tour builder.',
    features: ['Property Listing + Search', 'AI Price Predictor', 'Lead CRM Dashboard', 'Virtual Tour Integration', 'WhatsApp Lead Notifications', '2-week delivery'],
  },
  {
    name: 'Enterprise AI Suite',
    price: 0,
    badge: 'Enterprise',
    highlight: false,
    description: 'Bespoke deep learning pipelines, custom LLM fine-tuning, and cloud-scale deployment for large teams.',
    features: ['Custom Neural Networks', 'LLM Fine-tuning (Gemini/GPT)', 'Dockerized Deployment', 'CI/CD Pipeline', 'Dedicated Support + SLA', 'Flexible timeline'],
  },
];

const { data, error } = await supabase.from('packages').insert(packages).select();

if (error) {
  console.error('FAILED:', error.message, '|', error.code, '|', error.details);
} else {
  console.log(`SUCCESS: Inserted ${data.length} packages`);
  data.forEach(p => console.log(` + ${p.name} (price=${p.price})`));
}
