'use client'

import { useActionState, useEffect } from 'react';
import { updateAssociationDues, type SettingsActionState } from './actions';
import toast from 'react-hot-toast';

export default function PaymentSettingsClient({ defaultAmount }: { defaultAmount: number }) {
  const initial: SettingsActionState = { message: null, success: false };
  const [state, formAction] = useActionState(updateAssociationDues, initial);

  useEffect(() => {
    if (state.message) {
      if (state.success) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl card-shadow max-w-md">
      <div>
        <label htmlFor="association_dues_amount" className="block text-sm font-medium text-gray-700">Association Dues (NGN)</label>
        <input
          id="association_dues_amount"
          name="association_dues_amount"
          type="number"
          min="0"
          step="0.01"
          defaultValue={defaultAmount || 0}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          aria-describedby="assoc-help"
          required
        />
        <p id="assoc-help" className="mt-1 text-xs text-gray-500">This amount will be used for Association Dues payments.</p>
      </div>
      <div className="pt-4">
        <button type="submit" className="btn-primary">Save</button>
      </div>
    </form>
  );
}