import { createClient } from "@supabase/supabase-js";

const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyY2l5bWtzb3lxZm9ramhrZ3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MDAwNjEsImV4cCI6MjExMDQ3NjA2MX0.HzORqg1xENrINgWVzL1yZK2V2jGHI5YgqEM1016HUAY";
const supabaseUrl = "https://srciymksoyqfokjhkgxx.supabase.co";

const supabase = createClient(supabaseUrl, anonKey);

export default async function mediaUpload(file) {
    if (!file) {
        throw new Error("No file selected");
    }

    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;

    const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
            upsert: false,
            cacheControl: "3600",
        });

    if (error) {
        throw new Error(error.message || "An error occurred during upload");
    }

    const { data } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

    return data?.publicUrl;
}