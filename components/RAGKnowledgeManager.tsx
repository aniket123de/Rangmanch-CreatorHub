'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RAGStats {
  totalChunks: number;
  indexInitialized: boolean;
  config: any;
  error?: string;
}

interface Document {
  content: string;
  metadata: {
    source: string;
    type: 'document' | 'faq' | 'guideline' | 'example' | 'reference';
    title?: string;
    tags?: string[];
  };
}

export default function RAGKnowledgeManager() {
  const [stats, setStats] = useState<RAGStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state for adding new knowledge
  const [newDoc, setNewDoc] = useState<Document>({
    content: '',
    metadata: {
      source: '',
      type: 'document',
      title: '',
      tags: [],
    }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rag-knowledge');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError('Failed to fetch RAG statistics');
      }
    } catch (err) {
      setError('Error fetching RAG statistics');
    }
  };

  const handleAddDocument = async () => {
    if (!newDoc.content.trim() || !newDoc.metadata.source.trim()) {
      setError('Content and source are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/rag-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          documents: [newDoc],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setNewDoc({
          content: '',
          metadata: {
            source: '',
            type: 'document',
            title: '',
            tags: [],
          }
        });
        fetchStats(); // Refresh stats
      } else {
        setError(data.error || 'Failed to add document');
      }
    } catch (err) {
      setError('Error adding document');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all knowledge from the RAG store? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/rag-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clear',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        fetchStats(); // Refresh stats
      } else {
        setError(data.error || 'Failed to clear knowledge base');
      }
    } catch (err) {
      setError('Error clearing knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedKnowledge = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/seed-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'seed',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        fetchStats(); // Refresh stats
      } else {
        setError(data.error || 'Failed to seed knowledge base');
      }
    } catch (err) {
      setError('Error seeding knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewDoc(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags,
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RAG Knowledge Base Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats Display */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Current Status</h3>
            {stats ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Chunks:</span> {stats.totalChunks}
                </div>
                <div>
                  <span className="font-medium">Index Status:</span> {stats.indexInitialized ? 'Initialized' : 'Not Initialized'}
                </div>
                {stats.config && (
                  <>
                    <div>
                      <span className="font-medium">Max Chunks:</span> {stats.config.maxChunks}
                    </div>
                    <div>
                      <span className="font-medium">Chunk Size:</span> {stats.config.chunkSize}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Loading statistics...</p>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
              {success}
            </div>
          )}

          {/* Add Document Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Knowledge</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., Marketing Guide v2.1"
                  value={newDoc.metadata.source}
                  onChange={(e) => setNewDoc(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, source: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newDoc.metadata.type}
                  onChange={(e) => setNewDoc(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, type: e.target.value as any }
                  }))}
                >
                  <option value="document">Document</option>
                  <option value="faq">FAQ</option>
                  <option value="guideline">Guideline</option>
                  <option value="example">Example</option>
                  <option value="reference">Reference</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Document title"
                value={newDoc.metadata.title || ''}
                onChange={(e) => setNewDoc(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, title: e.target.value }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3"
                value={newDoc.metadata.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter the knowledge content here..."
                rows={6}
                value={newDoc.content}
                onChange={(e) => setNewDoc(prev => ({
                  ...prev,
                  content: e.target.value
                }))}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleAddDocument}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Adding...' : 'Add Document'}
              </Button>
              
              <Button
                onClick={handleSeedKnowledge}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Seeding...' : 'Seed Knowledge Base'}
              </Button>
              
              <Button
                onClick={handleClearAll}
                disabled={loading}
                variant="destructive"
              >
                {loading ? 'Clearing...' : 'Clear All Knowledge'}
              </Button>
              
              <Button
                onClick={fetchStats}
                disabled={loading}
                variant="outline"
              >
                Refresh Stats
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
