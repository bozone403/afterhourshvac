import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  issue: z.string().min(1, { message: 'Please select an issue type.' }),
  description: z.string().min(5, { message: 'Please provide a brief description of the issue.' })
});

type FormData = z.infer<typeof formSchema>;

const EmergencyForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      issue: '',
      description: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setFormSuccess(false);
    setFormError(false);
    
    try {
      await apiRequest('POST', '/api/emergency-request', data);
      
      setFormSuccess(true);
      toast({
        title: 'Emergency Request Sent',
        description: 'We\'ve received your emergency request and will contact you shortly.',
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting emergency form:', error);
      setFormError(true);
      toast({
        title: 'Submission Error',
        description: 'There was a problem sending your request. Please try again or call us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-lightgray mb-1">Full Name</label>
        <input 
          type="text" 
          id="name"
          className={`w-full bg-dark border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary`} 
          disabled={isSubmitting}
          {...register('name')}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-lightgray mb-1">Phone Number</label>
        <input 
          type="tel" 
          id="phone"
          className={`w-full bg-dark border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
          disabled={isSubmitting}
          {...register('phone')}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
      </div>
      
      <div>
        <label htmlFor="issue" className="block text-sm font-medium text-lightgray mb-1">Issue Type</label>
        <select 
          id="issue"
          className={`w-full bg-dark border ${errors.issue ? 'border-red-500' : 'border-gray-700'} rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
          disabled={isSubmitting}
          {...register('issue')}
        >
          <option value="">Select an issue</option>
          <option value="no-heat">No Heat</option>
          <option value="no-ac">No AC</option>
          <option value="water-leak">Water Leak</option>
          <option value="strange-noise">Strange Noise</option>
          <option value="other">Other Issue</option>
        </select>
        {errors.issue && <p className="mt-1 text-sm text-red-500">{errors.issue.message}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-lightgray mb-1">Brief Description</label>
        <textarea 
          id="description"
          rows={3} 
          className={`w-full bg-dark border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary`}
          disabled={isSubmitting}
          {...register('description')}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>
      
      <div>
        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Submit Emergency Request"}
        </button>
      </div>
      
      {formSuccess && (
        <div className="bg-green-800 bg-opacity-50 border border-green-700 text-white p-3 rounded-md">
          Thank you! We've received your emergency request and will contact you shortly.
        </div>
      )}
      
      {formError && (
        <div className="bg-red-800 bg-opacity-50 border border-red-700 text-white p-3 rounded-md">
          There was an error submitting your request. Please try again or call us directly at (403) 613-6014.
        </div>
      )}
    </form>
  );
};

export default EmergencyForm;
