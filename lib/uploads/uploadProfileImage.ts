import { createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

export async function uploadImage(image: File) {
  const file = image;
  const timestamp = Date.now();
  const safeName = `${timestamp}_${file.name}`.replace(/\s+/g, "_");
  const path = `${safeName}`;

  const uploadRes = await supabase.storage.from("images").upload(path, file);
  // .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadRes.error) {
    console.error("Upload Error: ", uploadRes.error);
    return null;
    throw new Error("Failed to upload image");
  }

  const { data: publicUrlData } = await supabase.storage
    .from("images")
    .getPublicUrl(path);
  const imageUrl = publicUrlData?.publicUrl ?? null;
  return imageUrl;
}
