import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  MapPin, 
  Star,
  Filter,
  Grid,
  List
} from "lucide-react";
import { Helmet } from "react-helmet-async";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  location?: string;
  tags: string[];
  rating?: number;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['/api/gallery/services'],
    staleTime: 5 * 60 * 1000,
  });

  const typedGalleryItems = (galleryItems as GalleryItem[]) || [];

  const categories = [
    { id: "all", name: "All Projects", count: typedGalleryItems.length },
    { id: "furnace", name: "Furnace Installation", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "furnace").length },
    { id: "ac", name: "AC Systems", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "ac").length },
    { id: "ductwork", name: "Ductwork", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "ductwork").length },
    { id: "maintenance", name: "Maintenance", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "maintenance").length },
    { id: "commercial", name: "Commercial", count: typedGalleryItems.filter((item: GalleryItem) => item.category === "commercial").length }
  ];

  const filteredItems = selectedCategory === "all" 
    ? typedGalleryItems 
    : typedGalleryItems.filter((item: GalleryItem) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Service Gallery - AfterHours HVAC</title>
        <meta name="description" content="View our completed HVAC installations, repairs, and maintenance projects. Professional furnace, AC, and ductwork services in Calgary." />
        <meta name="keywords" content="HVAC gallery, furnace installation, AC repair, ductwork, Calgary HVAC services" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Work Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our completed HVAC projects and see the quality craftsmanship 
              that makes AfterHours HVAC Calgary's trusted heating and cooling experts.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 bg-white p-1 rounded-lg shadow-sm">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs lg:text-sm font-medium px-2 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Gallery Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item: GalleryItem) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item: GalleryItem) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {item.date}
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">
                {selectedCategory === "all" 
                  ? "We're continuously adding new projects to our gallery."
                  : `No projects found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`
                }
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join our satisfied customers and experience professional HVAC services. 
              Get a free estimate for your heating and cooling needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="font-semibold">
                Get Free Quote
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                Call (403) 613-6014
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;