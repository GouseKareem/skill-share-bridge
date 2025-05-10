
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const preselectedRole = location.state?.role as UserRole;
  const [selectedRole, setSelectedRole] = useState<UserRole>(preselectedRole || 'student');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Update tab if role is preset from navigation
  useEffect(() => {
    if (preselectedRole) {
      setSelectedRole(preselectedRole);
    }
  }, [preselectedRole]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signup(values.name, values.email, values.password, selectedRole);
      
      if (selectedRole === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/tutor-dashboard');
      }
    } catch (error) {
      // Error is handled in AuthContext
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Join our community to start your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedRole} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="student"
                  onClick={() => setSelectedRole('student')}
                >
                  Student
                </TabsTrigger>
                <TabsTrigger 
                  value="tutor"
                  onClick={() => setSelectedRole('tutor')}
                >
                  Tutor
                </TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <p className="text-sm text-muted-foreground mt-2">
                  Sign up as a student to find tutors and get help with your studies.
                </p>
              </TabsContent>
              <TabsContent value="tutor">
                <p className="text-sm text-muted-foreground mt-2">
                  Sign up as a tutor to share your knowledge and connect with students.
                </p>
              </TabsContent>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
