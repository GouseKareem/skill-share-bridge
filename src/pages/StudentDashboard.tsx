
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';

const StudentDashboard = () => {
  const { user, isAuthenticated, userRole } = useAuth();
  const { 
    tutors, 
    filteredTutors, 
    searchTutors, 
    getAppointments, 
    toggleFavorite, 
    getFavoriteTutors 
  } = useData();
  
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [favoriteTutors, setFavoriteTutors] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Get appointments and split into upcoming and past
      const allAppointments = getAppointments();
      const now = new Date();
      
      const upcoming = allAppointments.filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
        return appointmentDate > now || appointment.status === 'pending';
      });
      
      const past = allAppointments.filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
        return appointmentDate <= now && appointment.status !== 'pending';
      });
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      
      // Get favorite tutors
      setFavoriteTutors(getFavoriteTutors());
    }
  }, [isAuthenticated, getAppointments, getFavoriteTutors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTutors({
      subject,
      location,
      minPrice,
      maxPrice,
      minRating
    });
  };

  // If not authenticated or not a student, redirect to login
  if (!isAuthenticated || userRole !== 'student') {
    return <Navigate to="/login" />;
  }

  const handleToggleFavorite = (tutorId: string) => {
    toggleFavorite(tutorId);
    setFavoriteTutors(getFavoriteTutors());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Canceled</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <Button asChild>
            <Link to="/find-tutors">Find New Tutors</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Tutors</TabsTrigger>
            <TabsTrigger value="search">Search Tutors</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-6">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <img 
                        src={appointment.tutorImage} 
                        alt={appointment.tutorName} 
                        className="rounded-full h-12 w-12 object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl">{appointment.subject} with {appointment.tutorName}</CardTitle>
                        <CardDescription>
                          {appointment.date} • {appointment.startTime} - {appointment.endTime}
                        </CardDescription>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to={`/messages/${appointment.tutorId}`}>Message Tutor</Link>
                      </Button>
                      {appointment.status === 'confirmed' && (
                        <Button variant="destructive">Cancel Session</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">You don't have any upcoming sessions.</p>
                    <Button asChild>
                      <Link to="/tutors">Find a Tutor</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Past Appointments Tab */}
          <TabsContent value="past">
            <div className="grid grid-cols-1 gap-6">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <img 
                        src={appointment.tutorImage} 
                        alt={appointment.tutorName} 
                        className="rounded-full h-12 w-12 object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl">{appointment.subject} with {appointment.tutorName}</CardTitle>
                        <CardDescription>
                          {appointment.date} • {appointment.startTime} - {appointment.endTime}
                        </CardDescription>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to={`/tutors/${appointment.tutorId}`}>View Profile</Link>
                      </Button>
                      {appointment.status === 'completed' && (
                        <Button asChild>
                          <Link to={`/review/${appointment.tutorId}`}>Leave Review</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">You don't have any past sessions.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTutors.length > 0 ? (
                favoriteTutors.map((tutor) => (
                  <Card key={tutor.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={tutor.profileImage} 
                          alt={tutor.name} 
                          className="rounded-full h-12 w-12 object-cover"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tutor.name}</CardTitle>
                          <CardDescription>
                            {tutor.subjects.join(', ')}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(tutor.id)}
                          className="text-red-500"
                        >
                          ★
                        </Button>
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
                      <p className="text-muted-foreground line-clamp-2">{tutor.bio}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-muted-foreground">{tutor.location}</div>
                        <div className="font-medium">${tutor.hourlyRate}/hr</div>
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
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">You don't have any favorite tutors yet.</p>
                    <Button asChild>
                      <Link to="/tutors">Find Tutors</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Search Tab */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Find a Tutor</CardTitle>
                <CardDescription>
                  Search for tutors by subject, location, and other criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="e.g., Mathematics, Physics, English"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-1">
                        Location
                      </label>
                      <Input
                        id="location"
                        placeholder="e.g., New York, Boston"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
                        Min Price/Hour ($)
                      </label>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="Min"
                        value={minPrice || ''}
                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    <div>
                      <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
                        Max Price/Hour ($)
                      </label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="Max"
                        value={maxPrice || ''}
                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    <div>
                      <label htmlFor="minRating" className="block text-sm font-medium mb-1">
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
                          <SelectItem value="">Any rating</SelectItem>
                          <SelectItem value="4.5">4.5+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="3.5">3.5+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Search Tutors
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutors.length > 0 ? (
                  filteredTutors.map((tutor) => (
                    <Card key={tutor.id} className="card-hover">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={tutor.profileImage} 
                            alt={tutor.name} 
                            className="rounded-full h-12 w-12 object-cover"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg">{tutor.name}</CardTitle>
                            <CardDescription>
                              {tutor.subjects.join(', ')}
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
                        <p className="text-muted-foreground line-clamp-2">{tutor.bio}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-muted-foreground">{tutor.location}</div>
                          <div className="font-medium">${tutor.hourlyRate}/hr</div>
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
                  <Card className="col-span-full">
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No tutors found matching your search criteria.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
