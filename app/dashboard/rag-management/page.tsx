import React from 'react';
import RAGKnowledgeManager from '@/components/RAGKnowledgeManager';

export default function RAGManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RAG Knowledge Management</h1>
        <p className="text-gray-600 mb-8">
          Manage your custom knowledge base for enhanced AI content generation. 
          Add documents, FAQs, guidelines, and examples to improve the quality and 
          accuracy of your generated content.
        </p>
        <RAGKnowledgeManager />
      </div>
    </div>
  );
}
