const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Call the Gemini API with a prompt and return the text response.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function callGemini(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Strip markdown code fences from a raw Gemini response.
 * @param {string} raw
 * @returns {string}
 */
function stripCodeFences(raw) {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
}

/**
 * Parse and validate the JSON structure of a validation response.
 * Retries once with a stricter prompt if the initial parse fails.
 * @param {string} raw - Raw text from Gemini
 * @returns {object} Parsed ValidationReport data
 */
function parseValidationResponse(raw) {
  const cleaned = stripCodeFences(raw);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse validation response as JSON: ${e.message}`);
  }

  // Validate required fields
  const required = ['score', 'dimensionScores', 'pivotRecommended', 'swot', 'competitors', 'persona', 'checklist'];
  for (const field of required) {
    if (parsed[field] === undefined) {
      throw new Error(`Validation response missing required field: ${field}`);
    }
  }

  const ds = parsed.dimensionScores;
  const dimensionFields = ['marketDemand', 'competitiveGap', 'executionFeasibility', 'revenuePotential', 'timingTrends'];
  for (const f of dimensionFields) {
    if (ds[f] === undefined) {
      throw new Error(`dimensionScores missing field: ${f}`);
    }
  }

  const swot = parsed.swot;
  for (const key of ['strengths', 'weaknesses', 'opportunities', 'threats']) {
    if (!Array.isArray(swot[key])) {
      throw new Error(`swot.${key} must be an array`);
    }
  }

  if (!Array.isArray(parsed.competitors)) {
    throw new Error('competitors must be an array');
  }

  if (!Array.isArray(parsed.checklist)) {
    throw new Error('checklist must be an array');
  }

  if (!parsed.pivotSuggestions) {
    parsed.pivotSuggestions = [];
  }

  return parsed;
}

/**
 * Parse and validate the JSON structure of a roadmap response.
 * @param {string} raw - Raw text from Gemini
 * @returns {object} Parsed Roadmap data
 */
function parseRoadmapResponse(raw) {
  const cleaned = stripCodeFences(raw);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse roadmap response as JSON: ${e.message}`);
  }

  if (!Array.isArray(parsed.phases)) {
    throw new Error('Roadmap response missing phases array');
  }

  if (parsed.phases.length !== 4) {
    throw new Error(`Roadmap must have exactly 4 phases, got ${parsed.phases.length}`);
  }

  for (const phase of parsed.phases) {
    const phaseRequired = ['phaseNumber', 'title', 'weekRange', 'goal', 'milestones', 'successMetrics', 'recommendedTools'];
    for (const field of phaseRequired) {
      if (phase[field] === undefined) {
        throw new Error(`Phase missing required field: ${field}`);
      }
    }
    if (!Array.isArray(phase.milestones)) {
      throw new Error('Phase milestones must be an array');
    }
  }

  return parsed;
}

/**
 * Parse and validate the JSON structure of a case study response.
 * @param {string} raw - Raw text from Gemini
 * @returns {object} Parsed CaseStudy data
 */
function parseCaseStudyResponse(raw) {
  const cleaned = stripCodeFences(raw);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Failed to parse case study response as JSON: ${e.message}`);
  }

  if (!Array.isArray(parsed.competitors)) {
    throw new Error('Case study response missing competitors array');
  }

  if (parsed.competitors.length !== 3) {
    throw new Error(`Case study must have exactly 3 competitors, got ${parsed.competitors.length}`);
  }

  for (const competitor of parsed.competitors) {
    const required = ['name', 'foundedYear', 'founders', 'story', 'timeline', 'keyLessons', 'currentStatus', 'differentiators'];
    for (const field of required) {
      if (competitor[field] === undefined) {
        throw new Error(`Competitor missing required field: ${field}`);
      }
    }
    if (!Array.isArray(competitor.timeline)) {
      throw new Error('Competitor timeline must be an array');
    }
    if (!Array.isArray(competitor.keyLessons)) {
      throw new Error('Competitor keyLessons must be an array');
    }
    if (!Array.isArray(competitor.differentiators)) {
      throw new Error('Competitor differentiators must be an array');
    }
  }

  return parsed;
}

/**
 * Call Gemini with automatic retry on JSON parse failure.
 * On first failure, retries with a stricter prompt appended.
 * Throws on second failure.
 * @param {string} prompt
 * @param {'validation'|'roadmap'|'caseStudy'} type
 * @returns {Promise<object>}
 */
async function callGeminiWithRetry(prompt, type) {
  const parsers = {
    validation: parseValidationResponse,
    roadmap: parseRoadmapResponse,
    caseStudy: parseCaseStudyResponse,
  };
  const parser = parsers[type];

  let raw;
  try {
    raw = await callGemini(prompt);
    return parser(raw);
  } catch (firstError) {
    // Retry with stricter prompt
    const stricterPrompt = `${prompt}\n\nCRITICAL: Your previous response could not be parsed as JSON. Return ONLY raw JSON with no markdown, no code blocks, no explanation. Start your response with { and end with }.`;
    try {
      raw = await callGemini(stricterPrompt);
      return parser(raw);
    } catch (secondError) {
      throw new Error(`Gemini returned unparseable JSON after retry: ${secondError.message}`);
    }
  }
}

module.exports = {
  callGemini,
  callGeminiWithRetry,
  parseValidationResponse,
  parseRoadmapResponse,
  parseCaseStudyResponse,
};
