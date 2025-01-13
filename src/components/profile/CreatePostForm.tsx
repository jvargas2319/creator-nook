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
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreatePostFormValues {
  title: string;
  description: string;
  media: FileList;
}

interface CreatePostFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostForm({ isOpen, onClose }: CreatePostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const form = useForm<CreatePostFormValues>();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    if (selectedFiles.length + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Too many files",
        description: "You can only upload up to 5 media files per post.",
      });
      return;
    }

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length !== newFiles.length) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only images and videos are allowed.",
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: CreatePostFormValues) => {
    if (selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No media selected",
        description: "Please select at least one image or video.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to create a post");
      }

      console.log("Uploading files for user:", user.id);

      const mediaUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          
          console.log("Uploading file:", fileName);
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile_images')
            .upload(fileName, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('profile_images')
            .getPublicUrl(fileName);
          
          return {
            url: publicUrl,
            type: file.type.startsWith('image/') ? 'image' : 'video'
          };
        })
      );

      console.log("Files uploaded successfully:", mediaUrls);

      const { error: insertError } = await supabase.from("content").insert({
        title: values.title,
        description: values.description,
        content_type: "post",
        content_image_url: mediaUrls[0].url, // Main image/video
        content_url: mediaUrls.length > 1 ? JSON.stringify(mediaUrls.slice(1)) : null, // Additional media
        creator_id: user.id,
        published_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });

      form.reset();
      setSelectedFiles([]);
      onClose();
    } catch (error: any) {
      console.error("Form submission error:", error);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-foreground" />
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
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-foreground">Media (up to 5 files)</FormLabel>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="text-foreground"
                multiple
              />
              
              <div className="grid grid-cols-2 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Post
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}