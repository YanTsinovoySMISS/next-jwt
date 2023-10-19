import React, { Dispatch, SetStateAction } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "../shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/components/ui/form";
import { Input } from "../shadcn/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../shadcn/components/ui/use-toast";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
});

interface SignInProps {
  setSignInMode: Dispatch<SetStateAction<boolean>>;
}
export default function SignIn({ setSignInMode }: SignInProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      if (response?.error && response.error === "CredentialsSignin") {
        toast({
          title: "Invalid username or password",
          variant: "destructive",
        });
      }
      router.replace("/dashboard");
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
                <CardTitle className="text-2xl text-center">Log in</CardTitle>
                <CardDescription className="text-center">
                  Enter your username and password to log in
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
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
                <Button className="w-full" type="submit">
                  Sign In
                </Button>
                <p className="mt-2 text-xs text-center text-gray-700 cursor-pointer">
                  No account, create one here.
                  <span
                    className=" text-blue-600 hover:underline"
                    onClick={() => {
                      setSignInMode(false);
                    }}
                  >
                    Sign Up
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
