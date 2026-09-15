import { TopicItem } from '../types';

export const aiMlTopics: TopicItem[] = [
  {
    id: 'genai-transformers-attention',
    title: 'Gen AI & LLM Architecture: Transformers & Scaled Dot-Product Self-Attention',
    domain: 'genai-ml',
    category: 'Generative AI & LLMs',
    difficulty: 'Hard',
    companyTags: ['OpenAI', 'Google', 'Meta', 'Anthropic', 'Microsoft', 'Nvidia'],
    importanceRating: 5,
    summary: 'The mathematical foundation of modern LLMs (GPT-4, Gemini, Llama 3): Transformer Encoder-Decoder, Query Key Value matrices, and Self-Attention math.',
    keyConcepts: [
      'Scaled Dot-Product Self-Attention formula $\\text{Softmax}(\\frac{QK^T}{\\sqrt{d_k}})V$',
      'Query (Q), Key (K), and Value (V) Projection Matrices',
      'Multi-Head Attention (MHA) & Grouped Query Attention (GQA)',
      'Positional Encoding (RoPE - Rotary Position Embedding)'
    ],
    detailedContent: `
### Attention Mathematical Formula
Given input embeddings projected into Query $Q$, Key $K$, Value $V$ of dimension $d_k$:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$

1. **Dot Product $Q K^T$**: Measures similarity score between every pair of tokens in the prompt context.
2. **Scaling by $\\sqrt{d_k}$**: Prevents dot products from growing excessively large in high dimensions, keeping softmax gradients stable.
3. **Softmax**: Converts raw similarity scores into probability distribution (attention weights summing to 1).
4. **Multiply by $V$**: Computes weighted combination of token representations.

### Why Multi-Head Attention (MHA)?
Instead of performing single attention, MHA splits $Q, K, V$ into $h$ subspaces. This allows the model to simultaneously attend to information from different representation subspaces (e.g. grammar, semantic subject, tense).
    `,
    interviewQuestions: [
      {
        question: 'Why do Transformers require Positional Encoding while RNNs do not?',
        answer: 'RNNs process tokens sequentially step-by-step (inherently order-aware). Transformers process all tokens in parallel simultaneously via matrix multiplication, making self-attention permutation-invariant. Positional encodings (e.g. RoPE) inject explicit word order information into input embeddings.'
      }
    ]
  },
  {
    id: 'genai-rag-vector-databases',
    title: 'RAG Architecture: Retrieval-Augmented Generation, Vector DBs & Embeddings',
    domain: 'genai-ml',
    category: 'RAG & AI Systems',
    difficulty: 'Medium',
    companyTags: ['Pinecone', 'OpenAI', 'Databricks', 'Uber', 'Amazon'],
    importanceRating: 5,
    summary: 'End-to-end RAG system design for LLMs: Chunking strategies, Embedding models, HNSW Vector Indexing, Hybrid Search, and Reranking.',
    keyConcepts: [
      'Document Chunking (Recursive Character Splitting, Semantic Chunking)',
      'Dense Vector Embeddings & Cosine Similarity vs Dot Product',
      'HNSW (Hierarchical Navigable Small World) & IVF Vector Indexing',
      'Hybrid Search (Sparse BM25 Keyword Search + Dense Vector Search with RRF)'
    ],
    detailedContent: `
### End-to-End RAG Pipeline Flow
1. **Ingestion & Indexing**:
   - Parse unstructured documents (PDF, Markdown, HTML).
   - Chunk text into overlapping segments (e.g. 512 tokens with 50 token overlap).
   - Pass chunks to Embedding Model (\`text-embedding-3-small\`, BGE, Nomic).
   - Upsert vector embeddings into Vector Database (Pinecone, Chroma, pgvector).
2. **Query Execution**:
   - User prompt $\\rightarrow$ Generate query embedding.
   - Vector DB performs Approximate Nearest Neighbor (ANN) search (Top-K chunks).
   - **Reranker** (Cross-Encoder e.g., Cohere Rerank) scores Top-K chunks for semantic precision.
   - Augment original prompt with top reranked context chunks.
   - LLM generates grounded answer with source citations.
    `,
    interviewQuestions: [
      {
        question: 'How do you solve hallucination in RAG applications?',
        answer: '1. Use strict system prompts with fallback ("Answer ONLY based on provided context; if unknown state I don\'t know"). 2. Add a Reranker step to remove irrelevant chunks. 3. Enforce low temperature setting (e.g. T=0.1). 4. Use Citation Verification & RAG Triad evaluation metrics (Context Relevance, Groundedness, Answer Relevance).'
      }
    ]
  },
  {
    id: 'aiml-core-ml-algorithms',
    title: 'Core Machine Learning: Bias-Variance Tradeoff, Gradient Descent & Overfitting',
    domain: 'genai-ml',
    category: 'Machine Learning Fundamentals',
    difficulty: 'Medium',
    companyTags: ['Google', 'Meta', 'Netflix', 'Spotify', 'Apple'],
    importanceRating: 5,
    summary: 'Fundamental ML concepts: Supervised vs Unsupervised learning, Cost Functions, Regularization (L1 Lasso, L2 Ridge), and Evaluation Metrics.',
    keyConcepts: [
      'Bias (Underfitting) vs Variance (Overfitting) Tradeoff',
      'L1 Regularization (Lasso - Feature Selection) vs L2 Regularization (Ridge - Weight Decay)',
      'Gradient Descent variants (Batch, Stochastic SGD, Adam Optimizer)',
      'Precision, Recall, F1-Score & ROC-AUC curve'
    ],
    detailedContent: `
### Bias-Variance Tradeoff
- **High Bias (Underfitting)**: Model is too simple to capture underlying data patterns (e.g. linear model on polynomial data). High training error & high validation error.
- **High Variance (Overfitting)**: Model memorizes training noise instead of generalizing. Low training error but high validation error.

### How to Mitigate Overfitting:
1. Increase training data volume / Data Augmentation.
2. Add L1/L2 Regularization or Dropout in Neural Networks.
3. Reduce model capacity/complexity (pruning tree depth).
4. Early Stopping during training.
    `,
    interviewQuestions: [
      {
        question: 'What is the main difference between L1 (Lasso) and L2 (Ridge) Regularization?',
        answer: 'L1 regularization adds absolute value penalty (λ|w|), driving irrelevant feature weights strictly to zero (creates sparse models / feature selection). L2 regularization adds squared value penalty (λw²), shrinking feature weights smoothly towards zero without making them exactly zero.'
      }
    ]
  }
];
