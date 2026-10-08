import fs from 'fs';
import path from 'path';

// Helper to generate a minimal standard conforming PDF with arbitrary text
function createSimplePdf(title: string, content: string): Buffer {
  const sanitizedContent = content
    .replace(/[\\()]/g, '')
    .split('\n')
    .slice(0, 45)
    .map((line, idx) => `1 0 0 1 50 ${750 - idx * 16} Tm (${line.slice(0, 90)}) Tj`)
    .join('\n');

  const streamContent = `BT
/F1 10 Tf
${sanitizedContent}
ET`;

  const streamLength = Buffer.byteLength(streamContent);

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000${(300 + streamLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF`;

  return Buffer.from(pdf, 'utf-8');
}

const dir = path.resolve(process.cwd(), 'sample_papers');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const fraudPaper = `DUAL-ATTENTION AUTOENCODER FOR REAL-TIME TRANSACTION FRAUD DETECTION
Dr. Elena Rostova, Zurich Institute of Technology (2026)

ABSTRACT:
Payment fraud detection systems must balance high true-positive detection
against catastrophic false-positive customer disruptions. Extreme class imbalance
severely undermines conventional supervised classifiers. In this paper, we propose
Dual-Attention Autoencoder (DA-AE), an unsupervised reconstruction and latent attention model.

1. RESEARCH PROBLEM:
Severe class imbalance (<0.2% fraud) and adversarial feature shift in credit transaction streams.

2. OBJECTIVE:
Construct an unsupervised dual-attention autoencoder that reconstructs normal transaction
manifolds and flags anomalous reconstruction errors in real-time (<15ms).

3. DATASET:
Credit Card Fraud benchmark comprising 284,807 transactions. Features: PCA latent vectors V1..V28,
transaction Amount, and timestamp.

4. METHODOLOGY & ARCHITECTURE:
- RobustScaler applied to Amount and Time to mitigate outliers.
- 4-layer Encoder (29 -> 64 -> 32 -> 16) with multi-head latent attention weighting.
- Symmetric Decoder and Mean Squared Reconstruction Error thresholding.

5. EVALUATION:
AUPRC: 0.884, F1-Score: 0.842, p99 Latency: <12ms.`;

fs.writeFileSync(path.join(dir, 'DeepFraud_Dual_Attention_Paper.pdf'), createSimplePdf('DeepFraud', fraudPaper));
console.log('Sample research paper PDF generated at sample_papers/DeepFraud_Dual_Attention_Paper.pdf');
