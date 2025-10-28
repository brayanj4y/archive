-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create custom types for better data integrity
CREATE TYPE shipment_status AS ENUM ('pending', 'on_hold', 'in_transit', 'delivered');
CREATE TYPE package_type AS ENUM ('general', 'fragile', 'pet', 'international');
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'operator');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  
  -- Sender information
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  
  -- Receiver information
  receiver_name TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  
  -- Package details
  package_name TEXT NOT NULL,
  package_weight DECIMAL(10,2) NOT NULL CHECK (package_weight > 0),
  package_type package_type DEFAULT 'general',
  package_dimensions TEXT, -- JSON string for length, width, height
  
  -- Status and tracking
  current_status shipment_status DEFAULT 'pending',
  
  -- Financial information
  insurance_amount DECIMAL(10,2) DEFAULT 0 CHECK (insurance_amount >= 0),
  shipping_cost DECIMAL(10,2),
  
  -- Additional information
  special_instructions TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create status_updates table for tracking history
CREATE TABLE IF NOT EXISTS status_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE NOT NULL,
  status shipment_status NOT NULL,
  location TEXT,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE NOT NULL,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'status_update', 'delivery_confirmation', etc.
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_client_email ON shipments(client_email);
CREATE INDEX IF NOT EXISTS idx_shipments_receiver_email ON shipments(receiver_email);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
CREATE INDEX IF NOT EXISTS idx_status_updates_shipment_id ON status_updates(shipment_id);
CREATE INDEX IF NOT EXISTS idx_status_updates_created_at ON status_updates(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
