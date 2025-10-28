-- Add simulation timing fields to shipments table
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS paused_progress_percent DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_paused_duration INTEGER DEFAULT 0;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_start_time ON shipments(start_time);
CREATE INDEX IF NOT EXISTS idx_shipments_status_start_time ON shipments(current_status, start_time);

-- Update existing in_transit shipments to have a start_time if they don't have one
UPDATE shipments 
SET start_time = updated_at 
WHERE current_status = 'in_transit' AND start_time IS NULL;
