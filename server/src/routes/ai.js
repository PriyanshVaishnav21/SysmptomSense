const express = require('express');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY');
  return new OpenAI({ apiKey: key });
}

router.post('/analyze-symptoms', auth, async (req, res) => {
  const { symptoms, description, language = 'english' } = req.body || {};
  if ((!symptoms || symptoms.length === 0) && !description) {
    return res.status(400).json({ error: 'Either symptoms or description is required' });
  }

  const lang = String(language || 'english').toLowerCase();
  const now = new Date().toISOString();

  let normalized = [];
  try {
    const openai = getOpenAI();
    const symptomsText = Array.isArray(symptoms) && symptoms.length > 0
      ? `Symptoms reported: ${symptoms.join(', ')}. `
      : '';
    const descriptionText = description ? `Patient description: ${description}. ` : '';
    const systemPrompt = `
      You are an AI medical assistant that analyzes symptoms to suggest possible conditions.
      For each condition, provide:
      - conditionName (string)
      - confidenceScore (number 1-100)
      - severity ("mild" | "moderate" | "severe")
      - description (string)
      - advice (string)
      Respond ONLY as JSON: {"conditions":[{...}]}
      Detect Hindi/Hinglish and respond in the same language if applicable.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `${symptomsText}${descriptionText}Please analyze these symptoms and provide possible conditions. Respond in the same language as the input (Hindi, Hinglish, or English).`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const analysisContent = response.choices?.[0]?.message?.content || '{}';
    let analysisResults;
    try {
      analysisResults = JSON.parse(analysisContent);
      if (!analysisResults?.conditions || !Array.isArray(analysisResults.conditions)) {
        analysisResults = { conditions: [] };
      }
    } catch {
      analysisResults = { conditions: [] };
    }

    normalized = (analysisResults.conditions || []).map((c) => ({
      id: uuidv4(),
      conditionName: c.conditionName || 'Unknown condition',
      confidenceScore: typeof c.confidenceScore === 'number' ? c.confidenceScore : 50,
      severity: ['mild', 'moderate', 'severe'].includes((c.severity || '').toLowerCase()) ? (c.severity || 'moderate') : 'moderate',
      description: c.description || 'No detailed description available for this condition.',
      advice: c.advice || 'Please consult with a healthcare professional.',
      createdAt: now,
    }));
  } catch (e) {
    console.error('OpenAI analyze-symptoms error', e);
    normalized = [];
  }

  if (normalized.length === 0) {
    normalized.push({
      id: uuidv4(),
      conditionName: 'Analysis Failed',
      confidenceScore: 0,
      severity: 'moderate',
      description: lang.includes('hindi')
        ? 'हमारी प्रणाली आपके लक्षणों का विश्लेषण करने में त्रुटि का सामना कर रही है।'
        : 'Our system encountered an error analyzing your symptoms.',
      advice: lang.includes('hindi')
        ? 'कृपया फिर से प्रयास करें या स्वास्थ्य देखभाल पेशेवर से परामर्श करें।'
        : 'Please try again or consult with a healthcare professional.',
      createdAt: now,
    });
  }

  return res.json(normalized);
});

router.post('/analyze-pill', auth, async (req, res) => {
  try {
    const { image, pillName } = req.body || {};
    if (!image && !pillName) {
      return res.status(400).json({ error: 'Either image data or pill name is required' });
    }
    const openai = getOpenAI();

    if (image) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a pharmaceutical expert. Analyze images of medications and provide JSON {"name":"","purpose":"","dosage":"","instructions":"","warnings":["..."]}',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Identify this pill/medication and provide details about it.' },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });
      const content = response.choices?.[0]?.message?.content || '{}';
      const analysisResult = JSON.parse(content);
      analysisResult.imageUrl = image;
      return res.json(analysisResult);
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a pharmaceutical expert. Provide details about medications by name as JSON {"name":"","purpose":"","dosage":"","instructions":"","warnings":["..."]}',
          },
          { role: 'user', content: `Provide information about the medication called: ${pillName}` },
        ],
        response_format: { type: 'json_object' },
      });
      const content = response.choices?.[0]?.message?.content || '{}';
      const analysisResult = JSON.parse(content);
      return res.json(analysisResult);
    }
  } catch (e) {
    console.error('analyze-pill error', e);
    res.status(500).json({ error: 'AI error' });
  }
});

module.exports = router;
