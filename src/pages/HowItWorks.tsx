
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-accent py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              How TutorMatch Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A simple, three-step process to connect with the perfect tutor for your learning needs
            </p>
          </div>
        </div>
      </section>
      
      {/* Step by Step Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                <span className="text-primary text-4xl font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold font-heading mb-4">Search for Tutors</h2>
              <p className="text-muted-foreground mb-4">
                Use our advanced search to find tutors based on subject, location, availability, and budget. 
                Browse detailed profiles with qualifications, experience, and reviews.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&fit=crop" 
                alt="Search for tutors" 
                className="rounded-lg shadow-md mt-4"
              />
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                <span className="text-primary text-4xl font-bold">2</span>
              </div>
              <h2 className="text-2xl font-bold font-heading mb-4">Book a Session</h2>
              <p className="text-muted-foreground mb-4">
                Select your preferred tutor, choose a date and time that works for both of you, 
                and send a booking request. Message your tutor to discuss your learning goals.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&fit=crop" 
                alt="Book a session" 
                className="rounded-lg shadow-md mt-4"
              />
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                <span className="text-primary text-4xl font-bold">3</span>
              </div>
              <h2 className="text-2xl font-bold font-heading mb-4">Learn & Grow</h2>
              <p className="text-muted-foreground mb-4">
                Meet with your tutor and get personalized instruction tailored to your needs. 
                Track your progress, manage your schedule, and leave reviews after your sessions.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&fit=crop" 
                alt="Learn and grow" 
                className="rounded-lg shadow-md mt-4"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* For Students */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">For Students</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Find the Perfect Match</h3>
              <p className="text-muted-foreground">
                Search our extensive database of qualified tutors to find someone with the right expertise,
                teaching style, and personality for your learning needs.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground">
                Book sessions that fit your schedule. Whether you need regular weekly sessions or
                last-minute help before an exam, our tutors can accommodate your needs.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Direct Communication</h3>
              <p className="text-muted-foreground">
                Message tutors directly to discuss your goals, ask questions about their
                teaching approach, or get clarification on session details.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground">
                Read verified reviews from other students, ensuring you select a tutor with a 
                proven track record of helping students achieve their goals.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/tutors">Find a Tutor</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* For Tutors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">For Tutors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efd?q=80&w=600&fit=crop" 
                alt="Tutor teaching" 
                className="rounded-lg shadow-md w-full h-auto" 
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-primary mr-2"><path d="M20 6 9 17l-5-5"></path></svg>
                  Create Your Professional Profile
                </h3>
                <p className="text-muted-foreground">
                  Showcase your qualifications, expertise, teaching approach, and availability
                  to attract students who match your teaching style.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-primary mr-2"><path d="M20 6 9 17l-5-5"></path></svg>
                  Set Your Own Schedule
                </h3>
                <p className="text-muted-foreground">
                  Work when it suits you. Set your availability, accept session requests that fit your 
                  schedule, and maintain full control over your tutoring calendar.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-primary mr-2"><path d="M20 6 9 17l-5-5"></path></svg>
                  Build Your Reputation
                </h3>
                <p className="text-muted-foreground">
                  Collect reviews and ratings from satisfied students to build your reputation
                  and attract more students to your tutoring services.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-primary mr-2"><path d="M20 6 9 17l-5-5"></path></svg>
                  Manage Your Business
                </h3>
                <p className="text-muted-foreground">
                  Keep track of your sessions, student communications, and earnings all in one place 
                  with our comprehensive tutor dashboard.
                </p>
              </div>
              
              <div className="pt-4">
                <Button asChild size="lg">
                  <Link to={{ pathname: "/signup", state: { role: 'tutor' } }}>Become a Tutor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">How do I choose the right tutor?</h3>
                <p className="text-muted-foreground">
                  We recommend reviewing tutor profiles carefully, including their qualifications, 
                  experience, teaching approach, and student reviews. You can also message potential 
                  tutors to ask questions before booking a session.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">What subjects are available for tutoring?</h3>
                <p className="text-muted-foreground">
                  Our platform hosts tutors for a wide range of academic subjects, including 
                  mathematics, science, languages, humanities, test preparation, and professional skills. 
                  Use our search filters to find tutors for your specific subject needs.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">How much do tutoring sessions cost?</h3>
                <p className="text-muted-foreground">
                  Tutoring rates vary based on subject, tutor experience, and session duration. 
                  Tutors set their own rates, which are clearly displayed on their profiles. 
                  You can use our price filter to find tutors that match your budget.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">What qualifications do your tutors have?</h3>
                <p className="text-muted-foreground">
                  Our tutors come from diverse backgrounds, including certified teachers, 
                  university professors, industry professionals, and graduate students. 
                  Each tutor's qualifications are listed on their profile for transparency.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">How do I become a tutor on your platform?</h3>
                <p className="text-muted-foreground">
                  To become a tutor, sign up for a tutor account, complete your profile with your 
                  qualifications, experience, and teaching approach, set your availability and rates, 
                  and start accepting session requests from students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find your perfect tutor today and take the first step towards achieving your academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              asChild
            >
              <Link to="/signup">Sign Up as a Student</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to={{ pathname: "/signup", state: { role: 'tutor' } }}>
                Become a Tutor
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
