import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We need a Service Role key to bypass RLS for IoT webhooks, 
// because hardware devices usually don't have user session tokens.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, state, action } = body;

    if (!deviceId) {
      return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
    }

    // Step 1: Fetch the current device state to merge updates safely
    const { data: device, error: fetchErr } = await supabase
      .from('devices')
      .select('state')
      .eq('id', deviceId)
      .single();

    if (fetchErr || !device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Step 2: Determine new state based on 'action' or 'state' object
    let newState = { ...(device.state as any) };

    if (state) {
      // If the hardware pushes the exact state JSON, merge it
      newState = { ...newState, ...state };
    } else if (action) {
      // Universal action parsing (e.g. from IFTTT or Simple Webhooks)
      if (action === 'turn_on') newState.isOn = true;
      if (action === 'turn_off') newState.isOn = false;
      if (action === 'toggle') newState.isOn = !newState.isOn;
    }

    // Step 3: Update the device in the database
    // Because Supabase Realtime is enabled, this single UPDATE will broadcast 
    // to all connected clients (Dashboard / Mobile App) in ~50ms.
    const { error: updateErr } = await supabase
      .from('devices')
      .update({ state: newState })
      .eq('id', deviceId);

    if (updateErr) {
      throw updateErr;
    }

    return NextResponse.json({ success: true, new_state: newState }, { status: 200 });

  } catch (error: any) {
    console.error('IoT Gateway Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
