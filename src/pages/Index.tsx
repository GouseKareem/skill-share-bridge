
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { tutors, searchTutors } = useData();
  
  // State for search form
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  
  // Featured tutors - take first 3
  const featuredTutors = tutors.slice(0, 3);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTutors({
      subject,
      location
    });
    navigate('/tutors');
  };
  
  const navigateToSignup = (role: 'student' | 'tutor') => {
    navigate('/signup', { state: { role } });
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 text-gradient">
                Find Your Perfect Tutor in Seconds
              </h1>
              <p className="text-xl mb-8 text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Connect with expert tutors who are passionate about helping you achieve your academic goals.
                Personalized learning made easy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => navigateToSignup('student')}
                  className="font-medium text-base"
                >
                  Find a Tutor
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigateToSignup('tutor')}
                  className="font-medium text-base"
                >
                  Become a Tutor
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&fit=crop"
                alt="Students learning"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto animate-scale-in"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-center mb-8">
              Find a Tutor Today
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Subject (e.g., Math, Science, English)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Featured Tutors Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-4">
            Meet Our Top Tutors
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our tutors are experts in their fields with proven track records of helping students succeed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTutors.map((tutor) => (
              <Card key={tutor.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={tutor.profileImage} 
                      alt={tutor.name} 
                      className="rounded-full h-14 w-14 object-cover"
                    />
                    <div>
                      <CardTitle>{tutor.name}</CardTitle>
                      <CardDescription>
                        {tutor.subjects.join(', ')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
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
                    <span className="text-muted-foreground">{tutor.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{tutor.bio}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-muted-foreground">{tutor.location}</div>
                    <div className="font-medium">${tutor.hourlyRate}/hr</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate(`/tutors/${tutor.id}`)}>
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" onClick={() => navigate('/tutors')}>
              View All Tutors
            </Button>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find your perfect tutor in just a few simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-10 w-10"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-muted-foreground">
                Search for tutors based on subject, location, and your availability.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-10 w-10"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 12h10"></path><path d="M12 7v10"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Review profiles, credentials, and student reviews before selecting your tutor.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-10 w-10"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Learn</h3>
              <p className="text-muted-foreground">
                Schedule sessions, get personalized help, and achieve your academic goals.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button onClick={() => navigate('/how-it-works')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-4">
            Student Success Stories
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hear from students who have achieved their academic goals with the help of our tutors
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <img 
                    src="https://i.pravatar.cc/150?img=32" 
                    alt="Student" 
                    className="rounded-full h-16 w-16 object-cover mb-4"
                  />
                  <div className="text-center">
                    <h3 className="font-medium">Jessica R.</h3>
                    <p className="text-sm text-muted-foreground">High School Student</p>
                  </div>
                </div>
                <p className="text-center italic">
                  "My math tutor helped me go from struggling with algebra to acing my exams. The personalized approach made all the difference!"
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <img 
                    src="https://i.pravatar.cc/150?img=59" 
                    alt="Student" 
                    className="rounded-full h-16 w-16 object-cover mb-4"
                  />
                  <div className="text-center">
                    <h3 className="font-medium">David T.</h3>
                    <p className="text-sm text-muted-foreground">College Student</p>
                  </div>
                </div>
                <p className="text-center italic">
                  "Finding a qualified physics tutor was game-changing for my engineering degree. The flexible scheduling worked perfectly with my busy college life."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <img 
                    src="https://i.pravatar.cc/150?img=44" 
                    alt="Student" 
                    className="rounded-full h-16 w-16 object-cover mb-4"
                  />
                  <div className="text-center">
                    <h3 className="font-medium">Sarah L.</h3>
                    <p className="text-sm text-muted-foreground">Parent</p>
                  </div>
                </div>
                <p className="text-center italic">
                  "As a parent, I appreciate how easy it was to find a qualified tutor for my child. The difference in her confidence and grades has been remarkable!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Ready to Achieve Your Academic Goals?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their learning experience with our expert tutors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigateToSignup('student')}
              className="font-medium text-secondary-foreground"
            >
              Find a Tutor Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigateToSignup('tutor')}
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Share Your Knowledge
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
