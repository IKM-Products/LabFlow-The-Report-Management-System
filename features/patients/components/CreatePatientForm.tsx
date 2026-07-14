'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientFormSchema, PatientFormValues } from '../schemas/patientSchema';
import { useMutatePatient } from '../hooks/use-mutate-patient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CreatePatientFormProps {
  onSuccess?: () => void;
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  // Leverage the mutation hook connected to the patientService wrapper
  const { registerPatient, isPending } = useMutatePatient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      mrn: '',
      first_name: '',
      last_name: '',
      dob: '',
      gender: 'M', // Explicitly initialized to prevent uncontrolled-to-controlled warnings
      phone: '',
      email: '',
      address: '',
    },
  });

  const currentGender = watch('gender');

  const onSubmit = async (values: PatientFormValues) => {
    try {
      // Execute the unified service layer POST action
      const success = await registerPatient(values);
      if (success) {
        reset();
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown registration error';
      console.error('Failed to commit patient structural data:', errorMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Patient Registration Intake</h2>
        <p className="text-xs text-slate-500 mt-1">LIMS technician registration core portal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medical Record Number (MRN) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">MRN ID Code</label>
            <Input
              placeholder="e.g., 1"
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isPending}
              {...register('mrn')}
            />
            {errors.mrn && (
              <p className="text-xs font-medium text-destructive">{errors.mrn.message}</p>
            )}
          </div>

          {/* Gender Switcher via Segmented Controller */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Gender Identity</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 h-10">
              {(['M', 'F', 'O'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    setValue('gender', g, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  className={`text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentGender === g
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p className="text-xs font-medium text-destructive">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">First Name</label>
            <Input
              placeholder="Jenish"
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isPending}
              {...register('first_name')}
            />
            {errors.first_name && (
              <p className="text-xs font-medium text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Last Name</label>
            <Input
              placeholder="Shrestha"
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isPending}
              {...register('last_name')}
            />
            {errors.last_name && (
              <p className="text-xs font-medium text-destructive">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Date of Birth</label>
            <Input
              type="date"
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isPending}
              {...register('dob')}
            />
            {errors.dob && (
              <p className="text-xs font-medium text-destructive">{errors.dob.message}</p>
            )}
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Contact Phone Number</label>
            <Input
              placeholder="9808766817"
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isPending}
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs font-medium text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Patient Email Address</label>
          <Input
            type="email"
            placeholder="jenish@gmail.com"
            className="rounded-xl h-10 focus-visible:ring-blue-500"
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Physical Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Residential Street Address</label>
          <Input
            placeholder="Thankot"
            className="rounded-xl h-10 focus-visible:ring-blue-500"
            disabled={isPending}
            {...register('address')}
          />
          {errors.address && (
            <p className="text-xs font-medium text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Form Action CTA */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-xs transition-all mt-2 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? 'Registering Patient Record...' : 'Save Patient & Create Account'}
        </Button>
      </form>
    </div>
  );
}