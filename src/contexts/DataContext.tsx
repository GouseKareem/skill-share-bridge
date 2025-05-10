import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface Tutor {
  id: string;
  name: string;
  profileImage: string;
  subjects: string[];
  hourlyRate: number;
  location: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  qualifications: string[];
  experience: string;
  rating: number;
  reviews: Review[];
  bio: string;
}

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  studentImage: string;
  rating: number;
  comment: string;
  date: string;
  tutorResponse?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface Appointment {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorImage: string;
  studentId: string;
  studentName: string;
  studentImage: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
}

interface DataContextType {
  tutors: Tutor[];
  filteredTutors: Tutor[];
  searchTutors: (params: SearchParams) => void;
  getFavoriteTutors: () => Tutor[];
  toggleFavorite: (tutorId: string) => void;
  getAppointments: () => Appointment[];
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (receiverId: string, content: string) => void;
  markAsRead: (messageId: string) => void;
  addReview: (tutorId: string, rating: number, comment: string) => void;
  respondToReview: (tutorId: string, reviewId: string, response: string) => void;
  getConversationMessages: (conversationId: string) => Message[];
  updateTutorProfile: (tutorData: Partial<Tutor>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  createAppointmentRequest: (tutorId: string, subject: string, date: string, startTime: string, endTime: string) => void;
}

interface SearchParams {
  subject?: string;
  location?: string;
  availability?: {
    days?: string[];
    timeSlots?: string[];
  };
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

// Initial mock data
const initialTutors: Tutor[] = [
  {
    id: '1',
    name: 'Dr. Emily Johnson',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    subjects: ['Mathematics', 'Statistics', 'Calculus'],
    hourlyRate: 40,
    location: 'New York',
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday'],
      timeSlots: ['9:00 AM - 12:00 PM', '3:00 PM - 6:00 PM']
    },
    qualifications: ['Ph.D. in Mathematics', 'Master in Education'],
    experience: '10+ years teaching at university level',
    rating: 4.8,
    reviews: [
      {
        id: '101',
        studentId: '201',
        studentName: 'Michael Brown',
        studentImage: 'https://i.pravatar.cc/150?img=11',
        rating: 5,
        comment: 'Dr. Johnson explains complex concepts in a way that\'s easy to understand. Highly recommended!',
        date: '2023-05-15'
      },
      {
        id: '102',
        studentId: '202',
        studentName: 'Sarah Wilson',
        studentImage: 'https://i.pravatar.cc/150?img=16',
        rating: 4.5,
        comment: 'Very thorough and patient. Helped me get through my calculus finals.',
        date: '2023-04-20'
      }
    ],
    bio: 'I am passionate about making mathematics accessible and engaging for all students. With a Ph.D. in Mathematics and over a decade of teaching experience, I specialize in breaking down complex concepts into understandable components.'
  },
  {
    id: '2',
    name: 'Professor Alex Martinez',
    profileImage: 'https://i.pravatar.cc/150?img=7',
    subjects: ['Physics', 'Engineering', 'Astronomy'],
    hourlyRate: 45,
    location: 'Boston',
    availability: {
      days: ['Wednesday', 'Friday', 'Saturday'],
      timeSlots: ['10:00 AM - 1:00 PM', '4:00 PM - 8:00 PM']
    },
    qualifications: ['Ph.D. in Physics', 'Bachelor in Engineering'],
    experience: '8 years as university professor, 5 years private tutoring',
    rating: 4.9,
    reviews: [
      {
        id: '103',
        studentId: '203',
        studentName: 'Emma Davis',
        studentImage: 'https://i.pravatar.cc/150?img=23',
        rating: 5,
        comment: 'Professor Martinez makes physics fun and interesting. I\'ve improved significantly since working with him.',
        date: '2023-05-10'
      }
    ],
    bio: 'Former NASA researcher turned educator. I believe that understanding physics is key to understanding our universe. My teaching approach combines theoretical knowledge with practical applications.'
  },
  {
    id: '3',
    name: 'Ms. Sophia Lee',
    profileImage: 'https://i.pravatar.cc/150?img=34',
    subjects: ['English Literature', 'Creative Writing', 'Grammar'],
    hourlyRate: 35,
    location: 'Chicago',
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday', 'Sunday'],
      timeSlots: ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM', '6:00 PM - 8:00 PM']
    },
    qualifications: ['Master in English Literature', 'Published Author'],
    experience: '12 years teaching experience, published novelist',
    rating: 4.7,
    reviews: [
      {
        id: '104',
        studentId: '204',
        studentName: 'Daniel Moore',
        studentImage: 'https://i.pravatar.cc/150?img=53',
        rating: 4.5,
        comment: 'Ms. Lee helped me improve my essay writing skills dramatically. Her feedback is always constructive and specific.',
        date: '2023-04-05'
      },
      {
        id: '105',
        studentId: '205',
        studentName: 'Olivia Taylor',
        studentImage: 'https://i.pravatar.cc/150?img=47',
        rating: 5,
        comment: 'I\'ve gained so much confidence in my writing since working with Sophia. She\'s encouraging and insightful.',
        date: '2023-03-22'
      }
    ],
    bio: 'As both a teacher and published author, I bring real-world writing experience to my tutoring sessions. I specialize in helping students find their unique voice and express themselves clearly and effectively through writing.'
  },
  {
    id: '4',
    name: 'Mark Wilson',
    profileImage: 'https://i.pravatar.cc/150?img=50',
    subjects: ['Chemistry', 'Biology', 'Biochemistry'],
    hourlyRate: 38,
    location: 'Seattle',
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: ['11:00 AM - 3:00 PM', '5:00 PM - 8:00 PM']
    },
    qualifications: ['Master in Chemistry', 'Bachelor in Biology'],
    experience: '7 years teaching in high school, 4 years private tutoring',
    rating: 4.6,
    reviews: [
      {
        id: '106',
        studentId: '206',
        studentName: 'James Anderson',
        studentImage: 'https://i.pravatar.cc/150?img=67',
        rating: 4.5,
        comment: 'Mark makes chemistry interesting with real-life examples. My grades have improved a lot.',
        date: '2023-05-18'
      }
    ],
    bio: 'My approach to teaching science focuses on practical applications and hands-on learning. I enjoy helping students connect scientific concepts to everyday life, making the subject more engaging and easier to understand.'
  },
  {
    id: '5',
    name: 'Dr. Robert Chen',
    profileImage: 'https://i.pravatar.cc/150?img=54',
    subjects: ['Computer Science', 'Programming', 'Data Science'],
    hourlyRate: 50,
    location: 'San Francisco',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['1:00 PM - 5:00 PM', '7:00 PM - 9:00 PM']
    },
    qualifications: ['Ph.D. in Computer Science', 'Industry experience at major tech companies'],
    experience: '5 years in Silicon Valley, 8 years teaching CS at university',
    rating: 4.9,
    reviews: [
      {
        id: '107',
        studentId: '207',
        studentName: 'Sophia Garcia',
        studentImage: 'https://i.pravatar.cc/150?img=25',
        rating: 5,
        comment: 'Dr. Chen\'s industry experience makes his teaching practical and relevant. I\'ve learned skills that directly apply to my job.',
        date: '2023-04-25'
      },
      {
        id: '108',
        studentId: '208',
        studentName: 'Ethan Miller',
        studentImage: 'https://i.pravatar.cc/150?img=58',
        rating: 4.8,
        comment: 'Excellent at explaining complex programming concepts in simple terms. Always patient with questions.',
        date: '2023-03-15'
      }
    ],
    bio: 'With a background in both academia and industry, I bring a comprehensive perspective to teaching computer science. I focus on teaching not just theory, but also practical skills that are valuable in today\'s tech industry.'
  }
];

const initialMessages: Message[] = [
  {
    id: '1001',
    senderId: '201',
    senderName: 'Michael Brown',
    receiverId: '1',
    content: 'Hello, I\'m interested in scheduling a tutoring session for calculus. Are you available next week?',
    timestamp: '2023-05-18T14:23:00',
    read: false
  },
  {
    id: '1002',
    senderId: '1',
    senderName: 'Dr. Emily Johnson',
    receiverId: '201',
    content: 'Hi Michael! Yes, I have availability on Tuesday and Thursday afternoons. What specific topics do you need help with?',
    timestamp: '2023-05-18T15:10:00',
    read: true
  },
  {
    id: '1003',
    senderId: '204',
    senderName: 'Daniel Moore',
    receiverId: '3',
    content: 'I need help with my college application essay. When can we meet?',
    timestamp: '2023-05-17T09:45:00',
    read: false
  }
];

const initialConversations: Conversation[] = [
  {
    id: '2001',
    participants: ['1', '201'],
    lastMessage: 'Hi Michael! Yes, I have availability on Tuesday and Thursday afternoons. What specific topics do you need help with?',
    lastMessageTimestamp: '2023-05-18T15:10:00',
    unreadCount: 1
  },
  {
    id: '2002',
    participants: ['3', '204'],
    lastMessage: 'I need help with my college application essay. When can we meet?',
    lastMessageTimestamp: '2023-05-17T09:45:00',
    unreadCount: 1
  }
];

const initialAppointments: Appointment[] = [
  {
    id: '3001',
    tutorId: '1',
    tutorName: 'Dr. Emily Johnson',
    tutorImage: 'https://i.pravatar.cc/150?img=5',
    studentId: '201',
    studentName: 'Michael Brown',
    studentImage: 'https://i.pravatar.cc/150?img=11',
    subject: 'Calculus',
    date: '2023-05-25',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    status: 'confirmed'
  },
  {
    id: '3002',
    tutorId: '3',
    tutorName: 'Ms. Sophia Lee',
    tutorImage: 'https://i.pravatar.cc/150?img=34',
    studentId: '204',
    studentName: 'Daniel Moore',
    studentImage: 'https://i.pravatar.cc/150?img=53',
    subject: 'Essay Writing',
    date: '2023-05-27',
    startTime: '1:00 PM',
    endTime: '2:30 PM',
    status: 'pending'
  }
];

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>(initialTutors);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  // Search functionality
  const searchTutors = (params: SearchParams) => {
    let results = [...tutors];
    
    if (params.subject) {
      results = results.filter(tutor => 
        tutor.subjects.some(subject => 
          subject.toLowerCase().includes(params.subject?.toLowerCase() || '')
        )
      );
    }
    
    if (params.location) {
      results = results.filter(tutor => 
        tutor.location.toLowerCase().includes(params.location?.toLowerCase() || '')
      );
    }
    
    if (params.availability?.days?.length) {
      results = results.filter(tutor => 
        params.availability?.days?.some(day => tutor.availability.days.includes(day))
      );
    }
    
    if (params.minPrice !== undefined) {
      results = results.filter(tutor => tutor.hourlyRate >= (params.minPrice || 0));
    }
    
    if (params.maxPrice !== undefined) {
      results = results.filter(tutor => tutor.hourlyRate <= (params.maxPrice || 1000));
    }
    
    if (params.minRating !== undefined) {
      results = results.filter(tutor => tutor.rating >= (params.minRating || 0));
    }
    
    setFilteredTutors(results);
  };

  // Toggle favorite status
  const toggleFavorite = (tutorId: string) => {
    if (favorites.includes(tutorId)) {
      setFavorites(favorites.filter(id => id !== tutorId));
    } else {
      setFavorites([...favorites, tutorId]);
    }
  };

  // Get favorite tutors
  const getFavoriteTutors = () => {
    return tutors.filter(tutor => favorites.includes(tutor.id));
  };

  // Get appointments for current user
  const getAppointments = () => {
    if (!user) return [];
    
    return appointments.filter(appointment => {
      if (user.role === 'student') {
        return appointment.studentId === user.id;
      } else if (user.role === 'tutor') {
        return appointment.tutorId === user.id;
      }
      return false;
    });
  };

  // Send message
  const sendMessage = (receiverId: string, content: string) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    
    // Update or create conversation
    const existingConversation = conversations.find(c => 
      c.participants.includes(user.id) && c.participants.includes(receiverId)
    );
    
    if (existingConversation) {
      setConversations(conversations.map(c => 
        c.id === existingConversation.id ? {
          ...c,
          lastMessage: content,
          lastMessageTimestamp: newMessage.timestamp,
          unreadCount: c.unreadCount + 1
        } : c
      ));
    } else {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        participants: [user.id, receiverId],
        lastMessage: content,
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: 1
      };
      setConversations([...conversations, newConversation]);
    }
  };

  // Mark message as read
  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
    
    // Update conversation unread count
    const message = messages.find(m => m.id === messageId);
    if (message && user) {
      const conversationToUpdate = conversations.find(c => 
        c.participants.includes(message.senderId) && c.participants.includes(message.receiverId)
      );
      
      if (conversationToUpdate) {
        setConversations(conversations.map(c => 
          c.id === conversationToUpdate.id ? { ...c, unreadCount: 0 } : c
        ));
      }
    }
  };

  // Add review
  const addReview = (tutorId: string, rating: number, comment: string) => {
    if (!user || user.role !== 'student') return;
    
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      studentImage: user.profileImage || 'https://i.pravatar.cc/150?img=12',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setTutors(tutors.map(tutor => {
      if (tutor.id === tutorId) {
        // Calculate new average rating
        const totalReviews = tutor.reviews.length;
        const totalRating = tutor.reviews.reduce((sum, review) => sum + review.rating, 0);
        const newAverageRating = ((totalRating + rating) / (totalReviews + 1)).toFixed(1);
        
        return {
          ...tutor,
          reviews: [...tutor.reviews, newReview],
          rating: parseFloat(newAverageRating)
        };
      }
      return tutor;
    }));
    
    // Also update filtered tutors
    setFilteredTutors(prevFiltered => 
      prevFiltered.map(tutor => {
        if (tutor.id === tutorId) {
          const totalReviews = tutor.reviews.length;
          const totalRating = tutor.reviews.reduce((sum, review) => sum + review.rating, 0);
          const newAverageRating = ((totalRating + rating) / (totalReviews + 1)).toFixed(1);
          
          return {
            ...tutor,
            reviews: [...tutor.reviews, newReview],
            rating: parseFloat(newAverageRating)
          };
        }
        return tutor;
      })
    );
  };

  // Tutor response to review
  const respondToReview = (tutorId: string, reviewId: string, response: string) => {
    if (!user || user.role !== 'tutor') return;
    
    setTutors(tutors.map(tutor => {
      if (tutor.id === tutorId) {
        return {
          ...tutor,
          reviews: tutor.reviews.map(review => 
            review.id === reviewId ? { ...review, tutorResponse: response } : review
          )
        };
      }
      return tutor;
    }));
    
    // Also update filtered tutors
    setFilteredTutors(prevFiltered => 
      prevFiltered.map(tutor => {
        if (tutor.id === tutorId) {
          return {
            ...tutor,
            reviews: tutor.reviews.map(review => 
              review.id === reviewId ? { ...review, tutorResponse: response } : review
            )
          };
        }
        return tutor;
      })
    );
  };

  // Get messages for a specific conversation
  const getConversationMessages = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return [];
    
    return messages.filter(msg => 
      conversation.participants.includes(msg.senderId) && 
      conversation.participants.includes(msg.receiverId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // Update tutor profile
  const updateTutorProfile = (tutorData: Partial<Tutor>) => {
    if (!user || user.role !== 'tutor') return;
    
    setTutors(tutors.map(tutor => 
      tutor.id === user.id ? { ...tutor, ...tutorData } : tutor
    ));
    
    // Also update filtered tutors
    setFilteredTutors(prevFiltered => 
      prevFiltered.map(tutor => 
        tutor.id === user.id ? { ...tutor, ...tutorData } : tutor
      )
    );
  };

  // Update appointment status
  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, status } : appointment
    ));
  };

  // Create appointment request
  const createAppointmentRequest = (tutorId: string, subject: string, date: string, startTime: string, endTime: string) => {
    if (!user || user.role !== 'student') return;
    
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) return;
    
    const newAppointment: Appointment = {
      id: `app_${Date.now()}`,
      tutorId,
      tutorName: tutor.name,
      tutorImage: tutor.profileImage,
      studentId: user.id,
      studentName: user.name,
      studentImage: user.profileImage || 'https://i.pravatar.cc/150?img=12',
      subject,
      date,
      startTime,
      endTime,
      status: 'pending'
    };
    
    setAppointments([...appointments, newAppointment]);
  };

  const value = {
    tutors,
    filteredTutors,
    searchTutors,
    getFavoriteTutors,
    toggleFavorite,
    getAppointments,
    messages,
    conversations,
    sendMessage,
    markAsRead,
    addReview,
    respondToReview,
    getConversationMessages,
    updateTutorProfile,
    updateAppointmentStatus,
    createAppointmentRequest
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook for using data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
