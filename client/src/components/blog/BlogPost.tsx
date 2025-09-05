import React from 'react';
import { useParams, Link } from 'wouter';
import { getBlogPosts } from '@/lib/static-api';
import { Calendar, User, ArrowLeft, Phone, Mail } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const params = useParams();
  const slug = params.slug;
  const posts = getBlogPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="hvac-heading-xl text-gray-900 mb-4">Post Not Found</h1>
        <p className="hvac-text-lg text-gray-600 mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <Link href="/blog" className="hvac-button-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Link>

      {/* Article header */}
      <header className="mb-8">
        <h1 className="hvac-heading-xl text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article content */}
      <div className="prose max-w-none mb-12">
        <div className="hvac-text-lg text-gray-600 mb-8 font-medium">
          {post.excerpt}
        </div>
        
        <div className="whitespace-pre-line hvac-text-base text-gray-700 leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Need HVAC Service in Calgary?</h3>
        <p className="text-lg mb-6 opacity-90">
          Don't wait for a breakdown. Contact After Hours HVAC for professional service and emergency repairs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:4031234567"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Phone className="w-5 h-5 mr-2" />
            (403) 123-4567
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Get Quote
          </Link>
        </div>
      </div>

      {/* Related posts */}
      <div className="mt-16">
        <h3 className="hvac-heading-lg text-gray-900 mb-8">More HVAC Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {posts
            .filter(p => p.id !== post.id)
            .slice(0, 2)
            .map((relatedPost) => (
              <div key={relatedPost.id} className="service-card p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  <Link href={`/blog/${relatedPost.slug}`} className="hover:text-blue-600">
                    {relatedPost.title}
                  </Link>
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {relatedPost.excerpt.substring(0, 120)}...
                </p>
                <Link
                  href={`/blog/${relatedPost.slug}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            ))}
        </div>
      </div>
    </article>
  );
};
