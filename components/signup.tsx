import { Dispatch, SetStateAction } from "react";
import { Button } from "../shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/components/ui/card";
import { Input } from "../shadcn/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../shadcn/components/ui/use-toast";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/components/ui/form";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
  name: z.string().min(2).max(50),
});

interface SignUpProps {
  setSignInMode: Dispatch<SetStateAction<boolean>>;
}
export default function SignUn({ setSignInMode }: SignUpProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newUser = {
        name: values.name,
        username: values.username,
        password: values.password,
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.userExists) {
        toast({
          title: "User already exists",
          variant: "destructive",
        });
      } else {
        form.setValue("username", "");
        form.setValue("password", "");
        form.setValue("name", "");
        toast({
          title: "Account created successfully",
          variant: "success",
        });
        setSignInMode(true);
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full m-auto bg-white lg:max-w-lg">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">
                  Create an account
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your username and password to sign up
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder="Enter password..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full">Sign Up</Button>
                <p className="mt-2 text-xs text-center text-gray-700 cursor-pointer">
                  {" "}
                  Already have an account?{" "}
                  <span
                    className=" text-blue-600 hover:underline"
                    onClick={() => {
                      setSignInMode(true);
                    }}
                  >
                    Sign In
                  </span>
                </p>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
