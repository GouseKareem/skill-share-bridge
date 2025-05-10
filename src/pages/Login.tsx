
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
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
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password, selectedRole);
      
      if (selectedRole === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/tutor-dashboard');
      }
    } catch (error) {
      // Error is handled in AuthContext
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Log in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="mb-6">
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
                  Log in as a student to find tutors and manage your learning.
                </p>
              </TabsContent>
              <TabsContent value="tutor">
                <p className="text-sm text-muted-foreground mt-2">
                  Log in as a tutor to manage your profile and connect with students.
                </p>
              </TabsContent>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                
                <div className="flex justify-between items-center text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Demo credentials */}
      <div className="max-w-md mx-auto mb-12 bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Demo Credentials:</h3>
        <p className="text-sm mb-1"><strong>Student:</strong> student@example.com / password</p>
        <p className="text-sm"><strong>Tutor:</strong> tutor@example.com / password</p>
      </div>
    </Layout>
  );
};

export default Login;
