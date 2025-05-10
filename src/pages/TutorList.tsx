
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';

const TutorList = () => {
  const { tutors, searchTutors, filteredTutors, toggleFavorite, getFavoriteTutors } = useData();
  
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortOrder, setSortOrder] = useState<string>('rating');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const favoriteTutors = getFavoriteTutors();
  
  // Get unique list of subjects from all tutors
  const allSubjects = Array.from(new Set(tutors.flatMap(tutor => tutor.subjects)));
  
  // Get unique list of locations from all tutors
  const allLocations = Array.from(new Set(tutors.map(tutor => tutor.location)));
  
  // Days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTutors({
      subject,
      location,
      minRating,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      availability: {
        days: selectedDays.length > 0 ? selectedDays : undefined
      }
    });
  };
  
  // Toggle day selection
  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  // Sort tutors
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    switch (sortOrder) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.hourlyRate - b.hourlyRate;
      case 'price-high':
        return b.hourlyRate - a.hourlyRate;
      default:
        return 0;
    }
  });
  
  // Handle toggling favorite status
  const handleToggleFavorite = (tutorId: string) => {
    toggleFavorite(tutorId);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Find Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Select
                      value={subject}
                      onValueChange={setSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Subjects</SelectItem>
                        {allSubjects.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location
                    </label>
                    <Select
                      value={location}
                      onValueChange={setLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        {allLocations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Price Range ($/hr)</label>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      max={100}
                      step={5}
                      onValueChange={setPriceRange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="rating" className="text-sm font-medium">
                      Minimum Rating
                    </label>
                    <Select
                      value={minRating?.toString() || ''}
                      onValueChange={(value) => setMinRating(value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="3.5">3.5+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Availability</h3>
                    <div className="grid grid-cols-2 gap-1">
                      {daysOfWeek.map(day => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={() => toggleDay(day)}
                          />
                          <label
                            htmlFor={day}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Apply Filters
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Tutors List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold font-heading">
                {filteredTutors.length} Tutors Available
              </h1>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm whitespace-nowrap">
                  Sort by:
                </label>
                <Select
                  value={sortOrder}
                  onValueChange={setSortOrder}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedTutors.length > 0 ? (
                sortedTutors.map(tutor => (
                  <Card key={tutor.id} className="card-hover">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={tutor.profileImage} 
                          alt={tutor.name} 
                          className="rounded-full h-16 w-16 object-cover"
                        />
                        <div className="flex-grow">
                          <CardTitle className="text-xl">{tutor.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <div className="flex text-yellow-500 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                  {i < Math.floor(tutor.rating) ? (
                                    "★"
                                  ) : i < Math.ceil(tutor.rating) && i < tutor.rating + 0.5 ? (
                                    "⯪"
                                  ) : (
                                    "☆"
                                  )}
                                </span>
                              ))}
                            </div>
                            <span>{tutor.rating.toFixed(1)} ({tutor.reviews.length} reviews)</span>
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(tutor.id)}
                          className={
                            favoriteTutors.some(fav => fav.id === tutor.id) 
                              ? "text-red-500" 
                              : "text-muted-foreground"
                          }
                        >
                          {favoriteTutors.some(fav => fav.id === tutor.id) ? "★" : "☆"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tutor.subjects.map(subject => (
                          <Badge key={subject} className="bg-accent text-accent-foreground">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 mb-3">{tutor.bio}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-muted-foreground">{tutor.location}</p>
                        </div>
                        <div>
                          <p className="font-medium">Rate</p>
                          <p className="text-muted-foreground">${tutor.hourlyRate}/hour</p>
                        </div>
                        <div>
                          <p className="font-medium">Experience</p>
                          <p className="text-muted-foreground line-clamp-1">{tutor.experience}</p>
                        </div>
                        <div>
                          <p className="font-medium">Available</p>
                          <p className="text-muted-foreground">{tutor.availability.days.length} days/week</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link to={`/tutors/${tutor.id}`}>View Profile</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 bg-muted rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No tutors match your search</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
                  <Button onClick={() => searchTutors({})}>Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TutorList;
