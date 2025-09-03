// src/app/(admin)/admin/users/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { User } from "@supabase/supabase-js";

// This is the core logic function. It is clean and has specific types.
// It throws an error on failure, which is a robust pattern for server-side logic.
async function updateUserRoleLogic(userId: string, newRole: string, currentUser: User) {
    const supabase = createClient();
    
    // Basic validation
    if (!userId || !newRole) {
        throw new Error('Invalid data provided to update role.');
    }
    // A super admin cannot demote their own account.
    if (userId === currentUser.id && newRole !== 'super_admin') {
        throw new Error('You cannot demote your own account.');
    }

    // Perform the database operation to update or insert the role.
    const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });

    if (error) {
        // If there's a database error, throw it to be caught by the calling function.
        throw new Error(`Supabase error while updating role: ${error.message}`);
    }
}

// --- This is the Server Action that the form calls ---
// It has the simple (formData) => Promise<void> signature that React's <form> action prop expects.
export async function updateUserRoleAction(formData: FormData) {
    const supabase = createClient();
    
    // 1. Security Check: Ensure the user performing the action is a super_admin
    const { data: { user } } = await supabase.auth.getUser();

    // --- FIX: Handle the case where the user might be null ---
    if (!user) {
        console.error("updateUserRoleAction failed: No user session found. The user might be logged out.");
        // In a real application, you might redirect or show an error here,
        // but for a server action, returning silently is often the safest.
        return;
    }
    
    const { data: roleData, error: roleError } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();

    if (roleError || roleData?.role !== 'super_admin') {
        console.error(`Unauthorized Action: User ${user.email} with role '${roleData?.role}' attempted to update a user role.`);
        return; // Exit silently for security
    }

    // 2. Get data from the form
    const targetUserId = formData.get('userId') as string;
    const newRole = formData.get('role') as string;

    // 3. Call the core logic and handle any errors
    try {
        await updateUserRoleLogic(targetUserId, newRole, user);
        // On success, revalidate the path so the change is visible on the next page load.
        revalidatePath('/admin/users');
    } catch (error: unknown) {
        // Log the detailed error on the server for debugging.
        // We check if it's an instance of Error to safely access the message property.
        if (error instanceof Error) {
            console.error("Failed to update user role:", error.message);
        } else {
            console.error("An unknown error occurred while updating user role:", error);
        }
        // In a real app, you might use a more advanced error handling system to report this.
    }
}