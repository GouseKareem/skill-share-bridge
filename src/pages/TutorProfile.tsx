
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Tutor } from '@/contexts/DataContext';
import { toast } from 'sonner';

const TutorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { tutors, getFavoriteTutors, toggleFavorite, createAppointmentRequest, sendMessage } = useData();
  
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      const tutorData = tutors.find(t => t.id === id);
      if (tutorData) {
        setTutor(tutorData);
        
        // Check if tutor is in favorites
        const favorites = getFavoriteTutors();
        setIsFavorite(favorites.some(fav => fav.id === id));
        
        // Set default subject if available
        if (tutorData.subjects.length > 0) {
          setSubject(tutorData.subjects[0]);
        }
      } else {
        // Handle tutor not found
        navigate('/tutors');
        toast.error('Tutor not found');
      }
    }
  }, [id, tutors, getFavoriteTutors, navigate]);
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    toggleFavorite(id!);
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success('Tutor added to favorites');
    } else {
      toast.success('Tutor removed from favorites');
    }
  };
  
  const handleBookSession = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot || !subject) {
      toast.error('Please select a date, time slot, and subject');
      return;
    }
    
    // Extract start and end times from the selected time slot
    const [startTime, endTime] = selectedTimeSlot.split(' - ');
    
    // Format date as 'YYYY-MM-DD'
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    createAppointmentRequest(
      tutor!.id,
      subject,
      formattedDate,
      startTime,
      endTime
    );
    
    setDialogOpen(false);
    toast.success('Session request sent! You can view the status in your dashboard.');
  };
  
  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    sendMessage(tutor!.id, messageText);
    setMessageText('');
    toast.success('Message sent! You can view your conversation in the messages section.');
  };
  
  if (!tutor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Calculate available dates (mock - just next 14 days)
  const getAvailableDates = () => {
    const today = new Date();
    const availableDates: Date[] = [];
    
    // Add next 14 days if they match tutor's available days
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Get day name
      const dayName = format(date, 'EEEE');
      
      // Check if this day is in tutor's availability
      if (tutor.availability.days.includes(dayName)) {
        availableDates.push(date);
      }
    }
    
    return availableDates;
  };
  
  // For date picker - determine if a day should be disabled
  const isDateDisabled = (date: Date) => {
    const dayName = format(date, 'EEEE');
    return !tutor.availability.days.includes(dayName);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:w-1/4">
              <img 
                src={tutor.profileImage} 
                alt={tutor.name} 
                className="rounded-lg w-full aspect-square object-cover"
              />
            </div>
            
            <div className="md:w-3/4 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold font-heading">{tutor.name}</h1>
                  <div className="flex items-center mt-2">
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
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant={isFavorite ? "default" : "outline"}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? "★ Favorite" : "☆ Add to Favorites"}
                  </Button>
                  
                  {isAuthenticated && userRole === 'student' && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Book a Session</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
                          <DialogDescription>
                            Select a date, time slot, and subject for your tutoring session.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <Select 
                              value={subject} 
                              onValueChange={setSubject}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {tutor.subjects.map(sub => (
                                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <div className="border rounded-md p-2">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => 
                                  date < new Date() || // Disable past dates
                                  isDateDisabled(date)
                                }
                                className="mx-auto"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Available on: {tutor.availability.days.join(', ')}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Time Slot</label>
                            <Select 
                              value={selectedTimeSlot} 
                              onValueChange={setSelectedTimeSlot}
                              disabled={!selectedDate}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {tutor.availability.timeSlots.map(slot => (
                                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit" onClick={handleBookSession}>
                            Request Session
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {tutor.subjects.map(subject => (
                  <Badge key={subject} className="bg-accent text-accent-foreground">
                    {subject}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Hourly Rate:</span>
                  <span>${tutor.hourlyRate}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{tutor.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Available Days:</span>
                  <span>{tutor.availability.days.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time Slots:</span>
                  <span>{tutor.availability.timeSlots.length} slots</span>
                </div>
              </div>
              
              <div>
                <h2 className="font-medium mb-1">About Me</h2>
                <p className="text-muted-foreground">{tutor.bio}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Tabs */}
        <Tabs defaultValue="experience">
          <TabsList className="mb-6 grid grid-cols-3 md:w-fit">
            <TabsTrigger value="experience">Experience & Qualifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience & Qualifications</CardTitle>
                <CardDescription>Learn more about {tutor.name}'s background and expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Qualifications</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {tutor.qualifications.map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Experience</h3>
                  <p className="text-muted-foreground">{tutor.experience}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map(subject => (
                      <Badge key={subject} variant="outline">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isAuthenticated && userRole === 'student' && (
                  <Button className="w-full" onClick={() => setDialogOpen(true)}>
                    Book a Session with {tutor.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  {tutor.reviews.length} reviews • {tutor.rating.toFixed(1)} average rating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tutor.reviews.length > 0 ? (
                  tutor.reviews.map(review => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={review.studentImage} 
                            alt={review.studentName} 
                            className="rounded-full h-10 w-10 object-cover"
                          />
                          <div>
                            <p className="font-medium">{review.studentName}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p>{review.comment}</p>
                      
                      {review.tutorResponse && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Response from {tutor.name}:</p>
                          <p className="text-sm">{review.tutorResponse}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact {tutor.name}</CardTitle>
                <CardDescription>
                  Send a message to ask questions or discuss your learning needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated && userRole === 'student' ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="w-full min-h-[150px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Type your message here..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <Button onClick={handleSendMessage}>
                      Send Message
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You need to be logged in as a student to contact this tutor.</p>
                    <Button asChild>
                      <Link to="/login">Login as Student</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Similar Tutors */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold font-heading mb-6">Similar Tutors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors
              .filter(t => 
                t.id !== tutor.id && 
                t.subjects.some(s => tutor.subjects.includes(s))
              )
              .slice(0, 3)
              .map(similarTutor => (
                <Card key={similarTutor.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={similarTutor.profileImage} 
                        alt={similarTutor.name} 
                        className="rounded-full h-12 w-12 object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{similarTutor.name}</CardTitle>
                        <CardDescription>
                          {similarTutor.subjects.join(', ')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(similarTutor.rating) ? (
                              "★"
                            ) : i < Math.ceil(similarTutor.rating) && i < similarTutor.rating + 0.5 ? (
                              "⯪"
                            ) : (
                              "☆"
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="text-muted-foreground">{similarTutor.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-2">{similarTutor.bio}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground">{similarTutor.location}</div>
                      <div className="font-medium">${similarTutor.hourlyRate}/hr</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to={`/tutors/${similarTutor.id}`}>View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TutorProfile;
