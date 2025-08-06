import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { IncidentReport } from '@/context/incident-report-context';

export async function GET() {
  try {
    const db = await getDb();
    const reports = await db.all('SELECT * FROM incident_reports');
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const report: IncidentReport = await request.json();
    const db = await getDb();
    await db.run(
      'INSERT INTO incident_reports (id, guard, location, description, timestamp) VALUES (?, ?, ?, ?, ?)',
      [report.id, report.guard, report.location, report.description, report.timestamp]
    );
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}