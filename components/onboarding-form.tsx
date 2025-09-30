"use client"

import { userSchema } from '@/lib/schema';
import React, { useState } from 'react';
import { useForm } from "react-hook-form"; 
import z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod"
import { User } from '@prisma/client';
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
    image?:string
}

export type UserDataType = z.infer<typeof userSchema>;

export const OnboardingForm = ({name, email, image}: Props) => {
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
        try{
            setPending(true);
            await createUser(data);
        }catch (error){
            console.log(error);
            toast.error("Something went wrong. Try again later");
        }
    };

  return <div className='min-h-screen flex items-center justify-center bg-background'>  
    <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle>Welcome to Trackly</CardTitle>
            <CardDescription>
                Your project management - Simplified 
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                    control = {form.control}
                    name="name"
                    render = {({field}) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter full name" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control = {form.control}
                    name="country"
                    render = {({field}) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countryList.map(country => (
                                            <SelectItem key={country.code} value={country.name}>
                                                <div className="flex flex-row items-center">
                                                    <img 
                                                    src={country.flag} 
                                                    alt={country.name} 
                                                    className="w-4 h-3"
                                                    />
                                                    <p className="pl-2">{country.name}</p>
                                                </div>
                                            </SelectItem>
                                        )
                                        )}
                                    </SelectContent>
                                </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                        control = {form.control}
                        name="industryType"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel>Industry Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select industry type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {industryTypeList.map(industry => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            )
                                            )}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control = {form.control}
                        name="role"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel>Role at Organization</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roleList.map(role => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            )
                                            )}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                    control = {form.control}
                    name="about"
                    render = {({field}) => (
                        <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Tell us about yourself" className="resize-none">
                                </Textarea>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={pending} className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  </div>;
};