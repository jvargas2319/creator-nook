import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CreateContentFormValues {
  title: string;
  description: string;
  contentType: string;
  contentUrl: string;
  isPremium: boolean;
}

export function CreateContentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<CreateContentFormValues>({
    defaultValues: {
      title: "",
      description: "",
      contentType: "article",
      contentUrl: "",
      isPremium: false,
    },
  });

  const onSubmit = async (values: CreateContentFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("content").insert({
        title: values.title,
        description: values.description,
        content_type: values.contentType,
        content_url: values.contentUrl,
        is_premium: values.isPremium,
        creator_id: (await supabase.auth.getUser()).data.user?.id,
        published_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Content created",
        description: "Your content has been published successfully.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPremium"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Premium Content</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Content
        </Button>
      </form>
    </Form>
  );
}