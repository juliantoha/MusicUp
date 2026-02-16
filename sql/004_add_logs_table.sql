-- Migration 004: Add logs table for observability and auditing
-- Tracks key events: bookings, concert completion, hours granted, emails sent

-- Create logs table
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event TEXT NOT NULL,
  actor_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_logs_event ON logs(event);
CREATE INDEX idx_logs_actor ON logs(actor_profile_id);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX idx_logs_event_created_at ON logs(event, created_at DESC);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for logs table

-- Admins and super admins can view all logs
CREATE POLICY "Admins and super admins can view logs"
ON logs FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'super_admin')
  )
);

-- System can insert logs (service role)
-- No user-facing insert policy - logs are created by server actions only

-- Prevent updates and deletes (immutable audit log)
-- No UPDATE or DELETE policies - logs are append-only

-- Add comment for documentation
COMMENT ON TABLE logs IS 'Immutable audit log for key system events. Tracks bookings, concerts, hours, and emails.';
COMMENT ON COLUMN logs.event IS 'Event type: booking.created, booking.changed, booking.cancelled, concert.completed, hours.granted, email.sent';
COMMENT ON COLUMN logs.actor_profile_id IS 'User who triggered the event (NULL for system events)';
COMMENT ON COLUMN logs.payload IS 'Event-specific data in JSON format';
