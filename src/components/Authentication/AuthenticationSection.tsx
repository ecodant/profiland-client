import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoginFormValues, loginSchema, SignUpFormValues, signUpSchema } from '@/lib/types'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from '@/hooks/use-toast'
import { registerSeller, loginSeller } from '@/services/sellerService'
import { AxiosError } from 'axios'


export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
  
    const loginForm = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: ''
      },
      mode: 'onSubmit' // Only validate on form submission
    })
  
    const signUpForm = useForm<SignUpFormValues>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
        personalId: '',
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        license: 'Seller'
      },
      mode: 'onSubmit' // Only validate on form submission
    })
  
    const onLoginSubmit = async (data: LoginFormValues) => {
      try {
        setIsLoading(true)
        const seller = await loginSeller(data)
        if (seller) {
          toast({
            title: "Logged in successfully",
            description: `Welcome back, ${seller.name}!`,
          })
          // Clear form after successful login
          loginForm.reset() 
        }
      } catch (error) {
        console.log("Bad things my bro");
      } finally {
        setIsLoading(false)
      }
    }
  
    const onSignUpSubmit = async (data: SignUpFormValues) => {
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        })
        return
      }
  
      try {
        setIsLoading(true)
        const newSeller = await registerSeller({
          id: data.personalId,
          name: data.name,
          lastName: data.lastname,
          email: data.email,
          password: data.password,
          license: data.license,
          address: data.address,
          reviews: [],
          contacts: [],
          products: [],
          stats: [],
          chats: [],
          contactRequests: [],
          wall: {
            id: data.personalId,           
            idOwnerSeller: data.personalId, 
            postsReferences: []
          }
        }, "xml")
  
        if (newSeller) {
          toast({
            title: "Registered successfully",
            description: "Your account has been created. Please log in.",
            action: <ToastAction altText="Log in" onClick={() => {
              const loginTab = document.querySelector('[value="login"]') as HTMLButtonElement
              if (loginTab) loginTab.click()
            }}>
              Log in
            </ToastAction>,
          })
          signUpForm.reset() // Clear form after successful registration
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          // Handle specific API errors
          const errorMessage = error.response?.status === 409 
            ? "Email already exists" 
            : "Registration failed. Please try again."
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <div className="flex justify-center items-center mx-auto py-56">
        <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your ID/email and password to log in.</CardDescription>
              </CardHeader>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...loginForm.register('email')} />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...loginForm.register('password')} />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log in'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account.</CardDescription>
              </CardHeader>
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
                <CardContent className="space-y-4">
                  <div className="flex justify-between flex-row space-x-4">
                    <div className="space-y-2 w-3/5">
                      <Label htmlFor="personalId">Personal ID</Label>
                      <Input id="personalId" {...signUpForm.register('personalId')} />
                      {signUpForm.formState.errors.personalId && (
                        <p className="text-sm text-red-500">{signUpForm.formState.errors.personalId.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 w-2/5">
                      <Label htmlFor="license">License</Label>
                      <Select onValueChange={(value) => signUpForm.setValue('license', value as 'Seller' | 'Admin')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a license" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Seller">Seller</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {signUpForm.formState.errors.license && (
                        <p className="text-sm text-red-500">{signUpForm.formState.errors.license.message}</p>
                      )}
                    </div>
                      
                  </div>
                 <div className="flex flex-row justify-between space-x-4">
                    <div className="space-y-2 w-3/5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" {...signUpForm.register('name')} />
                      {signUpForm.formState.errors.name && (
                        <p className="text-sm text-red-500">{signUpForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 w-2/5">
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input id="lastname" {...signUpForm.register('lastname')} />
                      {signUpForm.formState.errors.lastname && (
                        <p className="text-sm text-red-500">{signUpForm.formState.errors.lastname.message}</p>
                      )}
                    </div>
                 </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...signUpForm.register('email')} />
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...signUpForm.register('address')} />
                    {signUpForm.formState.errors.address && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...signUpForm.register('password')} />
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" {...signUpForm.register('confirmPassword')} />
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign up'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }