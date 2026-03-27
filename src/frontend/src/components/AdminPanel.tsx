import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAddPhoto,
  useDeletePhoto,
  useGetAllPhotos,
} from "../hooks/useQueries";

export function AdminPanel() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: photos = [] } = useGetAllPhotos();
  const addPhoto = useAddPhoto();
  const deletePhoto = useDeletePhoto();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !file) {
      toast.error("Please provide a title and select a photo.");
      return;
    }
    try {
      await addPhoto.mutateAsync({ title: title.trim(), file });
      toast.success("Photo uploaded successfully!");
      setTitle("");
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDelete = async (photoTitle: string) => {
    try {
      await deletePhoto.mutateAsync(photoTitle);
      toast.success("Photo deleted.");
    } catch {
      toast.error("Delete failed. Please try again.");
    }
  };

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-bold text-foreground mb-10 tracking-tight">
          Admin Panel
        </h2>

        {/* Upload Form */}
        <Card className="mb-12 border-border shadow-gallery">
          <CardHeader>
            <CardTitle className="font-display text-xl font-semibold flex items-center gap-2">
              <ImagePlus className="w-5 h-5" />
              Upload New Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="photo-title">Photo Title</Label>
              <Input
                data-ocid="admin.input"
                id="photo-title"
                placeholder="e.g. Golden Hour at Sunset"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-file">Select Photo</Label>
              {/* Use a label wrapping the file input for better accessibility */}
              <label
                data-ocid="admin.dropzone"
                htmlFor="photo-file"
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
              >
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white"
                      onClick={clearPreview}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to browse or drag &amp; drop a photo
                    </p>
                  </>
                )}
              </label>
              <input
                ref={fileRef}
                id="photo-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <Button
              data-ocid="admin.upload_button"
              onClick={handleUpload}
              disabled={addPhoto.isPending}
              className="w-full sm:w-auto"
            >
              {addPhoto.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>

            {addPhoto.isPending && (
              <p
                data-ocid="admin.loading_state"
                className="text-sm text-muted-foreground animate-pulse"
              >
                Uploading photo, please wait...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Manage Photos */}
        <h3 className="font-display text-xl font-semibold mb-6">
          Manage Photos ({photos.length})
        </h3>
        {photos.length === 0 ? (
          <p
            data-ocid="admin.empty_state"
            className="text-muted-foreground text-center py-12"
          >
            No photos uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <motion.div
                data-ocid={`admin.item.${i + 1}`}
                key={photo.title}
                className="relative group rounded-lg overflow-hidden border border-border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <img
                  src={photo.blob.getDirectURL()}
                  alt={photo.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white text-xs text-center font-medium truncate w-full px-2">
                    {photo.title}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        data-ocid={`admin.delete_button.${i + 1}`}
                        variant="destructive"
                        size="sm"
                        disabled={deletePhoto.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Photo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{photo.title}
                          &rdquo;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          data-ocid="admin.confirm_button"
                          onClick={() => handleDelete(photo.title)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
