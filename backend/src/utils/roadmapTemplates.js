/**
 * Category-specific roadmap prompt templates.
 * Each template provides context to the Gemini API for generating
 * a category-relevant execution roadmap.
 */

const templates = {
  SaaS: `You are generating a roadmap for a SaaS (Software as a Service) startup.
Focus on: subscription model setup, cloud infrastructure, onboarding flows, churn reduction, MRR growth, and integrations.
Key tools to consider: Stripe for billing, Intercom for support, Mixpanel for analytics, AWS/GCP/Azure for hosting, Segment for data.
Phase milestones should reflect SaaS-specific tasks like setting up a free trial, building a pricing page, implementing usage tracking, and establishing customer success processes.`,

  Marketplace: `You are generating a roadmap for a Marketplace startup (connecting buyers and sellers).
Focus on: solving the chicken-and-egg problem, supply-side acquisition, demand-side growth, trust & safety, payment escrow, and liquidity.
Key tools to consider: Stripe Connect for split payments, Twilio for messaging, Algolia for search, Segment for analytics.
Phase milestones should reflect marketplace-specific tasks like onboarding first 10 sellers, acquiring first 50 buyers, implementing reviews/ratings, and achieving GMV targets.`,

  'Mobile App': `You are generating a roadmap for a Mobile App startup.
Focus on: app store optimization (ASO), iOS and Android development, push notifications, in-app purchases, retention loops, and crash monitoring.
Key tools to consider: React Native or Flutter for cross-platform, Firebase for backend, RevenueCat for subscriptions, Amplitude for analytics, Sentry for error tracking.
Phase milestones should reflect mobile-specific tasks like submitting to app stores, achieving a target DAU, implementing push notification campaigns, and optimizing app store ratings.`,

  Hardware: `You are generating a roadmap for a Hardware startup.
Focus on: prototyping, manufacturing partnerships, supply chain, FCC/CE certification, crowdfunding, and distribution channels.
Key tools to consider: Altium for PCB design, Fusion 360 for CAD, Kickstarter/Indiegogo for crowdfunding, Flexport for logistics, Shopify for DTC sales.
Phase milestones should reflect hardware-specific tasks like completing a working prototype, passing regulatory certification, launching a crowdfunding campaign, and establishing a manufacturing partner.`,

  General: `You are generating a roadmap for a startup.
Focus on: customer discovery, MVP development, go-to-market strategy, early traction, and scaling.
Key tools to consider: tools appropriate for the startup's specific domain, analytics platforms, CRM systems, and communication tools.
Phase milestones should reflect general startup best practices: validating the problem, building an MVP, acquiring first paying customers, and achieving product-market fit.`,
};

/**
 * Get a category-specific prompt template for roadmap generation.
 * Falls back to the General template if no match is found.
 * @param {string} category - The idea's category
 * @returns {string} A prompt string to include in the Gemini API call
 */
function getTemplate(category) {
  if (!category) return templates.General;
  const normalized = category.trim();
  return templates[normalized] || templates.General;
}

module.exports = { getTemplate };
