import { addKnowledgeToRAG } from '@/utils/RAGEnhancedAI';

export const initialKnowledgeBase = [
  {
    content: `
Content Marketing Best Practices:

1. Know Your Audience: Always research and understand your target audience's needs, preferences, and pain points before creating content.

2. Create Value-Driven Content: Focus on providing genuine value to your audience through educational, entertaining, or inspiring content.

3. Consistency is Key: Maintain a consistent publishing schedule and brand voice across all platforms.

4. SEO Optimization: Use relevant keywords naturally throughout your content, optimize meta descriptions, and include internal/external links.

5. Visual Elements: Always include engaging visuals like images, infographics, or videos to increase engagement.

6. Call-to-Action: Include clear, compelling CTAs that guide readers toward desired actions.

7. Mobile Optimization: Ensure all content is mobile-friendly and loads quickly on all devices.

8. Social Media Integration: Make content easily shareable and optimize for each platform's specific requirements.

9. Analytics and Measurement: Track performance metrics and adjust strategies based on data insights.

10. Storytelling: Use narrative techniques to make content more engaging and memorable.
    `,
    metadata: {
      source: 'Content Marketing Guide 2024',
      type: 'guideline' as const,
      title: 'Content Marketing Best Practices',
      tags: ['content-marketing', 'best-practices', 'seo', 'social-media'],
    },
  },
  {
    content: `
Social Media Content Guidelines:

Platform-Specific Recommendations:

Instagram:
- Use high-quality, visually appealing images
- Optimal post times: 6-9 AM and 5-7 PM
- Use 3-5 relevant hashtags for better engagement
- Include location tags when relevant
- Stories should be authentic and behind-the-scenes

Twitter:
- Keep tweets concise and engaging
- Use trending hashtags strategically
- Engage with followers through replies and retweets
- Post 3-5 times per day for optimal engagement
- Use polls and questions to boost interaction

LinkedIn:
- Share professional insights and industry news
- Use a professional tone while being personable
- Include relevant industry hashtags
- Post during business hours (9 AM - 5 PM)
- Engage with comments to build relationships

Facebook:
- Post a mix of content types (text, images, videos)
- Ask questions to encourage engagement
- Share user-generated content
- Use Facebook Groups for community building
- Post when your audience is most active

YouTube:
- Create compelling thumbnails and titles
- Use relevant keywords in descriptions
- Include timestamps for longer videos
- Engage with comments to build community
- Create playlists to organize content
    `,
    metadata: {
      source: 'Social Media Strategy Manual',
      type: 'guideline' as const,
      title: 'Social Media Content Guidelines',
      tags: ['social-media', 'instagram', 'twitter', 'linkedin', 'facebook', 'youtube'],
    },
  },
  {
    content: `
Blog Writing Formula for Maximum Engagement:

1. Compelling Headlines:
- Use numbers (e.g., "5 Ways to...")
- Include power words (Ultimate, Essential, Proven)
- Create urgency or curiosity
- Keep under 60 characters for SEO

2. Introduction Structure:
- Hook: Start with a question, statistic, or bold statement
- Promise: Tell readers what they'll learn
- Preview: Outline what's coming next

3. Body Content:
- Use short paragraphs (2-3 sentences)
- Include bullet points and numbered lists
- Add subheadings every 300-500 words
- Use transition words for flow

4. Visual Elements:
- Include relevant images every 300-500 words
- Use infographics for complex information
- Add videos when possible
- Include charts and graphs for data

5. Conclusion:
- Summarize key points
- Include a strong call-to-action
- Ask a question to encourage comments
- Provide next steps for readers

6. SEO Optimization:
- Use focus keyword in title, first paragraph, and conclusion
- Include related keywords naturally
- Add meta description (150-160 characters)
- Use internal and external links
- Optimize images with alt text

7. Engagement Tactics:
- Ask questions throughout the post
- Include polls or surveys
- Share personal anecdotes
- Use conversational tone
- Respond to comments promptly
    `,
    metadata: {
      source: 'Blog Writing Masterclass',
      type: 'guideline' as const,
      title: 'Blog Writing Formula for Maximum Engagement',
      tags: ['blog-writing', 'seo', 'engagement', 'content-structure'],
    },
  },
  {
    content: `
Email Marketing Best Practices:

1. Subject Line Optimization:
- Keep under 50 characters
- Use personalization when possible
- Create urgency or curiosity
- Avoid spam trigger words
- Test different approaches

2. Email Structure:
- Clear, scannable layout
- Mobile-responsive design
- Use white space effectively
- Include alt text for images
- Keep paragraphs short

3. Content Guidelines:
- Provide value in every email
- Use conversational tone
- Include clear call-to-action
- Segment content for different audiences
- Test send times and frequency

4. Personalization:
- Use subscriber's name
- Reference past purchases or interactions
- Send behavior-triggered emails
- Customize content based on preferences
- Use dynamic content blocks

5. List Management:
- Regular list cleaning
- Double opt-in process
- Easy unsubscribe option
- Segment lists by behavior and demographics
- Re-engagement campaigns for inactive subscribers

6. Performance Metrics:
- Open rate (industry average: 20-25%)
- Click-through rate (industry average: 2-5%)
- Conversion rate
- Unsubscribe rate
- List growth rate

7. A/B Testing:
- Test subject lines
- Test send times
- Test email templates
- Test call-to-action buttons
- Test content length
    `,
    metadata: {
      source: 'Email Marketing Excellence Guide',
      type: 'guideline' as const,
      title: 'Email Marketing Best Practices',
      tags: ['email-marketing', 'personalization', 'automation', 'testing'],
    },
  },
  {
    content: `
YouTube Content Creation Guidelines:

1. Content Planning:
- Research trending topics in your niche
- Create content pillars (education, entertainment, inspiration)
- Plan series and recurring content
- Use keyword research tools
- Analyze competitor content

2. Video Production:
- Good lighting is essential
- Clear audio quality
- Steady camera work
- Engaging thumbnails
- Consistent branding

3. Optimization:
- Use keyword-rich titles
- Write detailed descriptions
- Add relevant tags
- Include closed captions
- Create eye-catching thumbnails

4. Engagement Strategies:
- Start with a hook in first 15 seconds
- Ask questions to encourage comments
- Use end screens and cards
- Include clear calls-to-action
- Respond to comments quickly

5. Publishing Schedule:
- Consistency is key
- Choose optimal upload times
- Use YouTube Analytics to find best times
- Create content calendar
- Batch create content

6. Community Building:
- Create playlists for better organization
- Collaborate with other creators
- Use YouTube Community tab
- Host live streams
- Create shorts for increased visibility

7. Analytics and Improvement:
- Monitor watch time and retention
- Track subscriber growth
- Analyze traffic sources
- Review audience demographics
- Adjust strategy based on data
    `,
    metadata: {
      source: 'YouTube Creator Handbook',
      type: 'guideline' as const,
      title: 'YouTube Content Creation Guidelines',
      tags: ['youtube', 'video-content', 'seo', 'engagement', 'analytics'],
    },
  },
  {
    content: `
Content Calendar Template and Planning:

Monthly Planning Process:
1. Audit previous month's performance
2. Research upcoming trends and events
3. Plan content themes for each week
4. Create content briefs for each piece
5. Schedule content across platforms
6. Prepare promotional materials

Weekly Content Mix:
- Monday: Motivational/Inspirational content
- Tuesday: Educational/How-to content
- Wednesday: Behind-the-scenes/Personal content
- Thursday: Industry news/Trends
- Friday: Entertainment/Fun content
- Saturday: User-generated content
- Sunday: Reflection/Planning content

Content Types to Include:
- Blog posts (2-3 per week)
- Social media posts (1-2 per platform daily)
- Email newsletters (1-2 per week)
- Video content (1-2 per week)
- Infographics (1 per week)
- Podcast episodes (1 per week)
- Case studies (1 per month)
- Webinars (1 per month)

Content Promotion Schedule:
- Day 1: Publish original content
- Day 2: Share on primary social channels
- Day 3: Send to email list
- Day 7: Repurpose for different format
- Day 14: Share user-generated content
- Day 30: Include in monthly newsletter

Tools for Content Planning:
- Google Calendar for scheduling
- Trello or Asana for project management
- Hootsuite or Buffer for social media
- Canva for visual content
- Google Analytics for performance tracking
    `,
    metadata: {
      source: 'Content Planning Masterclass',
      type: 'guideline' as const,
      title: 'Content Calendar Template and Planning',
      tags: ['content-calendar', 'planning', 'organization', 'strategy'],
    },
  },
];

export async function seedKnowledgeBase() {
  try {
    const result = await addKnowledgeToRAG(initialKnowledgeBase);
    console.log('Knowledge base seeded successfully:', result);
    return result;
  } catch (error) {
    console.error('Error seeding knowledge base:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
