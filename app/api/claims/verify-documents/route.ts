import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSupabase } from '../../../../lib/supabase';
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, formData, documents } = body;

    if (!claimId || !formData || !documents) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
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
      return NextResponse.json({ error: 'Failed to store verification results' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Document verification completed',
      results
    }, { status: 200 });

  } catch (error: any) {
    console.error('Document verification error:', error);
    return NextResponse.json({
      error: 'Failed to verify documents',
      details: error.message
    }, { status: 500 });
  }
}

function calculateOverallConfidence(results: any): number {
  const scores = [];
  if (results.identityVerification?.confidence) scores.push(results.identityVerification.confidence);
  if (results.invoiceVerification?.confidence) scores.push(results.invoiceVerification.confidence);
  if (results.supportingDocsVerification?.confidence) scores.push(results.supportingDocsVerification.confidence);
  
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
}

function determineVerificationStatus(results: any): string {
  const confidence = calculateOverallConfidence(results);
  if (confidence >= 80) return 'VERIFIED';
  if (confidence >= 50) return 'NEEDS_REVIEW';
  return 'REJECTED';
} 