import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

const blogPosts = [
  {
    id: 1,
    title: 'How to Prepare Your Furnace for Winter',
    slug: 'prepare-furnace-winter',
    date: 'October 12, 2023',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    imageAlt: 'Furnace maintenance by HVAC technician',
    excerpt: 'Essential maintenance steps to ensure your heating system runs efficiently and reliably throughout the cold Alberta winter months.',
    tags: ['Furnace Tips', 'Winter Prep', 'Maintenance']
  },
  {
    id: 2,
    title: 'Commercial vs Residential HVAC: What\'s the Difference?',
    slug: 'commercial-vs-residential-hvac',
    date: 'September 28, 2023',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    imageAlt: 'Commercial HVAC rooftop units',
    excerpt: 'An in-depth comparison of commercial and residential HVAC systems, including design considerations, complexity, and maintenance requirements.',
    tags: ['Commercial', 'Residential', 'System Design']
  },
  {
    id: 3,
    title: 'Signs Your AC Needs Replacement',
    slug: 'signs-ac-needs-replacement',
    date: 'August 15, 2023',
    readTime: '7 min read',
    image: 'https://pixabay.com/get/g0931b0b5caf4e8fb8de593236e0345e9b6ed7d4981ff39056847ba96274eaa1273c0ea61f0782c8bbd49968a85511f5b0e50d38d7e66137b2a28c4300d074c9e_1280.jpg',
    imageAlt: 'Older air conditioning unit in need of replacement',
    excerpt: 'Learn to recognize the warning signs that your air conditioner is on its last legs and how to prepare for replacement before it fails completely.',
    tags: ['Air Conditioning', 'Replacement', 'Troubleshooting']
  },
  {
    id: 4,
    title: 'Understanding HVAC Energy Efficiency Ratings',
    slug: 'understanding-hvac-efficiency-ratings',
    date: 'July 22, 2023',
    readTime: '9 min read',
    image: 'https://pixabay.com/get/gfc5b5e2c14d5c16a0f6fc9d12dc3cd2fcb4ae1c04b42bc686d5f0fdf5e3e6e40ee4dc68c91d9c5c9a1e0c41f03b65cd2f3fa2a4a95ecb1f6eee4d64c5e1089bb_1280.jpg',
    imageAlt: 'Energy efficiency label on HVAC equipment',
    excerpt: 'Decode SEER, AFUE, HSPF and other efficiency ratings to make informed decisions when purchasing new heating and cooling equipment.',
    tags: ['Energy Efficiency', 'Buying Guide', 'Cost Savings']
  }
];

const BlogIndex = () => {
  return (
    <>
      <Helmet>
        <title>HVAC Knowledge Hub - AfterHours HVAC</title>
        <meta name="description" content="Expert HVAC tips, insights, and guides to help you make informed decisions about your heating and cooling systems. Learn about maintenance, efficiency, and more." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">HVAC <span className="text-primary">Knowledge Hub</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Expert tips, insights, and guides to help you make informed decisions about your heating and cooling systems.</p>
          </div>
        </div>
      </div>
      
      {/* Blog Grid */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-darkgray rounded-lg overflow-hidden border border-gray-700 transition-transform hover:transform hover:scale-105">
                <Link href={`/blog/${post.slug}`}>
                  <a>
                    <img 
                      src={post.image} 
                      alt={post.imageAlt} 
                      className="w-full h-48 object-cover"
                    />
                  </a>
                </Link>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-lightgray mb-3">
                    <span><i className="far fa-calendar-alt mr-1"></i> {post.date}</span>
                    <span>•</span>
                    <span><i className="far fa-clock mr-1"></i> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold font-header mb-3">
                    <Link href={`/blog/${post.slug}`}>
                      <a className="hover:text-primary transition-colors">{post.title}</a>
                    </Link>
                  </h2>
                  <p className="text-lightgray mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-dark rounded-full px-3 py-1">{tag}</span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <a className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium">
                      Read Full Article <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-darkgray to-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-darkgray rounded-lg p-8 border border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-header mb-2">Stay Updated on HVAC Trends</h2>
              <p className="text-lightgray">Subscribe to our newsletter for seasonal maintenance tips, industry news, and special offers.</p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-center text-lightgray mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Popular Topics */}
      <section className="bg-dark py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-header">Popular Topics</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Furnaces</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Air Conditioning</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Maintenance</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Energy Efficiency</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Commercial HVAC</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Troubleshooting</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Indoor Air Quality</a>
            <a href="#" className="bg-darkgray hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Seasonal Tips</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogIndex;
