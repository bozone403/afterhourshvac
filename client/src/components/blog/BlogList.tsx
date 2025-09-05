import React from 'react';
import { Link } from 'wouter';
import { getBlogPosts } from '@/lib/static-api';
import { Calendar, User, Tag } from 'lucide-react';

export const BlogList: React.FC = () => {
  const posts = getBlogPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="hvac-heading-xl text-gray-900 mb-4">
          HVAC Tips & Insights
        </h1>
        <p className="hvac-text-lg text-gray-600 max-w-2xl mx-auto">
          Expert advice and tips for Calgary homeowners to keep their HVAC systems running efficiently year-round.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="service-card group hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              </div>

              <h2 className="hvac-heading-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>

              <p className="hvac-text-base text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="hvac-button-primary inline-flex items-center"
              >
                Read More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* SEO-friendly content */}
      <div className="mt-16 prose max-w-none">
        <h2 className="hvac-heading-lg text-gray-900 mb-6">
          Calgary HVAC Services & Maintenance Tips
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Winter HVAC Maintenance</h3>
            <p className="text-gray-600 mb-4">
              Calgary winters demand reliable heating systems. Our expert tips help you maintain your furnace, 
              prevent breakdowns, and keep energy costs low during the coldest months.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Monthly filter changes during peak season</li>
              <li>• Professional furnace inspections</li>
              <li>• Emergency repair services available 24/7</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Summer Cooling Solutions</h3>
            <p className="text-gray-600 mb-4">
              Beat Calgary's summer heat with properly maintained air conditioning systems. 
              Learn about installation, maintenance, and energy-efficient cooling solutions.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• AC installation and replacement</li>
              <li>• Duct cleaning and maintenance</li>
              <li>• Energy efficiency consultations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
