// src/app/(admin)/admin/resources/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { randomUUID } from 'crypto';

export type ActionState = {
    message: string | null;
    errors?: {
        title?: string[];
        type?: string[];
        resource_file?: string[];
    };
    success: boolean;
};

// --- Validation Constants ---
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
const ACCEPTED_FILE_TYPES = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'image/webp',
    'video/mp4',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// --- Zod Schema with File Validation ---
const ResourceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    description: z.string().optional(),
    type: z.string().min(1, { message: "Resource type is required." }),
    resource_file: z.instanceof(File)
        .optional()
        .refine((file) => !file || file.size > 0, "File is required.")
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
        .refine(
            (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
            "Only .pdf, .jpg, .png, .webp, .mp4, and .doc/docx files are accepted."
        ),
});

// --- Main Upsert Action (THIS WAS THE MISSING FUNCTION) ---
export async function upsertResource(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = createClient();
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user?.id || '').single();
    if (roleData?.role !== 'admin' && roleData?.role !== 'super_admin') {
        return { message: 'Unauthorized', success: false };
    }

    const validatedFields = ResourceSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check the fields.',
            success: false,
        };
    }

    const { id, resource_file, ...resourceData } = validatedFields.data;
    let download_url = '';
    let file_size = null;

    if (resource_file instanceof File && resource_file.size > 0) {
        const fileExtension = resource_file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;
        file_size = `${(resource_file.size / 1024 / 1024).toFixed(2)} MB`;

        const { error: uploadError } = await supabaseAdmin.storage.from('resource-files').upload(fileName, resource_file);
        if (uploadError) {
            return { message: `Storage Error: ${uploadError.message}`, success: false };
        }
        
        const { data: { publicUrl } } = supabase.storage.from('resource-files').getPublicUrl(fileName);
        download_url = publicUrl;
    } else if (id) {
        const { data: existingResource } = await supabase.from('resources').select('download_url, file_size').eq('id', id).single();
        download_url = existingResource?.download_url || '';
        file_size = existingResource?.file_size || null;
    } else {
        return { message: 'A file is required to create a new resource.', success: false };
    }
    
    const { error } = await supabase.from('resources').upsert({ id, ...resourceData, download_url, file_size });

    if (error) {
        return { message: `Database Error: ${error.message}`, success: false };
    }
    
    revalidatePath('/admin');
    revalidatePath('/admin/resources');
    
    return { success: true, message: id ? 'Resource updated successfully!' : 'Resource created successfully!' };
}

// --- Delete Action (Corrected and Simplified) ---
export async function deleteResource(resourceId: number): Promise<ActionState> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user?.id || '').single();
    if (roleData?.role !== 'admin' && roleData?.role !== 'super_admin') {
        return { message: 'Unauthorized', success: false };
    }

    const { error } = await supabase.from('resources').delete().eq('id', resourceId);
    if (error) {
        return { message: `Failed to delete resource: ${error.message}`, success: false };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/admin');
    
    return { success: true, message: 'Resource deleted successfully.' };
}