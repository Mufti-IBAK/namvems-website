'use client'

import { useState } from 'react';
import { type EventFormQuestion, type EventFormQuestionType } from '@/lib/types';

function uid() { return Math.random().toString(36).slice(2, 10); }

function QuestionEditor({ q, onChange, onRemove }: { q: EventFormQuestion; onChange: (q: EventFormQuestion)=>void; onRemove: ()=>void }) {
  const types: EventFormQuestionType[] = ['short_text','long_text','select','radio','checkbox','date','number'];
  const needsOptions = q.type === 'select' || q.type === 'radio' || q.type === 'checkbox';
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor={`label-${q.id}`}>Question</label>
          <input id={`label-${q.id}`} value={q.label} onChange={(e)=> onChange({ ...q, label: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor={`type-${q.id}`}>Type</label>
          <select id={`type-${q.id}`} value={q.type} onChange={(e)=> {
            const newType = e.target.value as EventFormQuestionType;
            let next: EventFormQuestion = { ...q, type: newType };
            if (newType === 'select' || newType === 'radio' || newType === 'checkbox') {
              next = { ...next, options: q.options ?? ['Option 1'] };
            } else {
              const rest = { ...next } as Record<string, unknown>;
              const restWithOpts = rest as { options?: unknown };
              delete restWithOpts.options;
              next = restWithOpts as unknown as EventFormQuestion;
            }
            onChange(next);
          }} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input id={`req-${q.id}`} type="checkbox" checked={!!q.required} onChange={(e)=> onChange({ ...q, required: e.target.checked })} />
        <label htmlFor={`req-${q.id}`} className="text-sm text-gray-700">Required</label>
      </div>
      {needsOptions && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          <div className="space-y-2 mt-1">
            {(q.options ?? []).map((opt, idx)=> (
              <div key={`${q.id}-opt-${idx}`} className="flex gap-2">
                <input value={opt} onChange={(e)=> {
                  const arr = [...(q.options ?? [])];
                  arr[idx] = e.target.value;
                  onChange({ ...q, options: arr });
                }} className="flex-1 rounded-md border border-gray-300 px-3 py-2" aria-label={`Option ${idx + 1}`} placeholder="Option value" />
                <button type="button" onClick={()=> {
                  const arr = (q.options ?? []).filter((_,i)=> i!==idx);
                  onChange({ ...q, options: arr });
                }} className="px-3 py-2 bg-red-100 text-red-700 rounded-md">Remove</button>
              </div>
            ))}
            <button type="button" onClick={()=> onChange({ ...q, options: [...(q.options ?? []), `Option ${(q.options?.length ?? 0)+1}`] })} className="px-3 py-2 bg-gray-100 rounded-md">Add option</button>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onRemove} className="px-3 py-2 bg-gray-100 rounded-md">Delete question</button>
      </div>
    </div>
  );
}

export default function FormBuilderClient({ initialSchemaJSON, fieldName = 'internal_form_schema' }: { initialSchemaJSON: string; fieldName?: string }) {
  const [questions, setQuestions] = useState<EventFormQuestion[]>(()=> {
    try { const parsed = JSON.parse(initialSchemaJSON); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  });

  return (
    <div>
      <input type="hidden" name={fieldName} value={JSON.stringify(questions)} readOnly />
      {questions.length === 0 && (
        <p className="text-sm text-gray-500">No questions yet. Add your first question.</p>
      )}
      <div>
        {questions.map((q)=> (
          <QuestionEditor key={q.id} q={q} onChange={(newQ)=> setQuestions(prev => prev.map(x => x.id===q.id ? newQ : x))} onRemove={()=> setQuestions(prev => prev.filter(x => x.id!==q.id))} />
        ))}
      </div>
      <button type="button" onClick={()=> setQuestions(prev => [...prev, { id: uid(), label: 'Untitled question', type: 'short_text', required: false }])} className="px-4 py-2 bg-primary text-black rounded-lg">Add question</button>
    </div>
  );
}
