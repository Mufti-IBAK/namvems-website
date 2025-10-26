'use client';

import React, { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { registerForEvent, type RegistrationActionState } from '@/app/(public)/events/[id]/register/actions';
import { FaUser, FaUniversity, FaPhone, FaEnvelope, FaGraduationCap, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface EventRegistrationFormProps {
  eventId: number;
  eventTitle: string;
  isPaid?: boolean;
  feeAmount?: number;
  formSchema?: { id: string; label: string; type: 'short_text' | 'long_text' | 'select' | 'radio' | 'checkbox' | 'date' | 'number'; required?: boolean; options?: string[] }[];
  onSuccess?: (payload: { level: 'student'|'alumni'|'non_vet'|'other'; university: string }) => void;
  onCancel?: () => void;
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex-1 bg-primary text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            {pending ? (
                <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Submitting...
                </>
            ) : (
                label
            )}
        </button>
    );
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  formSchema,
  onSuccess,
  onCancel,
}) => {
  // const router = useRouter();
    const initialState: RegistrationActionState = { message: null, errors: {}, success: false };
    const [state, formAction] = useActionState(registerForEvent, initialState);

    // Controlled fields for payment redirection prefill
    const [level, setLevel] = useState<'student'|'alumni'|'non_vet'|'other'>('student');
    const [university, setUniversity] = useState('');

    // Dynamic answers
    const [answers, setAnswers] = useState<Record<string, unknown>>({});
    const setAnswer = (id: string, value: unknown) => setAnswers(prev => ({ ...prev, [id]: value }));

    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
            onSuccess?.({ level, university });
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, onSuccess, level, university]);


  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Registration</h2>
        <p className="text-lg text-gray-600">{eventTitle}</p>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="event_id" value={eventId} />
        <input type="hidden" name="form_answers" value={JSON.stringify(answers)} />
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
            <FaUser className="inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="full_name"
            required
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              state.errors?.full_name ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {state.errors?.full_name && <p className="text-red-500 text-sm mt-1">{state.errors.full_name[0]}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            <FaEnvelope className="inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              state.errors?.email ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            <FaPhone className="inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone_number"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              state.errors?.phone_number ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="+234 800 000 0000"
          />
          {state.errors?.phone_number && <p className="text-red-500 text-sm mt-1">{state.errors.phone_number[0]}</p>}
        </div>

        {/* Institution */}
        <div>
          <label htmlFor="institution" className="block text-sm font-semibold text-gray-700 mb-2">
            <FaUniversity className="inline mr-2" />
            University/Institution *
          </label>
          <input
            type="text"
            id="institution"
            name="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              state.errors?.university ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="Usmanu Danfodiyo University, Sokoto (UDUS)"
          />
          <p className="text-xs text-gray-500 mt-1">Type the full university name with acronym in brackets. Example above.</p>
          {state.errors?.university && <p className="text-red-500 text-sm mt-1">{state.errors.university[0]}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
            <FaGraduationCap className="inline mr-2" />
            Current Status *
          </label>
          <select
            id="status"
            name="level_of_study"
            value={level}
            onChange={(e) => setLevel(e.target.value as 'student'|'alumni'|'non_vet'|'other')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="non_vet">Non-Vet</option>
            <option value="other">Others</option>
          </select>
        </div>


        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
            Area of Interest/Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="e.g., Small Animal Medicine, Public Health"
          />
        </div>

        {/* Dynamic Form (if any) */}
        {Array.isArray(formSchema) && formSchema.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Additional Questions</h3>
            {formSchema.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor={`q_${q.id}`}>
                  {q.label} {q.required ? '*' : ''}
                </label>
                {q.type === 'short_text' && (
                  <input id={`q_${q.id}`} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" onChange={(e)=> setAnswer(q.id, e.target.value)} required={q.required} />
                )}
                {q.type === 'long_text' && (
                  <textarea id={`q_${q.id}`} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" rows={4} onChange={(e)=> setAnswer(q.id, e.target.value)} required={q.required} />
                )}
                {(q.type === 'select') && (
                  <select id={`q_${q.id}`} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" onChange={(e)=> setAnswer(q.id, e.target.value)} required={q.required}>
                    {(q.options ?? []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
                {(q.type === 'radio') && (
                  <div role="radiogroup" aria-labelledby={`q_${q.id}`}> 
                    {(q.options ?? []).map(opt => (
                      <label key={opt} className="flex items-center gap-2 mb-2">
                        <input type="radio" name={`q_${q.id}`} value={opt} onChange={()=> setAnswer(q.id, opt)} required={q.required} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {(q.type === 'checkbox') && (
                  <div>
                    {(q.options ?? []).map(opt => (
                      <label key={opt} className="flex items-center gap-2 mb-2">
                        <input type="checkbox" onChange={(e)=> {
                          const curr = (answers[q.id] as string[] | undefined) ?? [];
                          setAnswer(q.id, e.target.checked ? [...curr, opt] : curr.filter(x => x !== opt));
                        }} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'date' && (
                  <input id={`q_${q.id}`} type="date" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" onChange={(e)=> setAnswer(q.id, e.target.value)} required={q.required} />
                )}
                {q.type === 'number' && (
                  <input id={`q_${q.id}`} type="number" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent" onChange={(e)=> setAnswer(q.id, Number(e.target.value))} required={q.required} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Information
          </label>
          <textarea
            id="additionalInfo"
            name="additional_info"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
            placeholder="Any additional information you'd like to share..."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <SubmitButton label={'Complete Registration'} />
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transform hover:-translate-y-1"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm;
