// src/app/(admin)/admin/users/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
    const supabase = createClient();
    const supabaseAdmin = createSupabaseAdminClient();

    // Security Check: Verify the user making the request is a super_admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user?.id || '').single();
    if (roleData?.role !== 'super_admin') {
        return { success: false, message: 'Unauthorized.' };
    }

    const targetUserId = formData.get('userId') as string;
    const newRole = formData.get('role') as string;

    if (!targetUserId || !newRole) {
        return { success: false, message: 'Invalid data.' };
    }
    if (targetUserId === user.id && newRole !== 'super_admin') {
        return { success: false, message: 'You cannot demote your own account.' };
    }

    // Use the privileged client to update another user's metadata if needed (optional)
    // For now, we only need to update the roles table.
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: targetUserId, role: newRole }, { onConflict: 'user_id' });

    if (error) {
        console.error('Error updating user role:', error.message);
        return { success: false, message: `Failed to update role: ${error.message}` };
    }

    revalidatePath('/admin/users');
    return { success: true, message: `Successfully updated role.` };
}