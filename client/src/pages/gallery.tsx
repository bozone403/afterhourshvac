import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link } from 'wouter';

type GalleryItem = {
  id: number;
  title: string;
  location: string;
  benefit: string;
  benefitValue: string;
  beforeImg: string;
  beforeAlt: string;
  afterImg: string;
  afterAlt: string;
  category: 'residential' | 'commercial';
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'High-Efficiency Furnace Upgrade',
    location: 'Coaldale, AB',
    benefit: 'Energy Savings',
    benefitValue: '30%',
    beforeImg: 'https://pixabay.com/get/g3c94d93e57dbb0472cfd4aa2ac901fdf660dffb8c1982d6ff3de24b5d8d59d16dbba7f5aec6fad5eb551975de29605fe37dd0db0968c3d12a0b2e0b9fdaaa3df_1280.jpg',
    beforeAlt: 'Old furnace before replacement showing wear and inefficiency',
    afterImg: 'https://pixabay.com/get/gae1425309f073f0b194ac7b3fd0af7cd0626194efe016524bbaa1dba2f2f0976c0a04d8093245a55af3a815e574190507fcbd366ffb6e4bab41e203a0f12850a_1280.jpg',
    afterAlt: 'New high-efficiency furnace after installation with clean setup',
    category: 'residential'
  },
  {
    id: 2,
    title: 'Commercial Rooftop RTU Replacement',
    location: 'Calgary, AB',
    benefit: 'Cooling Capacity',
    benefitValue: '+25%',
    beforeImg: 'https://pixabay.com/get/g3876d21c96bb5e4d0e4d1a3d7792145ebdec3edcfef8836368aa086f3e32ff8bc45f0e3e7ac749270e7c51cedfe1147cad8e2b8639ca1eda122ed0f4b7703fd0_1280.jpg',
    beforeAlt: 'Old commercial rooftop unit showing significant wear and rust',
    afterImg: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
    afterAlt: 'New commercial rooftop HVAC unit professionally installed',
    category: 'commercial'
  },
  {
    id: 3,
    title: 'Air Conditioning Installation',
    location: 'Lethbridge, AB',
    benefit: 'Efficiency Rating',
    benefitValue: 'SEER 16',
    beforeImg: 'https://pixabay.com/get/gafdb3ba59a10ca97d9a4c1df2e77ec7e5b5bb6ada19e6cc13c2cbac14d4ee5055a83ce487ee1a2adfc10ca7b9a8e877cbfbff0cbbc9d64b73b0ddb70d41a10a2_1280.jpg',
    beforeAlt: 'Old air conditioning unit with visible damage and corrosion',
    afterImg: 'https://pixabay.com/get/g0931b0b5caf4e8fb8de593236e0345e9b6ed7d4981ff39056847ba96274eaa1273c0ea61f0782c8bbd49968a85511f5b0e50d38d7e66137b2a28c4300d074c9e_1280.jpg',
    afterAlt: 'Modern high-efficiency air conditioning unit neatly installed',
    category: 'residential'
  },
  {
    id: 4,
    title: 'Ductwork Replacement',
    location: 'Fort Macleod, AB',
    benefit: 'Airflow Improvement',
    benefitValue: '40%',
    beforeImg: 'https://pixabay.com/get/gfc5b5e2c14d5c16a0f6fc9d12dc3cd2fcb4ae1c04b42bc686d5f0fdf5e3e6e40ee4dc68c91d9c5c9a1e0c41f03b65cd2f3fa2a4a95ecb1f6eee4d64c5e1089bb_1280.jpg',
    beforeAlt: 'Old deteriorated ductwork with poor insulation and sealing',
    afterImg: 'https://pixabay.com/get/g5cf76cc0cf8fe8aeb5a4fd2b4f4f51bc17d0dd65e3b3fb7835c29c4bf52dd0afc73a0d2f51e99c61d2f8ee4c1a0b1fdaab68df7a68ce3b90edda7a4c1cef70c1_1280.jpg',
    afterAlt: 'New properly insulated and sealed ductwork installation',
    category: 'residential'
  }
];

const Gallery = () => {
  const [filter, setFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  
  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <>
      <Helmet>
        <title>Project Gallery - AfterHours HVAC</title>
        <meta name="description" content="View our HVAC installation and replacement projects with before and after photos. See the quality of our work in Calgary, Lethbridge, and surrounding areas." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">Our <span className="text-primary">Gallery</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">See the difference our professional HVAC installations and upgrades make for our customers.</p>
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap justify-center space-x-2 mb-10">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-md font-medium mb-2 ${filter === 'all' ? 'bg-primary text-white' : 'bg-darkgray text-white border border-gray-700'}`}
            >
              All Projects
            </button>
            <button 
              onClick={() => setFilter('residential')} 
              className={`px-4 py-2 rounded-md font-medium mb-2 ${filter === 'residential' ? 'bg-primary text-white' : 'bg-darkgray text-white border border-gray-700'}`}
            >
              Residential
            </button>
            <button 
              onClick={() => setFilter('commercial')} 
              className={`px-4 py-2 rounded-md font-medium mb-2 ${filter === 'commercial' ? 'bg-primary text-white' : 'bg-darkgray text-white border border-gray-700'}`}
            >
              Commercial
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-darkgray rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.beforeImg} 
                    alt={item.beforeAlt} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-dark bg-opacity-75 text-white px-4 py-2 rounded-br-lg">
                    <span className="font-medium">Before</span>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={item.afterImg} 
                    alt={item.afterAlt} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-primary text-white px-4 py-2 rounded-br-lg">
                    <span className="font-medium">After</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-header mb-2">{item.title}</h3>
                  <p className="text-lightgray mb-3">
                    {item.category === 'residential' ? 'Residential project in ' : 'Commercial project in '}
                    {item.location}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.location}</span>
                    <span className="text-secondary">{item.benefit}: {item.benefitValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-header mb-4">Ready to See Results Like These?</h2>
            <p className="text-lightgray max-w-2xl mx-auto mb-8">
              Our expert team can help you upgrade your HVAC system for better efficiency, comfort, and reliability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <a className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg">
                  Request a Consultation
                </a>
              </Link>
              <a 
                href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg"
              >
                <i className="fas fa-calendar-alt mr-2"></i> Book a Service Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
