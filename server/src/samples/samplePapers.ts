export interface SamplePaperDefinition {
  id: string;
  title: string;
  domain: string;
  abstract: string;
  fullText: string;
  defaultAnalysis: any;
  defaultTasks: any[];
  defaultCode: any[];
  prototypeConfig: any;
  testSuite: {
    attempt1Error: {
      type: string;
      failedTest: string;
      rawLog: string;
      diagnosis: string;
      fixDescription: string;
      patch: string;
    };
    attempt2SuccessLogs: string;
  };
}

export const SAMPLE_PAPERS: Record<string, SamplePaperDefinition> = {
  'fraud-detection': {
    id: 'fraud-detection',
    title: 'Dual-Attention Autoencoder for Real-Time Transaction Fraud Detection',
    domain: 'Financial AI / Anomaly Detection',
    abstract: 'Financial institutions suffer billions of dollars in losses annually due to fraudulent credit card transactions. Extreme class imbalance (often <0.1% fraud) and subtle adversarial shifts severely undermine conventional supervised classifiers. In this paper, we propose Dual-Attention Autoencoder (DA-AE), an unsupervised reconstruction and latent attention model. The encoder maps 28 anonymized PCA latent dimensions and transaction amounts to a latent subspace, while a multi-head channel attention mechanism highlights anomalous deviations. Evaluation on the European Credit Card Benchmark reveals an AUPRC of 0.884, surpassing standard Isolation Forests and baseline Autoencoders by 14.2% while maintaining <12ms p99 inference latency.',
    fullText: `DUAL-ATTENTION AUTOENCODER FOR REAL-TIME TRANSACTION FRAUD DETECTION
Dr. Elena Rostova, Marcus Vance, Department of Computer Science & Quantitative Finance, Zurich Institute of Technology

1. INTRODUCTION & PROBLEM STATEMENT
Payment fraud detection systems must balance high true-positive detection against catastrophic false-positive customer disruptions. Class imbalance is severe: benign transactions comprise 99.82% of observed events. Conventional Random Forests suffer from concept drift and brittle thresholding.

2. OBJECTIVE
To develop an end-to-end autonomous anomaly detection pipeline using an attentive latent autoencoder that reconstructs normal transaction manifolds and flags high reconstruction errors coupled with attention weight variance as fraudulent indicators.

3. DATASET SPECIFICATION
We evaluate on the Credit Card Fraud benchmark comprising 284,807 transactions. Features include:
- Time: elapsed seconds from first transaction
- V1 to V28: principal components obtained via PCA due to confidentiality
- Amount: transaction currency amount in EUR
- Class: 1 for fraudulent transaction, 0 otherwise

4. METHODOLOGY & ARCHITECTURE
- Normalization: RobustScaler applied to Amount and Time to mitigate heavy-tailed outliers.
- Architecture:
  * Input dimension: 29 features (V1-V28 + normalized amount)
  * Encoder: Dense(64, activation='relu') -> BatchNormalization -> Dropout(0.1) -> Dense(32, activation='relu') -> Latent bottleneck(16)
  * Attention Gate: Multi-head latent attention weight scaling
  * Decoder: Dense(32, activation='relu') -> Dense(64, activation='relu') -> Output(29, activation='linear')
- Loss Function: Mean Squared Reconstruction Error with L2 regularization
- Decision Boundary: Quantile thresholding at 98.5th percentile of validation reconstruction loss.

5. IMPLEMENTATION SPECIFICATIONS
- Language: TypeScript / Python
- Preprocessing: Standardize amount, clip extreme values [-10, 10]
- Evaluation: Precision, Recall, F1-Score, AUPRC, Latency (<20ms).`,
    defaultAnalysis: {
      title: 'Dual-Attention Autoencoder for Real-Time Transaction Fraud Detection',
      researchProblem: 'Severe class imbalance (<0.2% fraud) and adversarial feature shift in credit transaction streams causing high false alarms in traditional classifiers.',
      objective: 'Construct an unsupervised dual-attention autoencoder that reconstructs normal transaction manifolds and flags anomalous reconstruction errors in real-time (<15ms).',
      methodology: 'Latent space encoding (29 -> 64 -> 32 -> 16), multi-head channel attention weighting, symmetric decoder reconstruction, and quantile-based anomaly thresholding.',
      algorithms: ['Dual-Attention Autoencoder', 'Robust Scaler Normalization', 'Mean Squared Error Anomaly Thresholding', 'Precision-Recall AUC Optimization'],
      dataset: {
        name: 'Credit Card Fraud Benchmark (284,807 instances)',
        description: '28 anonymized PCA features (V1-V28) plus transaction amount and timestamp, with binary fraud ground truth.',
        features: ['V1_PCA', 'V2_PCA', 'V3_PCA', 'V4_PCA', 'V11_PCA', 'V14_PCA', 'V17_PCA', 'Amount_EUR', 'Time_Delta'],
        targetColumn: 'is_fraud'
      },
      inputFeatures: ['V1', 'V2', 'V3', 'V4', 'V11', 'V14', 'V17', 'Amount', 'TimeDelta'],
      output: 'Binary classification [0 = Legitimate, 1 = Fraudulent] + Anomaly Risk Score [0.0 - 1.0] + Latency (ms)',
      evaluationMetrics: ['Area Under Precision-Recall Curve (AUPRC: 0.884)', 'F1-Score (0.842)', 'Inference Latency (<12ms)', 'False Positive Rate (<0.1%)'],
      keyImplementationSteps: [
        'Ingest raw PCA components and normalize transaction amount',
        'Implement 4-layer Encoder with LeakyReLU and Batch Normalization',
        'Incorporate multi-head latent attention vector weighting',
        'Implement symmetric Decoder and compute Mean Squared Reconstruction Loss',
        'Compute dynamic anomaly threshold based on 98.5th percentile baseline',
        'Expose real-time inference prediction scoring interface'
      ],
      assumptions: ['PCA components capture dominant orthogonal variance', 'Benign transactions follow compact manifold in latent space', 'Anomalies exhibit higher reconstruction error'],
      potentialChallenges: ['Catastrophic false-positive burst during holiday shopping volumes', 'High sensitivity to unscaled transaction amounts', 'Latency constraints in synchronous payment gateway']
    },
    defaultTasks: [
      {
        id: 'task-1',
        order: 1,
        title: 'Data Ingestion & Robust Scaler Preprocessing',
        description: 'Normalize transaction amounts and handle PCA latent vectors V1..V28 safely.',
        fileTarget: 'data/preprocessor.ts',
        dependencies: [],
        status: 'pending'
      },
      {
        id: 'task-2',
        order: 2,
        title: 'Dual-Attention Autoencoder Core Architecture',
        description: 'Implement Encoder-Decoder layers with attention gating and MSE reconstruction loss.',
        fileTarget: 'src/model.ts',
        dependencies: ['task-1'],
        status: 'pending'
      },
      {
        id: 'task-3',
        order: 3,
        title: 'Dynamic Anomaly Scoring & Thresholding Engine',
        description: 'Implement quantile thresholding logic to calculate fraud probability from reconstruction divergence.',
        fileTarget: 'src/detector.ts',
        dependencies: ['task-2'],
        status: 'pending'
      },
      {
        id: 'task-4',
        order: 4,
        title: 'Prototype Inference API & Presets Handler',
        description: 'Build prediction engine accepting transaction vectors and returning confidence score and anomaly tag.',
        fileTarget: 'src/inference.ts',
        dependencies: ['task-3'],
        status: 'pending'
      },
      {
        id: 'task-5',
        order: 5,
        title: 'Automated Unit & Boundary Test Suite',
        description: 'Create end-to-end test verifying reconstruction math, zero-division safety, and outlier sensitivity.',
        fileTarget: 'tests/detector.test.ts',
        dependencies: ['task-4'],
        status: 'pending'
      }
    ],
    prototypeConfig: {
      name: 'DeepFraud Real-Time Verification Engine',
      description: 'Interactive inference testbench powered by the synthesized Dual-Attention Autoencoder.',
      modelType: 'Dual-Attention Autoencoder (DA-AE)',
      metrics: {
        'Validation AUPRC': '0.884',
        'Recall @ 0.05 FPR': '92.4%',
        'Median Latency': '4.8 ms',
        'Reconstruction MSE Baseline': '0.0142'
      },
      inputs: [
        { name: 'amount', type: 'number', label: 'Transaction Amount ($)', defaultValue: 149.50, min: 1, max: 10000, step: 0.5, description: 'Billed transaction value' },
        { name: 'v14', type: 'number', label: 'V14 PCA Component (Key Fraud Indicator)', defaultValue: -0.25, min: -15, max: 5, step: 0.1, description: 'Latent feature strongly correlated with fraud in research benchmark' },
        { name: 'v17', type: 'number', label: 'V17 PCA Component (Account Velocity)', defaultValue: 0.12, min: -15, max: 5, step: 0.1, description: 'Latent feature tracking transaction sequence deviation' },
        { name: 'v4', type: 'number', label: 'V4 PCA Component (Geographic Discrepancy)', defaultValue: 0.45, min: -5, max: 10, step: 0.1, description: 'Latent vector representing distance & device fingerprint' },
        { name: 'timeDelta', type: 'number', label: 'Seconds Since Prior Transaction', defaultValue: 3600, min: 1, max: 86400, step: 10, description: 'Inter-arrival timing window' }
      ],
      samplePresets: [
        {
          name: 'Normal Everyday Coffee Purchase',
          description: 'Standard benign transaction with balanced PCA coordinates and modest amount.',
          values: { amount: 4.75, v14: 0.15, v17: -0.08, v4: 0.12, timeDelta: 7200 }
        },
        {
          name: 'Stolen Card Rapid High-Value Outlier',
          description: 'Adversarial transaction featuring extreme negative V14/V17 divergence and rapid velocity.',
          values: { amount: 3450.00, v14: -8.92, v17: -6.45, v4: 4.80, timeDelta: 12 }
        },
        {
          name: 'Borderline Suspicious Foreign Purchase',
          description: 'Unusual amount and geographic drift (V4 high), triggering moderate attention weights.',
          values: { amount: 720.00, v14: -2.30, v17: -1.80, v4: 2.90, timeDelta: 300 }
        }
      ]
    },
    defaultCode: [
      {
        path: 'src/model.ts',
        language: 'typescript',
        description: 'Autoencoder neural weights and attention gate computation',
        content: `export class DualAttentionAutoencoder {
  private weights = {
    encoderW1: [[0.15, -0.22, 0.41], [0.08, 0.31, -0.19], [-0.35, 0.14, 0.28]],
    attentionWeights: [0.38, 0.42, 0.20],
    threshold: 0.65
  };

  /**
   * Forward pass: computes attentive latent compression and reconstruction loss
   */
  public computeReconstructionError(features: number[]): { error: number; attentionScore: number } {
    // Normalization check
    const normalized = features.map(f => Math.tanh(f / 2.0));
    
    // Latent attentive projection
    let latentEnergy = 0;
    for (let i = 0; i < Math.min(features.length, 3); i++) {
      latentEnergy += Math.abs(normalized[i]) * (this.weights.attentionWeights[i] || 0.33);
    }

    // Reconstruction discrepancy
    const error = Math.sqrt(normalized.reduce((acc, val) => acc + (val * val * 0.18), 0)) * (1.0 + latentEnergy);
    return { error, attentionScore: latentEnergy };
  }
}`
      },
      {
        path: 'src/detector.ts',
        language: 'typescript',
        description: 'Anomaly scorer with quantile thresholding',
        content: `import { DualAttentionAutoencoder } from './model';

export class FraudDetector {
  private model = new DualAttentionAutoencoder();
  private anomalyThreshold = 0.58;

  public evaluateTransaction(features: { amount: number; v14: number; v17: number; v4: number; timeDelta: number }) {
    // Feature vector synthesis
    const normAmount = Math.log1p(Math.max(0, features.amount)) / 10.0;
    const vector = [features.v14, features.v17, features.v4, normAmount];
    
    const { error, attentionScore } = this.model.computeReconstructionError(vector);
    const fraudProbability = Math.min(0.995, Math.max(0.002, error / (error + 0.35)));
    const isFraud = fraudProbability >= this.anomalyThreshold;

    return {
      isFraud,
      fraudProbability: parseFloat(fraudProbability.toFixed(4)),
      reconstructionError: parseFloat(error.toFixed(4)),
      attentionScore: parseFloat(attentionScore.toFixed(4)),
      latencyMs: +(Math.random() * 3 + 2.1).toFixed(2),
      verdict: isFraud ? 'REJECT: High Fraud Probability' : 'APPROVE: Legitimate Transaction'
    };
  }
}`
      },
      {
        path: 'tests/detector.test.ts',
        language: 'typescript',
        description: 'Validation suite testing normal vs malicious transaction handling',
        content: `import { FraudDetector } from '../src/detector';

export function runTests(): { total: number; passed: number; failed: number; logs: string[] } {
  const detector = new FraudDetector();
  const logs: string[] = [];
  let passed = 0;
  let failed = 0;

  logs.push('[TEST SUITE] Executing DeepFraud Prototype Verification...');

  // Test 1: Normal transaction
  try {
    const res = detector.evaluateTransaction({ amount: 12.5, v14: 0.1, v17: -0.05, v4: 0.2, timeDelta: 3600 });
    if (!res.isFraud && res.fraudProbability < 0.4) {
      logs.push('✓ Test 1 Passed: Normal transaction correctly flagged as APPROVED.');
      passed++;
    } else {
      logs.push('✗ Test 1 Failed: Normal transaction incorrectly flagged.');
      failed++;
    }
  } catch (err: any) {
    logs.push(\`✗ Test 1 Threw: \${err.message}\`);
    failed++;
  }

  // Test 2: Severe adversarial fraud
  try {
    const res = detector.evaluateTransaction({ amount: 5000, v14: -8.5, v17: -6.2, v4: 4.5, timeDelta: 10 });
    if (res.isFraud && res.fraudProbability > 0.75) {
      logs.push('✓ Test 2 Passed: High-severity anomaly correctly flagged as REJECT.');
      passed++;
    } else {
      logs.push('✗ Test 2 Failed: Fraudulent transaction missed.');
      failed++;
    }
  } catch (err: any) {
    logs.push(\`✗ Test 2 Threw: \${err.message}\`);
    failed++;
  }

  // Test 3: Zero or boundary amount
  try {
    const res = detector.evaluateTransaction({ amount: 0, v14: 0, v17: 0, v4: 0, timeDelta: 0 });
    if (res.fraudProbability >= 0 && res.fraudProbability <= 1) {
      logs.push('✓ Test 3 Passed: Boundary zero values handled gracefully without NaN.');
      passed++;
    } else {
      logs.push('✗ Test 3 Failed: Boundary value caused numerical anomaly.');
      failed++;
    }
  } catch (err: any) {
    logs.push(\`✗ Test 3 Threw: \${err.message}\`);
    failed++;
  }

  return { total: passed + failed, passed, failed, logs };
}`
      },
      {
        path: 'README.md',
        language: 'markdown',
        description: 'Auto-generated documentation and usage guide',
        content: `# DeepFraud: Dual-Attention Autoencoder Implementation

Synthesized autonomously by **Paper2Prototype AI** from research publication.

## Architecture
- 4-layer autoencoder with multi-head latent attention
- Reconstruction error calculated over normalized 29-feature manifold
- Anomaly decision boundary set at 98.5th percentile validation quantile

## Usage
\`\`\`typescript
import { FraudDetector } from './src/detector';
const detector = new FraudDetector();
const result = detector.evaluateTransaction({
  amount: 450.0,
  v14: -4.2,
  v17: -3.1,
  v4: 2.1,
  timeDelta: 45
});
console.log(result.verdict);
\`\`\`
`
      }
    ],
    testSuite: {
      attempt1Error: {
        type: 'Runtime TypeError: DimensionMismatchException',
        failedTest: 'Test 2: High-Severity Anomaly Vector Boundary',
        rawLog: `[TEST SUITE] Executing DeepFraud Prototype Verification...
✓ Test 1 Passed: Normal transaction correctly flagged as APPROVED.
[FATAL ERROR] at model.ts:18:24
TypeError: Cannot read properties of undefined (reading 'attentionWeights')
    at DualAttentionAutoencoder.computeReconstructionError (src/model.ts:18:41)
    at FraudDetector.evaluateTransaction (src/detector.ts:14:28)
    at tests/detector.test.ts:24:21
✗ Test 2 Failed: Unhandled dimension index out of bounds during multi-head attention reduction.
Tests summary: 1 Passed, 2 Failed. Exit code 1.`,
        diagnosis: 'The attention weight vector indexing accessed out-of-bounds index for features length > 3 without boundary fallbacks, resulting in undefined reference during matrix dot product.',
        fixDescription: 'Patched DualAttentionAutoencoder.computeReconstructionError with safe array boundary clamping and default fallback weight tensor: (this.weights.attentionWeights[i] ?? 0.33).',
        patch: `// Applied patch in src/model.ts:
- latentEnergy += Math.abs(normalized[i]) * this.weights.attentionWeights[i];
+ latentEnergy += Math.abs(normalized[i]) * (this.weights.attentionWeights[i] || 0.33);`
      },
      attempt2SuccessLogs: `[TEST SUITE] Executing DeepFraud Prototype Verification (Attempt 2)...
✓ Test 1 Passed: Normal transaction correctly flagged as APPROVED.
✓ Test 2 Passed: High-severity anomaly correctly flagged as REJECT (Confidence: 94.8%, Latency: 3.4ms).
✓ Test 3 Passed: Boundary zero values handled gracefully without NaN.
[SUCCESS] All 3/3 test assertions PASSED. Verification completed in 24ms.`
    }
  },

  'churn-prediction': {
    id: 'churn-prediction',
    title: 'Dynamic Customer Attrition Forecasting via Gradient Boosted Ensembles & Temporal Attention',
    domain: 'Enterprise SaaS / Predictive Analytics',
    abstract: 'Customer churn represents a critical revenue hazard for subscription SaaS platforms. Predicting attrition before contract cancellation requires integrating static customer demographics with dynamic behavioral event sequences. We introduce ChurnGuard, an ensemble architecture combining gradient boosting trees with a temporal engagement decay function. Trained on 50,000 enterprise telemetry accounts, ChurnGuard achieves an AUC-ROC of 0.912 and identifies high-risk churners 45 days prior to contract termination with 87% precision.',
    fullText: `DYNAMIC CUSTOMER ATTRITION FORECASTING VIA GRADIENT BOOSTED ENSEMBLES & TEMPORAL ATTENTION
Dr. Katherine Zhao, Alex Chen, Stanford Predictive Enterprise Lab

1. RESEARCH PROBLEM & MOTIVATION
Subscription software businesses lose up to 15% ARR annually to unaddressed churn. Traditional static logistic regression fails to capture sudden drop-offs in active daily seat utilization or support ticket frustration sentiment.

2. OBJECTIVE
To develop an automated real-time risk scoring engine that decomposes customer behavior into engagement velocity, pricing tier ratio, and support ticket escalation indices to predict 60-day churn likelihood.

3. DATASET & FEATURES
- MonthlyCharges: recurring billing rate ($)
- TotalMonthsTenure: customer age on platform (months)
- ActiveSeatRatio: percentage of licensed seats active this month [0.0 - 1.0]
- SupportTicketsLast30Days: number of technical escalations
- ContractType: Month-to-Month, 1-Year, 2-Year

4. METHODOLOGY
- Feature Transformation: Log transform tenure, exponential moving decay on ticket count.
- Architecture: Gradient Boosted Trees ensemble combined with calibrated sigmoid risk scoring.
- Evaluation Metrics: AUC-ROC (0.912), Top-decile Lift (3.8x), Precision@Top10% (0.871).`,
    defaultAnalysis: {
      title: 'Dynamic Customer Attrition Forecasting via Gradient Boosted Ensembles & Temporal Attention',
      researchProblem: 'Static retention analytics overlook rapid decay in seat utilization and support escalation spikes, missing early 45-day churn intervention windows.',
      objective: 'Create an automated predictive risk scoring pipeline that computes customer churn probability, identify primary risk drivers, and propose retention interventions.',
      methodology: 'Ensemble gradient boosting combined with exponential temporal decay functions, calibrated probability estimation, and SHAP-based feature importance attribution.',
      algorithms: ['Gradient Boosted Decision Trees (GBDT)', 'Exponential Moving Temporal Decay', 'Isotonic Probability Calibration', 'SHAP Attribution'],
      dataset: {
        name: 'Enterprise Telemetry Churn Benchmark (50,000 accounts)',
        description: 'Multi-year SaaS billing, platform usage metrics, customer seat utilization, and support ticket histories.',
        features: ['monthly_charges', 'tenure_months', 'active_seat_ratio', 'support_tickets_30d', 'contract_type'],
        targetColumn: 'churn_occurred_60d'
      },
      inputFeatures: ['Monthly Charges ($)', 'Tenure (Months)', 'Active Seat Ratio', 'Support Tickets (30d)', 'Contract Length'],
      output: 'Churn Probability [0-100%], Risk Category (Low / Medium / Critical), Top Contributing Drivers',
      evaluationMetrics: ['AUC-ROC (0.912)', 'Precision @ Top Decile (0.871)', 'F1-Score (0.829)', 'Intervention Lead Time (45 Days)'],
      keyImplementationSteps: [
        'Data normalization and exponential decay feature engineering',
        'Tree ensemble probability scoring model implementation',
        'Risk tier categorization and automated early-warning triggers',
        'Interactive simulation testbench for SaaS operators',
        'Unit test suite testing extreme tenure and edge cases'
      ],
      assumptions: ['Seat utilization drops precipitously 30-60 days before contract non-renewal', 'Support ticket clusters signal unmet technical requirements'],
      potentialChallenges: ['Class imbalance in annual contracts vs monthly renewals', 'Noise in free-tier customer behavioral logs']
    },
    defaultTasks: [
      {
        id: 'task-1',
        order: 1,
        title: 'Feature Transformation & Velocity Pipeline',
        description: 'Construct engagement ratio features, log tenure scalers, and escalation indices.',
        fileTarget: 'data/features.ts',
        dependencies: [],
        status: 'pending'
      },
      {
        id: 'task-2',
        order: 2,
        title: 'Gradient Ensemble Risk Scoring Engine',
        description: 'Implement tree ensemble decision splits and calibrated probability estimation.',
        fileTarget: 'src/ensemble.ts',
        dependencies: ['task-1'],
        status: 'pending'
      },
      {
        id: 'task-3',
        order: 3,
        title: 'Attribution & Risk Classification Service',
        description: 'Decompose risk score into human-readable drivers and actionable recommendation rules.',
        fileTarget: 'src/explainer.ts',
        dependencies: ['task-2'],
        status: 'pending'
      },
      {
        id: 'task-4',
        order: 4,
        title: 'Prototype Scoring API & Verification Engine',
        description: 'Implement end-to-end inference handler for SaaS customer telemetry.',
        fileTarget: 'src/inference.ts',
        dependencies: ['task-3'],
        status: 'pending'
      },
      {
        id: 'task-5',
        order: 5,
        title: 'Integration & Edge-Case Test Suite',
        description: 'Verify boundary inputs (0 tenure, 100% seat usage, 0 tickets) and probability bounds.',
        fileTarget: 'tests/ensemble.test.ts',
        dependencies: ['task-4'],
        status: 'pending'
      }
    ],
    prototypeConfig: {
      name: 'ChurnGuard Predictive Retention Dashboard',
      description: 'Interactive SaaS customer risk simulator synthesizing the research paper ensemble model.',
      modelType: 'Gradient Boosted Decision Trees + Temporal Decay (GBDT)',
      metrics: {
        'Validation AUC-ROC': '0.912',
        'Precision @ Top Decile': '87.1%',
        'Lead Time Warning': '45 Days',
        'False Discovery Rate': '11.4%'
      },
      inputs: [
        { name: 'tenureMonths', type: 'number', label: 'Customer Tenure (Months)', defaultValue: 14, min: 1, max: 72, step: 1, description: 'Months since initial subscription sign-up' },
        { name: 'monthlyCharges', type: 'number', label: 'Monthly Recurring Revenue ($)', defaultValue: 120.0, min: 10, max: 2000, step: 5, description: 'Current monthly contracted tier' },
        { name: 'activeSeatRatio', type: 'number', label: 'Seat Utilization Ratio (0.0 - 1.0)', defaultValue: 0.65, min: 0.05, max: 1.0, step: 0.05, description: 'Fraction of purchased seats logged in during past 14 days' },
        { name: 'supportTickets', type: 'number', label: 'Support Escalations (Last 30 Days)', defaultValue: 2, min: 0, max: 20, step: 1, description: 'Number of severe helpdesk or SLA tickets logged' },
        { name: 'contractType', type: 'select', label: 'Contract Agreement Type', defaultValue: 'Month-to-Month', options: ['Month-to-Month', '1-Year', '2-Year'], description: 'Contract commitment duration' }
      ],
      samplePresets: [
        {
          name: 'Healthy Long-Term Enterprise Client',
          description: 'High seat usage, 2-year contract, established 36-month tenure.',
          values: { tenureMonths: 36, monthlyCharges: 850.0, activeSeatRatio: 0.92, supportTickets: 0, contractType: '2-Year' }
        },
        {
          name: 'Immediate Attrition Hazard',
          description: 'Month-to-month, sudden crash to 15% seat usage, 5 unresolved tickets.',
          values: { tenureMonths: 3, monthlyCharges: 250.0, activeSeatRatio: 0.15, supportTickets: 5, contractType: 'Month-to-Month' }
        },
        {
          name: 'At-Risk Expansion Tier',
          description: 'Paying high monthly fees but experiencing seat adoption stagnation.',
          values: { tenureMonths: 11, monthlyCharges: 600.0, activeSeatRatio: 0.40, supportTickets: 3, contractType: 'Month-to-Month' }
        }
      ]
    },
    defaultCode: [
      {
        path: 'src/ensemble.ts',
        language: 'typescript',
        description: 'Ensemble risk calculation with calibrated weights',
        content: `export class ChurnEnsembleModel {
  public calculateRisk(input: {
    tenureMonths: number;
    monthlyCharges: number;
    activeSeatRatio: number;
    supportTickets: number;
    contractType: string;
  }) {
    // Baseline risk
    let logOdds = -1.2;

    // Tenure effect (decaying hazard)
    const tenureFactor = Math.max(1, input.tenureMonths);
    logOdds -= Math.log(tenureFactor) * 0.45;

    // Seat utilization effect
    const seatDeficit = Math.max(0, 0.80 - input.activeSeatRatio);
    logOdds += seatDeficit * 3.8;

    // Support ticket escalation effect
    logOdds += input.supportTickets * 0.55;

    // Contract term dampening
    if (input.contractType === '1-Year') logOdds -= 0.6;
    if (input.contractType === '2-Year') logOdds -= 1.4;

    // Sigmoid probability conversion
    const prob = 1 / (1 + Math.exp(-logOdds));
    const churnProbability = Math.min(0.98, Math.max(0.01, prob));

    let riskLevel = 'LOW';
    if (churnProbability > 0.65) riskLevel = 'CRITICAL';
    else if (churnProbability > 0.35) riskLevel = 'ELEVATED';

    return {
      churnProbability: parseFloat((churnProbability * 100).toFixed(1)),
      riskLevel,
      projectedLoss: parseFloat((input.monthlyCharges * 12 * churnProbability).toFixed(0)),
      recommendation: riskLevel === 'CRITICAL' ? 'Immediate Customer Success Intervention' : 'Standard Health Monitoring'
    };
  }
}`
      },
      {
        path: 'tests/ensemble.test.ts',
        language: 'typescript',
        description: 'Unit test suite for churn prediction pipeline',
        content: `import { ChurnEnsembleModel } from '../src/ensemble';

export function runTests() {
  const model = new ChurnEnsembleModel();
  const logs: string[] = [];
  let passed = 0;
  let failed = 0;

  logs.push('[TEST SUITE] Running ChurnGuard Prototype Verification...');

  // Test 1: High risk account
  const t1 = model.calculateRisk({
    tenureMonths: 2,
    monthlyCharges: 200,
    activeSeatRatio: 0.2,
    supportTickets: 4,
    contractType: 'Month-to-Month'
  });
  if (t1.riskLevel === 'CRITICAL' && t1.churnProbability > 60) {
    logs.push('✓ Test 1 Passed: High-risk customer correctly identified as CRITICAL.');
    passed++;
  } else {
    logs.push('✗ Test 1 Failed: Critical churn risk missed.');
    failed++;
  }

  // Test 2: Loyal customer
  const t2 = model.calculateRisk({
    tenureMonths: 48,
    monthlyCharges: 500,
    activeSeatRatio: 0.95,
    supportTickets: 0,
    contractType: '2-Year'
  });
  if (t2.riskLevel === 'LOW' && t2.churnProbability < 25) {
    logs.push('✓ Test 2 Passed: Loyal enterprise customer correctly flagged as LOW risk.');
    passed++;
  } else {
    logs.push('✗ Test 2 Failed: Low risk customer misclassified.');
    failed++;
  }

  return { total: passed + failed, passed, failed, logs };
}`
      },
      {
        path: 'README.md',
        language: 'markdown',
        description: 'ChurnGuard documentation',
        content: `# ChurnGuard: Dynamic Customer Attrition Forecasting

Synthesized autonomously by **Paper2Prototype AI** from research publication.
`
      }
    ],
    testSuite: {
      attempt1Error: {
        type: 'AssertionError: Probability Bound Violation',
        failedTest: 'Test 2: Extreme Outlier Bounds Validation',
        rawLog: `[TEST SUITE] Running ChurnGuard Prototype Verification...
✓ Test 1 Passed: High-risk customer correctly identified as CRITICAL.
[FATAL ERROR] at ensemble.ts:24:12
AssertionError: Expected churnProbability <= 100, received 104.2%
    at ChurnEnsembleModel.calculateRisk (src/ensemble.ts:24:15)
    at tests/ensemble.test.ts:28:18
✗ Test 2 Failed: Probability normalization bounds overflow on high monthly charges.
Tests summary: 1 Passed, 1 Failed. Exit code 1.`,
        diagnosis: 'Sigmoid log-odds scaling calculation allowed unclipped probability multiplication to overflow 100% when compounded with high tier revenue weights.',
        fixDescription: 'Added strict mathematical clamping (Math.min(0.98, Math.max(0.01, prob))) in ChurnEnsembleModel prior to percentage conversion.',
        patch: `// Applied patch in src/ensemble.ts:
- const churnProbability = prob;
+ const churnProbability = Math.min(0.98, Math.max(0.01, prob));`
      },
      attempt2SuccessLogs: `[TEST SUITE] Running ChurnGuard Prototype Verification (Attempt 2)...
✓ Test 1 Passed: High-risk customer correctly identified as CRITICAL (Probability: 84.2%).
✓ Test 2 Passed: Loyal enterprise customer correctly flagged as LOW risk (Probability: 6.8%).
✓ Test 3 Passed: Probability normalization strictly bounded in [1%, 98%] across all extreme presets.
[SUCCESS] All 3/3 test assertions PASSED. Verification completed in 18ms.`
    }
  }
};
