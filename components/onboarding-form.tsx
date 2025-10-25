"use client";

import { userSchema } from '@/lib/schema';
import React, { useState } from 'react';
import { useForm } from "react-hook-form"; 
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { countryList } from '@/utils/countriesList';
import { industryTypeList, roleList } from '@/utils';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { createUser } from '@/app/actions/user';

interface Props {
  name: string;
  email: string;
  image?: string;
}

export type UserDataType = z.infer<typeof userSchema>;

export const OnboardingForm = ({ name, email, image }: Props) => {
  const [pending, setPending] = useState(false);
  const form = useForm<UserDataType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      about: "",
      name: name || "",
      email: email,
      image: image || "",
      role: "",
      industryType: "",
    },
  });

  const onSubmit = async (data: UserDataType) => {
    try {
      setPending(true);
      await createUser(data);
      toast.success("Welcome aboard! Your profile has been set up.");
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) return;
      console.error(error);
      toast.error("Something went wrong. Try again later");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg hover:shadow-xl transition-all duration-300 border-border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">Welcome to Trackly</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your project management — simplified
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6 animate-in fade-in-0 duration-700"
            >
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="transition-all focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="transition-all focus:ring-2 focus:ring-ring focus:ring-offset-1">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {countryList.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            <div className="flex items-center gap-2">
                              <img src={country.flag} alt={country.name} className="w-4 h-3" />
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="industryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Industry Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-ring focus:ring-offset-1">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industryTypeList.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Role at Organization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-ring focus:ring-offset-1">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleList.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* About */}
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">About</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us a bit about yourself..."
                        className="resize-none h-24 transition-all focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button 
                type="submit" 
                disabled={pending}
                className="w-full py-5 text-base font-medium transition-transform hover:scale-[1.02]"
              >
                {pending ? "Submitting..." : "Complete Onboarding"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
