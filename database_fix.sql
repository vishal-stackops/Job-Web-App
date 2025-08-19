-- Fix the foreign key constraint for saved_jobs table
-- This will allow jobs to be deleted even when they have saved job references

-- First, drop the existing foreign key constraint
ALTER TABLE saved_jobs 
DROP FOREIGN KEY FKawvc9t3d3efu6ta6h30tb984t;

-- Then add the constraint back with ON DELETE CASCADE
ALTER TABLE saved_jobs 
ADD CONSTRAINT FK_saved_jobs_job_id 
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- Also fix the seeker foreign key if needed
ALTER TABLE saved_jobs 
DROP FOREIGN KEY FK_saved_jobs_seeker_id;

ALTER TABLE saved_jobs 
ADD CONSTRAINT FK_saved_jobs_seeker_id 
FOREIGN KEY (seeker_id) REFERENCES seekers(id) ON DELETE CASCADE; 