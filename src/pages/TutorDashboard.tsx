
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Appointment } from '@/contexts/DataContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// Profile form schema
const profileFormSchema = z.object({
  bio: z.string().min(20, { message: 'Bio must be at least 20 characters' }),
  hourlyRate: z.preprocess(
    (value) => (value === '' ? undefined : Number(value)),
    z.number().min(1, { message: 'Hourly rate must be at least $1' }).max(500, { message: 'Hourly rate cannot exceed $500' })
  ),
  subjects: z.string().min(1, { message: 'Please enter at least one subject' }),
  qualifications: z.string().min(1, { message: 'Please enter your qualifications' }),
  experience: z.string().min(1, { message: 'Please enter your experience' }),
});

// Availability days of week
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Time slots
const timeSlots = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
];

const TutorDashboard = () => {
  const { user, isAuthenticated, userRole } = useAuth();
  const { getAppointments, updateAppointmentStatus, tutors, updateTutorProfile, conversations } = useData();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<Appointment[]>([]);
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<{
    days: string[];
    timeSlots: string[];
  }>({ days: [], timeSlots: [] });
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Form setup
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: '',
      hourlyRate: 0,
      subjects: '',
      qualifications: '',
      experience: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get tutor profile
      const profile = tutors.find(t => t.id === user.id);
      if (profile) {
        setTutorProfile(profile);
        setSelectedAvailability(profile.availability);
        
        // Populate form
        form.setValue('bio', profile.bio);
        form.setValue('hourlyRate', profile.hourlyRate);
        form.setValue('subjects', profile.subjects.join(', '));
        form.setValue('qualifications', profile.qualifications.join(', '));
        form.setValue('experience', profile.experience);
      }
      
      // Get appointments
      const allAppointments = getAppointments();
      setAppointments(allAppointments);
      
      // Split appointments by status
      const pending = allAppointments.filter(a => a.status === 'pending');
      setPendingAppointments(pending);
      
      const upcoming = allAppointments.filter(a => 
        a.status === 'confirmed' && new Date(`${a.date}T${a.startTime}`) > new Date()
      );
      setUpcomingAppointments(upcoming);
      
      const completed = allAppointments.filter(a => 
        a.status === 'completed' || (
          a.status === 'confirmed' && new Date(`${a.date}T${a.startTime}`) <= new Date()
        )
      );
      setCompletedAppointments(completed);
      
      // Count unread messages
      const unread = conversations.reduce((count, conv) => count + conv.unreadCount, 0);
      setUnreadMessages(unread);
    }
  }, [isAuthenticated, user, tutors, getAppointments, form, conversations]);

  // Form submit handler
  const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
    const updatedProfile = {
      bio: data.bio,
      hourlyRate: data.hourlyRate,
      subjects: data.subjects.split(',').map(s => s.trim()),
      qualifications: data.qualifications.split(',').map(q => q.trim()),
      experience: data.experience,
      availability: selectedAvailability
    };
    
    updateTutorProfile(updatedProfile);
    toast.success('Profile updated successfully');
  };

  // Handle appointment status update
  const handleAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    updateAppointmentStatus(appointmentId, status);
    
    // Refresh appointments
    const allAppointments = getAppointments();
    setAppointments(allAppointments);
    
    // Split appointments by status
    const pending = allAppointments.filter(a => a.status === 'pending');
    setPendingAppointments(pending);
    
    const upcoming = allAppointments.filter(a => 
      a.status === 'confirmed' && new Date(`${a.date}T${a.startTime}`) > new Date()
    );
    setUpcomingAppointments(upcoming);
    
    toast.success(`Appointment ${status}`);
  };

  // Toggle day selection for availability
  const toggleDaySelection = (day: string) => {
    setSelectedAvailability(prev => {
      if (prev.days.includes(day)) {
        return {
          ...prev,
          days: prev.days.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          days: [...prev.days, day]
        };
      }
    });
  };

  // Toggle time slot selection for availability
  const toggleTimeSlotSelection = (timeSlot: string) => {
    setSelectedAvailability(prev => {
      if (prev.timeSlots.includes(timeSlot)) {
        return {
          ...prev,
          timeSlots: prev.timeSlots.filter(t => t !== timeSlot)
        };
      } else {
        return {
          ...prev,
          timeSlots: [...prev.timeSlots, timeSlot]
        };
      }
    });
  };

  // If not authenticated or not a tutor, redirect to login
  if (!isAuthenticated || userRole !== 'tutor') {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">Tutor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/messages">
                Messages
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadMessages}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/profile">View Public Profile</Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <p className="text-muted-foreground">Pending Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-muted-foreground">Upcoming Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
              <p className="text-muted-foreground">Completed Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{tutorProfile?.rating || 0}</div>
              <p className="text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="requests">
          <TabsList className="mb-8">
            <TabsTrigger value="requests">Session Requests</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          {/* Session Requests Tab */}
          <TabsContent value="requests">
            <div className="grid grid-cols-1 gap-6">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <img 
                        src={appointment.studentImage} 
                        alt={appointment.studentName} 
                        className="rounded-full h-12 w-12 object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl">{appointment.subject} with {appointment.studentName}</CardTitle>
                        <CardDescription>
                          {appointment.date} • {appointment.startTime} - {appointment.endTime}
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-500">Pending</Badge>
                    </CardHeader>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="destructive"
                        onClick={() => handleAppointmentStatus(appointment.id, 'canceled')}
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => handleAppointmentStatus(appointment.id, 'confirmed')}
                      >
                        Accept
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">You don't have any pending session requests.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Upcoming Sessions Tab */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-6">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <img 
                        src={appointment.studentImage} 
                        alt={appointment.studentName} 
                        className="rounded-full h-12 w-12 object-cover"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl">{appointment.subject} with {appointment.studentName}</CardTitle>
                        <CardDescription>
                          {appointment.date} • {appointment.startTime} - {appointment.endTime}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500">Confirmed</Badge>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to={`/messages/${appointment.studentId}`}>Message Student</Link>
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleAppointmentStatus(appointment.id, 'canceled')}
                      >
                        Cancel Session
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">You don't have any upcoming sessions.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Edit Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information to attract more students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell students about yourself and your teaching approach" 
                                  {...field}
                                  rows={5}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="hourlyRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hourly Rate ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="subjects"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subjects (comma separated)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Math, Physics, Chemistry" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="qualifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qualifications (comma separated)</FormLabel>
                              <FormControl>
                                <Input placeholder="Ph.D. in Physics, Master in Education" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your teaching experience" 
                                  {...field}
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          Save Profile
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                    <CardDescription>
                      Set your available days and time slots
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Available Days</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day}`}
                              checked={selectedAvailability.days.includes(day)}
                              onCheckedChange={() => toggleDaySelection(day)}
                            />
                            <label
                              htmlFor={`day-${day}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Available Time Slots</h4>
                      <div className="space-y-2">
                        {timeSlots.map((slot) => (
                          <div key={slot} className="flex items-center space-x-2">
                            <Checkbox
                              id={`time-${slot}`}
                              checked={selectedAvailability.timeSlots.includes(slot)}
                              onCheckedChange={() => toggleTimeSlotSelection(slot)}
                            />
                            <label
                              htmlFor={`time-${slot}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {slot}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        updateTutorProfile({ availability: selectedAvailability });
                        toast.success('Availability updated');
                      }}
                    >
                      Update Availability
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  See what your students say about your teaching
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tutorProfile && tutorProfile.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {tutorProfile.reviews.map((review) => (
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
                        
                        {review.tutorResponse ? (
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm font-medium mb-1">Your Response:</p>
                            <p className="text-sm">{review.tutorResponse}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium mb-1">Respond to this review:</p>
                            <div className="flex space-x-2">
                              <Input 
                                placeholder="Write a response..."
                                className="flex-grow"
                                id={`response-${review.id}`}
                              />
                              <Button 
                                onClick={() => {
                                  const response = (document.getElementById(`response-${review.id}`) as HTMLInputElement).value;
                                  if (response.trim()) {
                                    // Call to update review with response
                                    toast.success('Response added');
                                  }
                                }}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet. As you complete more sessions, students will be able to leave reviews.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TutorDashboard;
