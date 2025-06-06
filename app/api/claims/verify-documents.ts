import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface DocumentVerificationResult {
  isValid: boolean;
  confidence: number;
  findings: string[];
  matchScore: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claimId, formData, documents } = req.body;

    if (!claimId || !formData || !documents) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const results: {
      identityVerification?: DocumentVerificationResult;
      invoiceVerification?: DocumentVerificationResult;
      supportingDocsVerification?: DocumentVerificationResult;
    } = {};

    // Verify identity documents
    if (documents.identityDocs) {
      const prompt = `Analyze this identity document and verify if it matches the provided form data.
Form data:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Document text content:
${documents.identityDocs.text}

Respond with ONLY a JSON object in this format:
{
  "isValid": <boolean>,
  "confidence": <number between 0-100>,
  "findings": [<list of string observations>],
  "matchScore": <number between 0-100 indicating how well the document matches the form data>
}

Consider:
1. Name matching
2. Document authenticity indicators
3. Data consistency
4. Common forgery signs

Return ONLY the JSON object, no other text.`;

      const result = await model.generateContent(prompt);

      results.identityVerification = JSON.parse(result.response.text() || '{}');
    }

    // Verify invoices
    if (documents.invoices) {
      const prompt = `Analyze this invoice document and verify if it matches the claimed amount and incident.
Form data:
- Claim Amount: ${formData.claimAmount}
- Incident Date: ${formData.dateOfIncident}
- Incident Type: ${formData.claimType}

Invoice text content:
${documents.invoices.text}

Respond with ONLY a JSON object in this format:
{
  "isValid": <boolean>,
  "confidence": <number between 0-100>,
  "findings": [<list of string observations>],
  "matchScore": <number between 0-100 indicating how well the invoice matches the claim details>
}

Consider:
1. Amount matching
2. Date consistency
3. Service/product relevance to claim type
4. Invoice authenticity indicators
5. Common invoice fraud patterns

Return ONLY the JSON object, no other text.`;

      const result = await model.generateContent(prompt);

      results.invoiceVerification = JSON.parse(result.response.text() || '{}');
    }

    // Verify supporting documents (police reports, images, etc.)
    if (documents.supportingDocs) {
      const prompt = `Analyze these supporting documents and verify if they corroborate the claim details.
Form data:
- Incident Date: ${formData.dateOfIncident}
- Incident Location: ${formData.incidentLocation}
- Incident Description: ${formData.incidentDescription}
- Claim Type: ${formData.claimType}

Document text content:
${documents.supportingDocs.text}

Respond with ONLY a JSON object in this format:
{
  "isValid": <boolean>,
  "confidence": <number between 0-100>,
  "findings": [<list of string observations>],
  "matchScore": <number between 0-100 indicating how well the documents support the claim>
}

Consider:
1. Date and location consistency
2. Incident description matching
3. Document authenticity
4. Photo metadata if available
5. Common document manipulation signs

Return ONLY the JSON object, no other text.`;

      const result = await model.generateContent(prompt);

      results.supportingDocsVerification = JSON.parse(result.response.text() || '{}');
    }

    // Store verification results in the database
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('claim_verifications')
      .insert([{
        claim_id: claimId,
        identity_verification: results.identityVerification,
        invoice_verification: results.invoiceVerification,
        supporting_docs_verification: results.supportingDocsVerification,
        overall_confidence: calculateOverallConfidence(results),
        verification_status: determineVerificationStatus(results)
      }]);

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to store verification results' });
    }

    return res.status(200).json({
      message: 'Document verification completed',
      results
    });

  } catch (error: any) {
    console.error('Document verification error:', error);
    return res.status(500).json({
      error: 'Failed to verify documents',
      details: error.message
    });
  }
}

function calculateOverallConfidence(results: any): number {
  const scores = [];
  if (results.identityVerification) scores.push(results.identityVerification.confidence);
  if (results.invoiceVerification) scores.push(results.invoiceVerification.confidence);
  if (results.supportingDocsVerification) scores.push(results.supportingDocsVerification.confidence);
  
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
}

function determineVerificationStatus(results: any): string {
  const threshold = 70; // Confidence threshold for automatic approval
  
  if (!Object.keys(results).length) return 'PENDING';
  
  const failedVerifications = Object.values(results).filter((r: any) => !r.isValid);
  if (failedVerifications.length > 0) return 'REJECTED';
  
  const avgConfidence = calculateOverallConfidence(results);
  return avgConfidence >= threshold ? 'VERIFIED' : 'NEEDS_REVIEW';
} 