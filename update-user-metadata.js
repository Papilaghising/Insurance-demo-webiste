// update-user-metadata.js
import { createClient } from '@supabase/supabase-js';

// Load from environment variables or replace directly (do NOT commit this)
const SUPABASE_URL = 'https://ihjijyfxgxaroooejrkg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloamlqeWZ4Z3hhcm9vb2VqcmtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk5MzQyMiwiZXhwIjoyMDYzNTY5NDIyfQ.p98aWwdeU8l05676zkKfBSJtzDA_eDVDXlXulaqee3E';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY); 

// Replace with your actual user's UUID
const userId = '754cb06f-3c18-44db-87bb-d456205ed8f5';

const updateApprovalStatus = async () => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      role: 'agent',
      is_approved: true,
    },
  });

  if (error) {
    console.error('Error updating metadata:', error);
  } else {
    console.log('Metadata updated successfully:', data);
  }
};

updateApprovalStatus();
