import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { IncidentReport } from '@/context/incident-report-context';

export async function GET() {
  try {
    const { data: reports, error } = await supabase.from('incident_reports').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const report: IncidentReport = await request.json();
    const { data, error } = await supabase.from('incident_reports').insert([report]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json(data?.[0] ?? report, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}