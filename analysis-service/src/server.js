const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage for demo (use database in production)
const submissions = new Map();
const evaluations = new Map();

// Code analysis engine
class CodeAnalyzer {
  static analyzeComplexity(code) {
    // Simplified complexity analysis
    const lines = code.split('\n').filter(line => line.trim());
    const functions = (code.match(/function\s+\w+/g) || []).length;
    const conditionals = (code.match(/\b(if|while|for|require)\b/g) || []).length;
    const loops = (code.match(/\b(for|while)\b/g) || []).length;
    
    // Complexity score based on code structure
    let complexity = Math.min(100, Math.max(0, 
      (lines.length * 0.3) + 
      (functions * 5) + 
      (conditionals * 3) + 
      (loops * 4)
    ));
    
    return Math.round(complexity);
  }
  
  static analyzeSecurity(code) {
    let securityScore = 100;
    
    // Check for common security issues
    const issues = [
      { pattern: /tx\.origin/g, penalty: 20, name: 'tx.origin usage' },
      { pattern: /\.call\(/g, penalty: 15, name: 'Low-level call' },
      { pattern: /delegatecall/g, penalty: 25, name: 'Delegatecall usage' },
      { pattern: /block\.timestamp/g, penalty: 10, name: 'Timestamp dependency' },
      { pattern: /block\.number/g, penalty: 8, name: 'Block number dependency' },
      { pattern: /selfdestruct/g, penalty: 30, name: 'Selfdestruct usage' }
    ];
    
    // Check for good practices
    const goodPractices = [
      { pattern: /require\(/g, bonus: 5, name: 'Input validation' },
      { pattern: /modifier\s+\w+/g, bonus: 10, name: 'Function modifiers' },
      { pattern: /event\s+\w+/g, bonus: 8, name: 'Event logging' },
      { pattern: /\bpure\b|\bview\b/g, bonus: 5, name: 'State mutability' }
    ];
    
    // Apply penalties
    issues.forEach(issue => {
      const matches = code.match(issue.pattern);
      if (matches) {
        securityScore -= issue.penalty * Math.min(matches.length, 3);
      }
    });
    
    // Apply bonuses
    goodPractices.forEach(practice => {
      const matches = code.match(practice.pattern);
      if (matches) {
        securityScore += practice.bonus * Math.min(matches.length, 2);
      }
    });
    
    return Math.max(0, Math.min(100, Math.round(securityScore)));
  }
  
  static analyzeQuality(code) {
    const lines = code.split('\n');
    const totalLines = lines.length;
    const commentLines = lines.filter(line => line.trim().startsWith('//')).length;
    const emptyLines = lines.filter(line => !line.trim()).length;
    
    // Quality metrics
    const commentRatio = commentLines / Math.max(totalLines, 1);
    const hasLicense = code.includes('SPDX-License-Identifier');
    const hasNatSpec = code.includes('@dev') || code.includes('@param') || code.includes('@return');
    const properNaming = /function\s+[a-z][a-zA-Z0-9]*/.test(code);
    const hasEvents = /event\s+\w+/.test(code);
    
    let qualityScore = 50; // Base score
    
    // Comment ratio bonus (up to 20 points)
    qualityScore += Math.min(20, commentRatio * 100);
    
    // Documentation bonuses
    if (hasLicense) qualityScore += 10;
    if (hasNatSpec) qualityScore += 15;
    if (properNaming) qualityScore += 10;
    if (hasEvents) qualityScore += 10;
    
    // Code structure bonus
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / totalLines;
    if (avgLineLength < 80) qualityScore += 5; // Not too long lines
    
    return Math.max(0, Math.min(100, Math.round(qualityScore)));
  }
  
  static async analyze(code) {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const complexity = this.analyzeComplexity(code);
    const security = this.analyzeSecurity(code);
    const quality = this.analyzeQuality(code);
    
    // Weighted final score (Security: 40%, Complexity: 30%, Quality: 30%)
    const finalScore = Math.round(
      (security * 0.4) + (complexity * 0.3) + (quality * 0.3)
    );
    
    return {
      complexity,
      security,
      quality,
      finalScore,
      analysis: {
        linesOfCode: code.split('\n').filter(line => line.trim()).length,
        functions: (code.match(/function\s+\w+/g) || []).length,
        events: (code.match(/event\s+\w+/g) || []).length,
        modifiers: (code.match(/modifier\s+\w+/g) || []).length
      }
    };
  }
}

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/analyze', async (req, res) => {
  try {
    const { code, submissionId } = req.body;
    
    if (!code || !submissionId) {
      return res.status(400).json({ error: 'Code and submissionId are required' });
    }
    
    // Generate code hash
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    
    // Store submission
    submissions.set(submissionId, {
      codeHash,
      timestamp: new Date().toISOString(),
      status: 'analyzing'
    });
    
    console.log(`Starting analysis for submission ${submissionId}`);
    
    // Perform analysis
    const results = await CodeAnalyzer.analyze(code);
    
    // Store evaluation results
    evaluations.set(submissionId, {
      ...results,
      codeHash,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
    
    // Update submission status
    submissions.set(submissionId, {
      ...submissions.get(submissionId),
      status: 'completed'
    });
    
    console.log(`Analysis completed for submission ${submissionId}:`, results);
    
    res.json({
      submissionId,
      codeHash,
      results,
      status: 'completed'
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.get('/analysis/:submissionId', (req, res) => {
  const { submissionId } = req.params;
  
  const evaluation = evaluations.get(submissionId);
  if (!evaluation) {
    return res.status(404).json({ error: 'Analysis not found' });
  }
  
  res.json(evaluation);
});

app.get('/submission/:submissionId', (req, res) => {
  const { submissionId } = req.params;
  
  const submission = submissions.get(submissionId);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  
  res.json(submission);
});

app.get('/stats', (req, res) => {
  res.json({
    totalSubmissions: submissions.size,
    completedAnalyses: evaluations.size,
    pendingAnalyses: submissions.size - evaluations.size
  });
});

app.listen(PORT, () => {
  console.log(`Code Analysis Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});