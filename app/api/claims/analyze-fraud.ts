import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API with the correct configuration
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface FraudAnalysisResult {
  fraudRiskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyFindings: string[];
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
}

function cleanJsonResponse(text: string): string {
  // Remove any markdown code block syntax
  text = text.replace(/```json\s*|\s*```/g, '');
  // Extract just the JSON object if present
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    text = jsonMatch[0];
  }
  // Clean up whitespace and formatting
  return text
    .trim()
    .replace(/[\n\r\t]/g, ' ')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/([{[,:])\s+/g, '$1')
    .replace(/\s+([}\],:])/g, '$1');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received request body:', req.body);

    if (!req.body?.claimData) {
      return res.status(400).json({ error: 'Missing claim data in request' });
    }

    const { claimData } = req.body;

    const requiredFields = ['claimType', 'dateOfIncident', 'incidentLocation', 'incidentDescription', 'claimAmount'];
    const missingFields = requiredFields.filter(field => !claimData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missingFields });
    }

    const prompt = `Analyze this insurance claim for fraud risk. Respond with ONLY a JSON object in this exact format:
{
  "fraudRiskScore": <number between 0-100>,
  "riskLevel": <"LOW" if score < 40 | "MEDIUM" if score 40-70 | "HIGH" if score > 70>,
  "keyFindings": [<list of string observations>],
  "recommendation": <"APPROVE" if LOW | "REVIEW" if MEDIUM | "REJECT" if HIGH>
}

Claim Details:
- Type: ${claimData.claimType}
- Date: ${claimData.dateOfIncident}
- Location: ${claimData.incidentLocation}
- Description: ${claimData.incidentDescription}
- Amount: ${claimData.claimAmount}

Consider:
1. Amount reasonability
2. Description consistency
3. Timing patterns
4. Location plausibility
5. Common fraud indicators

IMPORTANT: Return ONLY the JSON object, no other text.`;

    console.log('Sending prompt to Gemini:', prompt);

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt
    });

    if (!result.text) {
      throw new Error('No response from Gemini API');
    }

    const analysisText = result.text;
    console.log('Raw Gemini response:', analysisText);

    try {
      const cleanedJson = cleanJsonResponse(analysisText);
      console.log('Cleaned JSON:', cleanedJson);

      const analysis = JSON.parse(cleanedJson) as FraudAnalysisResult;
      console.log('Parsed analysis:', analysis);

      if (
        typeof analysis.fraudRiskScore !== 'number' ||
        !analysis.riskLevel ||
        !Array.isArray(analysis.keyFindings) ||
        !analysis.recommendation
      ) {
        console.error('Invalid analysis structure:', analysis);
        throw new Error('Invalid analysis structure');
      }

      // Ensure score is between 0 and 100
      analysis.fraudRiskScore = Math.max(0, Math.min(100, analysis.fraudRiskScore));

      // Validate and correct risk level if needed
      if (!['LOW', 'MEDIUM', 'HIGH'].includes(analysis.riskLevel)) {
        analysis.riskLevel = analysis.fraudRiskScore < 40 ? 'LOW' :
                           analysis.fraudRiskScore > 70 ? 'HIGH' : 'MEDIUM';
      }

      // Validate and correct recommendation if needed
      if (!['APPROVE', 'REVIEW', 'REJECT'].includes(analysis.recommendation)) {
        analysis.recommendation = analysis.riskLevel === 'LOW' ? 'APPROVE' :
                                analysis.riskLevel === 'HIGH' ? 'REJECT' : 'REVIEW';
      }

      console.log('Final analysis:', analysis);
      return res.status(200).json(analysis);
    } catch (error) {
      console.error('JSON parsing failed:', error);
      console.error('Failed text:', analysisText);
      
      // Return a fallback response if parsing fails
      const fallback: FraudAnalysisResult = {
        fraudRiskScore: 50,
        riskLevel: 'MEDIUM',
        keyFindings: [
          'Fraud analysis failed - manual review required',
          'Response parsing error - check logs for details'
        ],
        recommendation: 'REVIEW'
      };
      
      return res.status(200).json(fallback);
    }
  } catch (error: any) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Failed to analyze claim',
      details: error.message
    });
  }
}